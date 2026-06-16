export const getStudentData = () => {
  return Promise.resolve({
    attendance: 85,
    assignments: 6,
    performance: "Good",
    marks: [
      { name: "Mon", marks: 70 },
      { name: "Tue", marks: 80 },
      { name: "Wed", marks: 65 },
      { name: "Thu", marks: 90 },
    ],
  });
};