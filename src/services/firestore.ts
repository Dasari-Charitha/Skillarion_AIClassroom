import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const fallbackStudentData = {
  name: "Aarav Sharma",
  attendance: 86,
  grade: "A",
  chartData: [
    { name: "Mon", value: 72 },
    { name: "Tue", value: 78 },
    { name: "Wed", value: 84 },
    { name: "Thu", value: 82 },
    { name: "Fri", value: 88 },
  ],
  rank: 3,
  percentile: 94,
  feedback:
    "Strong progress this week. Keep practicing database queries and revise operating systems concepts before the next assessment.",
  weakArea: "Database normalization and SQL joins",
  leaderboardName: "Aarav Sharma",
  nearestCompetitor: "Neha Reddy",
  competitorDelta: 4,
  recommendedTopic: "SQL Joins and Query Optimization",
  practiceLevel: "Intermediate",
  practiceQuestions: 20,
};

export async function getStudentDoc() {
  try {
    const ref = doc(db, "dashboards", "student");
    const snap = await getDoc(ref);

    if (!snap.exists()) return fallbackStudentData;

    return {
      ...fallbackStudentData,
      ...snap.data(),
    } as typeof fallbackStudentData;
  } catch (error) {
    console.warn("Using fallback student dashboard data:", error);
    return fallbackStudentData;
  }
}
