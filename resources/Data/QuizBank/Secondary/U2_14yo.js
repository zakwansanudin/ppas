// Data/QuizBank/Secondary/U2_14yo.js
export const U2_questions = {
  // Mathematics questions for Age 14
  mathematic: [
    {
      "id": "U2_MATH_1",
      "question": "Faktorkan: x² + 5x + 6",
      "options": ["(x+2)(x+3)", "(x+1)(x+6)", "(x+2)(x+4)", "(x+3)(x+3)"],
      "correctAnswer": 0,
      "explanation": "x² + 5x + 6 = (x+2)(x+3) kerana 2×3=6 dan 2+3=5",
      "category": "Algebra",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🧮"
    },
    {
      "id": "U2_MATH_2",
      "question": "Selesaikan sistem persamaan: 2x + y = 7, x - y = 2",
      "options": ["x=3, y=1", "x=2, y=3", "x=4, y=1", "x=3, y=2"],
      "correctAnswer": 0,
      "explanation": "Tambah kedua-dua persamaan: 3x = 9 → x=3, gantikan: 2(3)+y=7 → y=1",
      "category": "Algebra",
      "difficulty": "medium",
      "timeLimit": 30,
      "emoji": "⚖️"
    },
    {
      "id": "U2_MATH_3",
      "question": "Hitung luas bulatan dengan jejari 7cm (gunakan π=22/7)",
      "options": ["44cm²", "88cm²", "154cm²", "308cm²"],
      "correctAnswer": 2,
      "explanation": "Luas = πr² = (22/7) × 7 × 7 = 22 × 7 = 154cm²",
      "category": "Geometri",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "⚫"
    }
  ],

  // Science questions for Age 14
  science: [
    {
      "id": "U2_SCI_1",
      "question": "Apakah yang dimaksudkan dengan daya?",
      "options": ["Jisim × isipadu", "Jisim × halaju", "Jisim × pecutan", "Halaju × masa"],
      "correctAnswer": 2,
      "explanation": "Daya = jisim × pecutan (Hukum Newton Kedua: F = ma)",
      "category": "Fizik",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "💪"
    },
    {
      "id": "U2_SCI_2",
      "question": "Apakah pH bagi larutan neutral?",
      "options": ["0", "7", "14", "10"],
      "correctAnswer": 1,
      "explanation": "pH 7 adalah neutral. pH <7 adalah asid, pH >7 adalah alkali.",
      "category": "Kimia",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "🧪"
    },
    {
      "id": "U2_SCI_3",
      "question": "Proses apakah yang digunakan oleh tumbuhan untuk menyerap air dari tanah?",
      "options": ["Fotosintesis", "Osmosis", "Respirasi", "Transpirasi"],
      "correctAnswer": 1,
      "explanation": "Osmosis adalah proses pergerakan air dari kawasan kepekatan tinggi ke rendah melalui membran separa telap.",
      "category": "Biologi",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "🌱"
    }
  ],

  // History questions for Age 14
  history: [
    {
      "id": "U2_HIS_1",
      "question": "Apakah kesan utama Dasar Ekonomi Baru (DEB) yang dilancarkan pada 1971?",
      "options": ["Pembangunan industri berat", "Pembasmian kemiskinan dan penyusunan semula masyarakat", "Pengenalan cukai GST", "Penswastaan syarikat kerajaan"],
      "correctAnswer": 1,
      "explanation": "DEB dilancarkan untuk membasmi kemiskinan dan menyusun semula masyarakat untuk mengurangkan ketidakseimbangan ekonomi antara kaum.",
      "category": "Sejarah Ekonomi",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "📈"
    },
    {
      "id": "U2_HIS_2",
      "question": "Siapakah Sultan Melaka yang pertama?",
      "options": ["Sultan Mahmud Shah", "Sultan Alauddin Riayat Shah", "Sultan Muzaffar Shah", "Sultan Parameswara"],
      "correctAnswer": 3,
      "explanation": "Parameswara (kemudian dikenali sebagai Sultan Iskandar Shah) adalah pengasas dan sultan pertama Kesultanan Melaka.",
      "category": "Sejarah Kesultanan Melayu",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "👑"
    },
    {
      "id": "U2_HIS_3",
      "question": "Apakah Perjanjian Pangkor 1874?",
      "options": ["Perjanjian perdagangan dengan China", "Perjanjian yang membawa kepada campur tangan British di Perak", "Perjanjian kemerdekaan Malaysia", "Perjanjian sempadan dengan Thailand"],
      "correctAnswer": 1,
      "explanation": "Perjanjian Pangkor 1874 menandakan permulaan campur tangan British secara rasmi dalam hal ehwal negeri-negeri Melayu.",
      "category": "Sejarah Kolonial",
      "difficulty": "hard",
      "timeLimit": 25,
      "emoji": "🖋️"
    }
  ]
};

export const getAllU2Questions = () => {
  return [
    ...U2_questions.mathematic,
    ...U2_questions.science,
    ...U2_questions.history
  ];
};

export const getU2QuestionsBySubject = (subject) => {
  return U2_questions[subject] || [];
};

export const getRandomU2Questions = (count = 5) => {
  const allQuestions = getAllU2Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};