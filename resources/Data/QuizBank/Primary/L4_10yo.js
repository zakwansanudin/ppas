// Data/QuizBank/Primary/L4_10yo.js
export const L4_questions = {
  mathematic: [
    {
      "id": "L4_MATH_1",
      "question": "What is 25 × 4?",
      "options": ["80", "90", "100", "110"],
      "correctAnswer": 2,
      "explanation": "25 × 4 = 100. 25 multiplied by 4 equals 100.",
      "category": "Multiplication",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "✖️"
    }
    // ... more questions
  ],
  science: [
    // ... science questions
  ],
  history: [
    // ... history questions
  ]
};

// Make sure you have this export
export const getAllL4Questions = () => {
  return [
    ...L4_questions.mathematic,
    ...L4_questions.science,
    ...L4_questions.history
  ];
};