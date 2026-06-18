// Data/QuizBank/Primary/L5_11yo.js
export const L5_questions = {
  // Mathematics questions for Age 11
  mathematic: [
    {
      "id": "L5_MATH_1",
      "question": "Berapakah 3/4 + 1/2?",
      "options": ["1", "1 1/4", "1 1/2", "1 3/4"],
      "correctAnswer": 1,
      "explanation": "3/4 + 1/2 = 3/4 + 2/4 = 5/4 = 1 1/4",
      "category": "Pecahan",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "➗"
    },
    {
      "id": "L5_MATH_2",
      "question": "Berapakah 15% daripada 200?",
      "options": ["15", "20", "25", "30"],
      "correctAnswer": 3,
      "explanation": "15% daripada 200 = 15/100 × 200 = 30",
      "category": "Peratusan",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "📊"
    },
    {
      "id": "L5_MATH_3",
      "question": "Luas segi empat tepat dengan panjang 8cm dan lebar 5cm adalah:",
      "options": ["13cm²", "26cm²", "40cm²", "80cm²"],
      "correctAnswer": 2,
      "explanation": "Luas = panjang × lebar = 8cm × 5cm = 40cm²",
      "category": "Geometri",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "📐"
    }
  ],

  // Science questions for Age 11
  science: [
    {
      "id": "L5_SCI_1",
      "question": "Apakah proses di mana tumbuhan membuat makanan sendiri?",
      "options": ["Respirasi", "Fotosintesis", "Pencernaan", "Penyerapan"],
      "correctAnswer": 1,
      "explanation": "Fotosintesis adalah proses di mana tumbuhan menggunakan cahaya matahari, air dan karbon dioksida untuk menghasilkan makanan (glukosa) dan oksigen.",
      "category": "Biologi",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🌿"
    },
    {
      "id": "L5_SCI_2",
      "question": "Planet manakah yang terdekat dengan Matahari?",
      "options": ["Venus", "Bumi", "Marikh", "Utarid"],
      "correctAnswer": 3,
      "explanation": "Utarid (Mercury) adalah planet yang terdekat dengan Matahari dalam sistem suria kita.",
      "category": "Astronomi",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "🪐"
    },
    {
      "id": "L5_SCI_3",
      "question": "Apakah yang mengalir dalam litar elektrik?",
      "options": ["Air", "Udara", "Elektron", "Haba"],
      "correctAnswer": 2,
      "explanation": "Elektron mengalir dalam litar elektrik, menghasilkan arus elektrik.",
      "category": "Fizik",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "⚡"
    }
  ],

  // History questions for Age 11
  history: [
    {
      "id": "L5_HIS_1",
      "question": "Siapakah yang dikenali sebagai Bapa Kemerdekaan Malaysia?",
      "options": ["Tun Dr. Ismail", "Tun Hussein Onn", "Tun Abdul Razak", "Tunku Abdul Rahman"],
      "correctAnswer": 3,
      "explanation": "Tunku Abdul Rahman Putra Al-Haj dikenali sebagai Bapa Kemerdekaan Malaysia kerana memimpin Malaysia mencapai kemerdekaan pada 31 Ogos 1957.",
      "category": "Sejarah Negara",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "👑"
    },
    {
      "id": "L5_HIS_2",
      "question": "Pada tahun berapakah Malaysia mencapai kemerdekaan?",
      "options": ["1945", "1957", "1963", "1965"],
      "correctAnswer": 1,
      "explanation": "Malaysia mencapai kemerdekaan pada 31 Ogos 1957 dari British.",
      "category": "Sejarah Negara",
      "difficulty": "easy",
      "timeLimit": 15,
      "emoji": "🇲🇾"
    },
    {
      "id": "L5_HIS_3",
      "question": "Apakah nama lama bagi Malaysia sebelum kemerdekaan?",
      "options": ["Malaya", "Nusantara", "Srivijaya", "Melaka"],
      "correctAnswer": 0,
      "explanation": "Sebelum kemerdekaan, Malaysia dikenali sebagai Tanah Melayu atau Malaya.",
      "category": "Sejarah Negara",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "📜"
    }
  ]
};

export const getAllL5Questions = () => {
  return [
    ...L5_questions.mathematic,
    ...L5_questions.science,
    ...L5_questions.history
  ];
};

export const getL5QuestionsBySubject = (subject) => {
  return L5_questions[subject] || [];
};

export const getRandomL5Questions = (count = 5) => {
  const allQuestions = getAllL5Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};