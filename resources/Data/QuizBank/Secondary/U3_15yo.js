// Data/QuizBank/Secondary/U3_15yo.js
export const U3_questions = {
  // Mathematics questions for Age 15
  mathematic: [
    {
      "id": "U3_MATH_1",
      "question": "Selesaikan persamaan kuadratik: x² - 5x + 6 = 0",
      "options": ["x=1, x=6", "x=2, x=3", "x=1, x=5", "x=3, x=4"],
      "correctAnswer": 1,
      "explanation": "x² - 5x + 6 = 0 → (x-2)(x-3)=0 → x=2 atau x=3",
      "category": "Algebra",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "📊"
    },
    {
      "id": "U3_MATH_2",
      "question": "Cari nilai sin 30°",
      "options": ["0", "0.5", "√2/2", "√3/2"],
      "correctAnswer": 1,
      "explanation": "sin 30° = 1/2 = 0.5",
      "category": "Trigonometri",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "📐"
    },
    {
      "id": "U3_MATH_3",
      "question": "Hitung hasil darab matriks: [[2,3],[1,4]] × [[5,6],[7,8]]",
      "options": ["[[31,36],[33,38]]", "[[10,18],[7,32]]", "[[17,24],[23,32]]", "[[24,31],[32,39]]"],
      "correctAnswer": 0,
      "explanation": "[2×5+3×7=31, 2×6+3×8=36], [1×5+4×7=33, 1×6+4×8=38]",
      "category": "Matriks",
      "difficulty": "hard",
      "timeLimit": 35,
      "emoji": "🧮"
    }
  ],

  // Science questions for Age 15
  science: [
    {
      "id": "U3_SCI_1",
      "question": "Apakah hukum kekekalan tenaga?",
      "options": ["Tenaga tidak boleh dicipta atau dimusnahkan", "Tenaga berkurangan dengan masa", "Tenaga bertambah dengan jisim", "Tenaga bergantung kepada suhu"],
      "correctAnswer": 0,
      "explanation": "Hukum kekekalan tenaga menyatakan bahawa tenaga tidak boleh dicipta atau dimusnahkan, hanya berubah bentuk.",
      "category": "Fizik",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "⚡"
    },
    {
      "id": "U3_SCI_2",
      "question": "Apakah fungsi mitokondria dalam sel?",
      "options": ["Fotosintesis", "Pembuatan protein", "Penghasilan tenaga", "Penyimpanan makanan"],
      "correctAnswer": 2,
      "explanation": "Mitokondria adalah 'kuasa sel' yang menghasilkan tenaga (ATP) melalui respirasi sel.",
      "category": "Biologi",
      "difficulty": "medium",
      "timeLimit": 20,
      "emoji": "🔬"
    },
    {
      "id": "U3_SCI_3",
      "question": "Apakah perbezaan antara asid dan alkali?",
      "options": ["Asid pahit, alkali masam", "Asid pH<7, alkali pH>7", "Asid mengandungi oksigen, alkali tidak", "Asid berwarna biru, alkali merah"],
      "correctAnswer": 1,
      "explanation": "Asid mempunyai pH kurang dari 7, manakala alkali mempunyai pH lebih dari 7.",
      "category": "Kimia",
      "difficulty": "easy",
      "timeLimit": 20,
      "emoji": "🧪"
    }
  ],

  // History questions for Age 15
  history: [
    {
      "id": "U3_HIS_1",
      "question": "Apakah sebab-sebab kemunculan nasionalisme di Tanah Melayu?",
      "options": ["Kemajuan ekonomi sahaja", "Pengenalan sistem pendidikan Inggeris", "Dasar British yang mengabaikan kepentingan penduduk tempatan", "Semua di atas"],
      "correctAnswer": 3,
      "explanation": "Nasionalisme muncul akibat kombinasi faktor termasuk sistem pendidikan, dasar British, dan kesedaran politik.",
      "category": "Sejarah Nasionalisme",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🔥"
    },
    {
      "id": "U3_HIS_2",
      "question": "Siapakah pengasas Kesatuan Melayu Muda (KMM)?",
      "options": ["Ibrahim Yaakob", "Tun Dr. Ismail", "Tunku Abdul Rahman", "Dato' Onn Jaafar"],
      "correctAnswer": 0,
      "explanation": "Ibrahim Yaakob mengasaskan Kesatuan Melayu Muda (KMM) pada tahun 1938.",
      "category": "Sejarah Politik",
      "difficulty": "hard",
      "timeLimit": 25,
      "emoji": "👥"
    },
    {
      "id": "U3_HIS_3",
      "question": "Apakah tujuan Malayan Union ditubuhkan?",
      "options": ["Menyatukan negeri-negeri Melayu", "Memperkenalkan sistem pentadbiran pusat yang kuat", "Menggantikan kuasa sultan", "Semua di atas"],
      "correctAnswer": 3,
      "explanation": "Malayan Union (1946) bertujuan menyatukan negeri-negeri, mengukuhkan pentadbiran pusat, dan mengurangkan kuasa sultan.",
      "category": "Sejarah Kolonial",
      "difficulty": "medium",
      "timeLimit": 25,
      "emoji": "🏛️"
    }
  ]
};

export const getAllU3Questions = () => {
  return [
    ...U3_questions.mathematic,
    ...U3_questions.science,
    ...U3_questions.history
  ];
};

export const getU3QuestionsBySubject = (subject) => {
  return U3_questions[subject] || [];
};

export const getRandomU3Questions = (count = 5) => {
  const allQuestions = getAllU3Questions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};