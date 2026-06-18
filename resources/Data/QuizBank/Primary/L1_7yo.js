// Data/QuizBank/Primary/L1_7yo.js
export const L1_questions = {
  // Mathematics questions for Age 7
  mathematic: [
    {
      "id": "L1_MATH_1",
      "question": "Berapakah 5 + 3?",
      "options": ["6", "7", "8", "9"],
      "correctAnswer": 2,
      "explanation": "5 + 3 = 8. Cuba kira dengan jari: 5 jari + 3 jari = 8 jari.",
      "category": "Aritmetik",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "🔢"
    },
    {
      "id": "L1_MATH_2",
      "question": "Berapakah 10 - 4?",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": 1,
      "explanation": "10 - 4 = 6. Cuba kira: dari 10, turun 4 = 6.",
      "category": "Aritmetik",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "➖"
    },
    {
      "id": "L1_MATH_3",
      "question": "Berapakah 2 × 3?",
      "options": ["4", "5", "6", "7"],
      "correctAnswer": 2,
      "explanation": "2 × 3 = 6. Ini bermaksud 2 kumpulan dengan 3 dalam setiap kumpulan.",
      "category": "Pendaraban",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "✖️"
    }
  ],

  // Science questions for Age 7
  science: [
    {
      "id": "L1_SCI_1",
      "question": "Haiwan manakah yang berkokok pada waktu pagi?",
      "options": ["Kucing", "Ayam", "Anjing", "Burung"],
      "correctAnswer": 1,
      "explanation": "Ayam jantan berkokok pada waktu pagi untuk menandakan hari sudah siang.",
      "category": "Haiwan",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "🐔"
    },
    {
      "id": "L1_SCI_2",
      "question": "Buah apakah yang berwarna kuning dan berbentuk bengkok?",
      "options": ["Epal", "Pisang", "Oren", "Anggur"],
      "correctAnswer": 1,
      "explanation": "Pisang berwarna kuning dan berbentuk bengkok. Ia kaya dengan potassium.",
      "category": "Tumbuhan",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "🍌"
    },
    {
      "id": "L1_SCI_3",
      "question": "Berapakah kaki yang dimiliki oleh seekor kucing?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": 2,
      "explanation": "Kucing mempunyai 4 kaki seperti kebanyakan mamalia.",
      "category": "Haiwan",
      "difficulty": "easy",
      "timeLimit": 10,
      "emoji": "🐱"
    }
  ],

  // History questions for Age 7
  history: [
    {
      "id": "L1_HIS_1",
      "question": "Apakah warna bendera Malaysia?",
      "options": ["Merah & Kuning", "Biru & Putih", "Hijau & Merah", "Ungu & Oren"],
      "correctAnswer": 0,
      "explanation": "Bendera Malaysia berwarna merah, putih, biru dan kuning. Warna merah dan putih melambangkan keberanian dan kesucian.",
      "category": "Kewarganegaraan",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "🇲🇾"
    },
    {
      "id": "L1_HIS_2",
      "question": "Siapakah Yang di-Pertuan Agong?",
      "options": ["Presiden", "Raja", "Perdana Menteri", "Polis"],
      "correctAnswer": 1,
      "explanation": "Yang di-Pertuan Agong adalah Raja Malaysia.",
      "category": "Kewarganegaraan",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "👑"
    },
    {
      "id": "L1_HIS_3",
      "question": "Apakah nama ibu negara Malaysia?",
      "options": ["Johor Bahru", "Kuala Lumpur", "Penang", "Melaka"],
      "correctAnswer": 1,
      "explanation": "Kuala Lumpur adalah ibu negara Malaysia.",
      "category": "Geografi",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "🏛️"
    }
  ]
};

// Get all questions for this level
export const getAllL1Questions = () => {
  return [
    ...L1_questions.mathematic,
    ...L1_questions.science,
    ...L1_questions.history
  ];
};

// Get questions by subject for this level
export const getL1QuestionsBySubject = (subject) => {
  return L1_questions[subject] || [];
};

// Get random questions from this level
export const getRandomL1Questions = (count = 5) => {
  const allQuestions = getAllL1Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};