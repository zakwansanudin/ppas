// Data/QuizBank/Secondary/U4_16yo.js
export const U4_questions = {
  // Mathematics questions for Age 16
  mathematic: [
    {
      "id": "U4_MATH_1",
      "question": "Bezakan y = 3x² + 2x - 5",
      "options": ["dy/dx = 6x + 2", "dy/dx = 3x + 2", "dy/dx = 6x", "dy/dx = 3x² + 2"],
      "correctAnswer": 0,
      "explanation": "dy/dx = d(3x²)/dx + d(2x)/dx - d(5)/dx = 6x + 2",
      "category": "Kalkulus",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "📈"
    },
    {
      "id": "U4_MATH_2",
      "question": "Selesaikan log₂8 = ?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": 1,
      "explanation": "log₂8 = 3 kerana 2³ = 8",
      "category": "Logaritma",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "📊"
    },
    {
      "id": "U4_MATH_3",
      "question": "Kembangkan (x + 2)³",
      "options": ["x³ + 6x² + 12x + 8", "x³ + 3x² + 3x + 8", "x³ + 6x² + 12x + 6", "x³ + 8"],
      "correctAnswer": 0,
      "explanation": "(x+2)³ = x³ + 3x²(2) + 3x(2)² + 2³ = x³ + 6x² + 12x + 8",
      "category": "Algebra",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🧮"
    }
  ],

  // Science questions for Age 16
  science: [
    {
      "id": "U4_SCI_1",
      "question": "Apakah prinsip ketidakpastian Heisenberg?",
      "options": ["Tidak boleh mengetahui kedua-dua kedudukan dan momentum zarah dengan tepat", "Tenaga adalah kuantum", "Kelajuan cahaya malar", "Semua zarah berkelakuan seperti gelombang"],
      "correctAnswer": 0,
      "explanation": "Prinsip Heisenberg menyatakan bahawa kedudukan dan momentum zarah tidak boleh diketahui serentak dengan ketepatan mutlak.",
      "category": "Fizik Kuantum",
      "difficulty": "hard",
      "timeLimit": 30,
      "emoji": "⚛️"
    },
    {
      "id": "U4_SCI_2",
      "question": "Apakah yang dimaksudkan dengan imbangan Hardy-Weinberg?",
      "options": ["Populasi yang tidak berkembang", "Populasi di mana frekuensi alel tetap malar", "Populasi terpencil", "Populasi dengan mutasi berterusan"],
      "correctAnswer": 1,
      "explanation": "Prinsip Hardy-Weinberg menerangkan keadaan di mana frekuensi alel dalam populasi tetap malar dari generasi ke generasi.",
      "category": "Genetik",
      "difficulty": "hard",
      "timeLimit": 30,
      "emoji": "🧬"
    },
    {
      "id": "U4_SCI_3",
      "question": "Apakah hukum termodinamik pertama?",
      "options": ["Tenaga tidak boleh dicipta atau dimusnahkan", "Entropi sentiasa meningkat", "Suhu mutlak sifar tidak boleh dicapai", "Haba mengalir dari panas ke sejuk"],
      "correctAnswer": 0,
      "explanation": "Hukum termodinamik pertama adalah hukum kekekalan tenaga: tenaga tidak boleh dicipta atau dimusnahkan.",
      "category": "Fizik",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🔥"
    }
  ],

  // History questions for Age 16
  history: [
    {
      "id": "U4_HIS_1",
      "question": "Apakah yang dimaksudkan dengan 'Revolusi Perindustrian'?",
      "options": ["Perubahan daripada ekonomi pertanian kepada perindustrian", "Revolusi politik di Perancis", "Kemunculan kerajaan demokrasi", "Penemuan Dunia Baru"],
      "correctAnswer": 0,
      "explanation": "Revolusi Perindustrian adalah tempoh peralihan daripada ekonomi berasaskan pertanian dan tangan kepada pengeluaran mesin.",
      "category": "Sejarah Dunia",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🏭"
    },
    {
      "id": "U4_HIS_2",
      "question": "Apakah Perang Dunia Pertama disebabkan oleh?",
      "options": ["Pembunuhan Franz Ferdinand", "Persaingan kuasa besar Eropah", "Perjanjian Versailles", "Semua di atas"],
      "correctAnswer": 3,
      "explanation": "Perang Dunia I disebabkan oleh kombinasi faktor termasuk pembunuhan Archduke Franz Ferdinand, persaingan kuasa, dan sistem pakatan.",
      "category": "Sejarah Dunia",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "⚔️"
    },
    {
      "id": "U4_HIS_3",
      "question": "Apakah kesan utama Zaman Penjelajahan?",
      "options": ["Penyebaran agama Islam", "Pertukaran Columbian", "Kemunculan feudalisme", "Revolusi Perancis"],
      "correctAnswer": 1,
      "explanation": "Pertukaran Columbian merujuk kepada pertukaran tanaman, haiwan, budaya dan penyakit antara Dunia Lama dan Baru.",
      "category": "Sejarah Dunia",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🌍"
    }
  ]
};

export const getAllU4Questions = () => {
  return [
    ...U4_questions.mathematic,
    ...U4_questions.science,
    ...U4_questions.history
  ];
};

export const getU4QuestionsBySubject = (subject) => {
  return U4_questions[subject] || [];
};

export const getRandomU4Questions = (count = 5) => {
  const allQuestions = getAllU4Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};