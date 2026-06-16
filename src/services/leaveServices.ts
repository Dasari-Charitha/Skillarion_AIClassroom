import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export type LeaveRequest = {
  id?: string;
  studentName: string;
  role: "Student" | "Teacher" | "Staff";
  department?: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt?: unknown;
};

const leaveCollection = collection(db, "leaveRequests");
const LOCAL_LEAVES_KEY = "aiClassroomLocalLeaveRequests";
const LOCAL_LEAVES_EVENT = "aiClassroomLocalLeavesChanged";

const readLocalLeaves = (): LeaveRequest[] => {
  try {
    const rawLeaves = localStorage.getItem(LOCAL_LEAVES_KEY);
    return rawLeaves ? (JSON.parse(rawLeaves) as LeaveRequest[]) : [];
  } catch (error) {
    console.warn("Failed to read local leave requests:", error);
    return [];
  }
};

const writeLocalLeaves = (leaves: LeaveRequest[]) => {
  localStorage.setItem(LOCAL_LEAVES_KEY, JSON.stringify(leaves));
  window.dispatchEvent(new Event(LOCAL_LEAVES_EVENT));
};

const createLocalLeave = (
  leaveData: Omit<LeaveRequest, "id" | "status" | "createdAt">
) => {
  const localLeave: LeaveRequest = {
    ...leaveData,
    id: `local-${Date.now()}`,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  writeLocalLeaves([localLeave, ...readLocalLeaves()]);
};

export const applyLeave = async (
  leaveData: Omit<LeaveRequest, "id" | "status" | "createdAt">
) => {
  try {
    await addDoc(leaveCollection, {
      ...leaveData,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Saving leave request locally:", error);
    createLocalLeave(leaveData);
  }
};

export const listenLeaveRequests = (
  callback: (leaves: LeaveRequest[]) => void
) => {
  const q = query(leaveCollection);
  let firestoreLeaves: LeaveRequest[] = [];
  let usingLocalFallback = false;

  const emitLeaves = () => {
    const localLeaves = readLocalLeaves();
    callback(usingLocalFallback ? localLeaves : [...localLeaves, ...firestoreLeaves]);
  };

  const handleLocalLeavesChange = () => emitLeaves();
  window.addEventListener(LOCAL_LEAVES_EVENT, handleLocalLeavesChange);

  const unsubscribeFirestore = onSnapshot(
    q,
    (snapshot) => {
      usingLocalFallback = false;
      firestoreLeaves = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as LeaveRequest[];

      emitLeaves();
    },
    (error) => {
      console.warn("Leave requests unavailable:", error);
      usingLocalFallback = true;
      emitLeaves();
    }
  );

  emitLeaves();

  return () => {
    window.removeEventListener(LOCAL_LEAVES_EVENT, handleLocalLeavesChange);
    unsubscribeFirestore();
  };
};

export const updateLeaveStatus = async (
  id: string,
  status: "Approved" | "Rejected"
) => {
  if (id.startsWith("local-")) {
    writeLocalLeaves(
      readLocalLeaves().map((leave) =>
        leave.id === id ? { ...leave, status } : leave
      )
    );
    return;
  }

  try {
    const leaveRef = doc(db, "leaveRequests", id);
    await updateDoc(leaveRef, { status });
  } catch (error) {
    console.warn("Failed to update Firestore leave request:", error);
    throw error;
  }
};
