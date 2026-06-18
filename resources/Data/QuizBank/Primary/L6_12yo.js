// Data/QuizBank/Primary/L6_12yo.js
export const L6_questions = {
  // Mathematics questions for Age 12
  mathematic: [
    {
      "id": "L6_MATH_1",
      "question": "Selesaikan: 3x + 7 = 22",
      "options": ["x = 3", "x = 4", "x = 5", "x = 6"],
      "correctAnswer": 2,
      "explanation": "3x + 7 = 22 → 3x = 22 - 7 → 3x = 15 → x = 5",
      "category": "Algebra",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🧮"
    },
    {
      "id": "L6_MATH_2",
      "question": "Berapakah isipadu kubus dengan sisi 4cm?",
      "options": ["16cm³", "32cm³", "64cm³", "128cm³"],
      "correctAnswer": 2,
      "explanation": "Isipadu kubus = sisi³ = 4cm × 4cm × 4cm = 64cm³",
      "category": "Geometri",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "📦"
    },
    {
      "id": "L6_MATH_3",
      "question": "Purata 5, 8, 12, 15, dan 20 adalah:",
      "options": ["10", "12", "14", "16"],
      "correctAnswer": 1,
      "explanation": "Purata = (5 + 8 + 12 + 15 + 20) ÷ 5 = 60 ÷ 5 = 12",
      "category": "Statistik",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "📊"
    }
  ],

  // Science questions for Age 12
  science: [
    {
      "id": "L6_SCI_1",
      "question": "Apakah sumber tenaga utama Bumi?",
      "options": ["Angin", "Air", "Matahari", "Gas asli"],
      "correctAnswer": 2,
      "explanation": "Matahari adalah sumber tenaga utama Bumi yang membekalkan haba dan cahaya untuk kehidupan.",
      "category": "Tenaga",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "☀️"
    },
    {
      "id": "L6_SCI_2",
      "question": "Sistem organ manakah yang bertanggungjawab untuk peredaran darah?",
      "options": ["Sistem pencernaan", "Sistem peredaran darah", "Sistem saraf", "Sistem pernafasan"],
      "correctAnswer": 1,
      "explanation": "Sistem peredaran darah mengedarkan darah ke seluruh badan melalui jantung dan salur darah.",
      "category": "Biologi",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "❤️"
    },
    {
      "id": "L6_SCI_3",
      "question": "Apakah yang menyebabkan gempa bumi?",
      "options": ["Gelombang laut", "Pergerakan plat tektonik", "Letusan gunung berapi", "Ribut petir"],
      "correctAnswer": 1,
      "explanation": "Gempa bumi disebabkan oleh pergerakan plat tektonik di kerak Bumi.",
      "category": "Geologi",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "🌍"
    }
  ],

  // History questions for Age 12
  history: [
    {
      "id": "L6_HIS_1",
      "question": "Pada tahun berapakah Malaysia ditubuhkan?",
      "options": ["1945", "1957", "1963", "1965"],
      "correctAnswer": 2,
      "explanation": "Malaysia ditubuhkan pada 16 September 1963 melalui penyatuan Malaya, Sabah, Sarawak dan Singapura.",
      "category": "Sejarah Negara",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "🏛️"
    },
    {
      "id": "L6_HIS_2",
      "question": "Siapakah perdana menteri Malaysia yang pertama?",
      "options": ["Tun Dr. Mahathir Mohamad", "Tunku Abdul Rahman", "Tun Hussein Onn", "Tun Abdul Razak"],
      "correctAnswer": 1,
      "explanation": "Tunku Abdul Rahman adalah perdana menteri Malaysia yang pertama (1957-1970).",
      "category": "Sejarah Negara",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "👔"
    },
    {
      "id": "L6_HIS_3",
      "question": "Apakah nama perjanjian yang membawa kepada kemerdekaan Malaysia?",
      "options": ["Perjanjian London", "Perjanjian Pangkor", "Perjanjian Persekutuan", "Perjanjian Kemerdekaan"],
      "correctAnswer": 0,
      "explanation": "Perjanjian London 1956 menetapkan tarikh kemerdekaan Malaysia.",
      "category": "Sejarah Negara",
      "difficulty": "hard",
      "timeLimit": 25,
      "emoji": "📜"
    }
  ]
};

export const getAllL6Questions = () => {
  return [
    ...L6_questions.mathematic,
    ...L6_questions.science,
    ...L6_questions.history
  ];
};

export const getL6QuestionsBySubject = (subject) => {
  return L6_questions[subject] || [];
};

export const getRandomL6Questions = (count = 5) => {
  const allQuestions = getAllL6Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};