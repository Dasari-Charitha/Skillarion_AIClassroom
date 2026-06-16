import { useState } from "react";
import MainLayout from "../layout/MainLayout";

const questions = [
  {
    question: "What is a data structure?",
    options: [
      "A way to store data",
      "A programming language",
      "A database",
      "An OS feature",
    ],
    answer: 0,
  },
  {
    question: "Which is a linear data structure?",
    options: ["Tree", "Graph", "Array", "Heap"],
    answer: 2,
  },
];

export default function TakeTest() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <MainLayout>
        <div className="glass p-6 text-center">
          <h1 className="text-3xl text-yellow-400">Test Completed</h1>
          <p className="mt-4 text-xl">
            Your Score: {score} / {questions.length}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl text-yellow-400 font-bold">
        Take Test
      </h1>

      <div className="glass p-6 mt-6">
        <p className="text-lg mb-4">
          Q{current + 1}. {questions[current].question}
        </p>

        <div className="space-y-3">
          {questions[current].options.map((opt, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`w-full text-left p-3 rounded border ${
                selected === index
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-800 border-white/10"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="mt-5 bg-yellow-400 text-black px-6 py-2 rounded"
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </MainLayout>
  );
}