import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { getMixedQuestionsFromLevel, levelInfo } from '../../../Data/QuizBank/index.js';
import { router } from '@inertiajs/react';
import Calculator from '../../../js/Components/Calculator.jsx';

// Komponen Paparan Pemasa (Memoized)
const TimerDisplay = memo(({ timeElapsed }) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow px-4 py-2 flex items-center border-2 border-yellow-400">
      <span className="text-lg mr-2">⏰</span>
      <span className="text-lg font-bold font-mono">{formatTime(timeElapsed)}</span>
    </div>
  );
});

// Komponen Pilihan Soalan (Memoized)
const QuestionOptions = memo(({
  questions,
  currentQuestion,
  selectedOption,
  showExplanation,
  answeredQuestions,
  handleOptionSelect,
  isCorrect
}) => {
  if (!questions || !questions[currentQuestion]) return null;

  return (
    <div className="space-y-3 mb-4">
      {questions[currentQuestion].options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionSelect(index)}
          disabled={showExplanation || answeredQuestions[currentQuestion] !== null}
          className={`w-full p-4 text-left transition-all duration-200 rounded-xl border-2 ${selectedOption === index
            ? "border-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg transform scale-[1.02]"
            : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
            } ${showExplanation && index === questions[currentQuestion].correctAnswer
              ? "border-green-500 bg-gradient-to-r from-green-400 to-emerald-400 text-white"
              : ""
            } ${showExplanation && selectedOption === index && !isCorrect
              ? "border-red-500 bg-gradient-to-r from-red-400 to-pink-400 text-white"
              : ""
            } ${answeredQuestions[currentQuestion] !== null ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mr-3 font-bold ${selectedOption === index
              ? "bg-white text-orange-600 border-white"
              : "bg-gray-100 text-gray-700 border-gray-300"
              } ${showExplanation && index === questions[currentQuestion].correctAnswer
                ? "bg-white text-green-600 border-white"
                : ""
              } ${showExplanation && selectedOption === index && !isCorrect
                ? "bg-white text-red-600 border-white"
                : ""
              }`}>
              {String.fromCharCode(65 + index)}
            </div>
            <div className="text-base flex-1">{option}</div>
            {showExplanation && index === questions[currentQuestion].correctAnswer && (
              <div className="ml-2 text-xl">
                ✅
              </div>
            )}
            {showExplanation && selectedOption === index && !isCorrect && (
              <div className="ml-2 text-xl">
                ❌
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
});

// Konfeti Ringkas
const Confetti = memo(() => (
  <div className="fixed inset-0 pointer-events-none z-50 flex justify-center">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          width: 8,
          height: 8,
          backgroundColor: ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B'][Math.floor(Math.random() * 4)],
          top: '-50px',
          left: `${Math.random() * 100}%`,
          borderRadius: '50%',
          animation: `fall ${1 + Math.random() * 2}s linear ${Math.random() * 0.5}s infinite`
        }}
      />
    ))}
    <style>{`
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `}</style>
  </div>
));

// Komponen Modal Maklum Balas
const FeedbackModal = ({
  showFeedbackModal,
  setShowFeedbackModal,
  rating,
  setRating,
  isInteresting,
  setIsInteresting,
  feedbackSubmitted,
  setFeedbackSubmitted,
  auth
}) => {
  const [phoneNumber, setPhoneNumber] = useState(auth?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [useStoredPhone, setUseStoredPhone] = useState(true);

  const handleSubmitFeedback = async () => {
    if (rating === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      let phoneToSend = null;
      
      if (isInteresting) {
        if (auth?.phone && useStoredPhone) {
          phoneToSend = auth.phone;
        } else if (phoneNumber && phoneNumber.trim() !== '') {
          phoneToSend = phoneNumber.trim();
        } else {
          setSubmitError('Sila berikan nombor telefon untuk susulan.');
          setSubmitting(false);
          return;
        }
      } else {
        phoneToSend = null;
      }

      const feedbackData = {
        full_name: auth?.name || '',
        mykad_number: auth?.mykad_number || '',
        rating: rating,
        interest: isInteresting,
        phone_number: phoneToSend,
      };

      console.log('Menghantar maklum balas:', feedbackData);

      router.post('/feedback/submit', feedbackData, {
        preserveScroll: true,
        onSuccess: (page) => {
          console.log('Maklum balas berjaya dihantar:', page.props);
          
          setFeedbackSubmitted(true);
          
          setTimeout(() => {
            setShowFeedbackModal(false);
            setFeedbackSubmitted(false);
            setRating(0);
            setIsInteresting(false);
            setPhoneNumber('');
            if (auth?.phone) {
              setUseStoredPhone(true);
            }
            setSubmitting(false);
          }, 2000);
        },
        onError: (errors) => {
          console.error('Ralat menghantar maklum balas:', errors);
          const errorMessage = Object.values(errors).join(', ') || 'Gagal menghantar maklum balas';
          setSubmitError(errorMessage);
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error('Ralat menghantar maklum balas:', error);
      setSubmitError('Ralat tidak dijangka berlaku. Sila cuba lagi.');
      setSubmitting(false);
    }
  };

  if (!showFeedbackModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-500 max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">Maklum Balas Kuiz</h3>
          <p className="text-gray-300">Bagaimana pengalaman kuiz anda?</p>
        </div>

        {feedbackSubmitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {isInteresting ? '💬' : '✅'}
            </div>
            <h4 className="text-xl font-bold text-green-400 mb-2">Terima Kasih!</h4>
            <p className="text-gray-300 mb-4">
              {isInteresting
                ? "Kami telah menerima maklum balas anda. Kami akan menghubungi anda tidak lama lagi."
                : "Kami telah menerima maklum balas anda. Terima kasih atas maklum balas tersebut."}
            </p>
          </div>
        ) : (
          <>
            {/* Paparan Maklumat Pengguna */}
            {auth && (
              <div className="mb-6 p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="font-bold">Pemain: </span>
                  <span className="text-white">{auth.name}</span>
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  <span className="font-bold">MyKad: </span>
                  <span className="text-white font-mono">{auth.mykad_number}</span>
                </p>
                {auth.phone && (
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="font-bold">Telefon: </span>
                    <span className="text-white">{auth.phone}</span>
                  </p>
                )}
              </div>
            )}

            {/* Penarafan Bintang */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">Nilaikan kuiz ini:</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    disabled={submitting}
                    className={`text-3xl transition-transform ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-500'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {rating >= star ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Lemah</span>
                <span>Cemerlang</span>
              </div>
            </div>

            {/* Kotak Semak Menarik */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInteresting}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsInteresting(checked);
                    
                    if (!checked) {
                      setPhoneNumber('');
                      if (auth?.phone) {
                        setUseStoredPhone(true);
                      }
                    }
                  }}
                  disabled={submitting}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center ${isInteresting ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isInteresting && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Kuiz ini menarik dan menghiburkan</span>
                  {isInteresting && (
                    <p className="text-xs text-yellow-300 mt-1">
                      ✓ Jika ditanda, kami akan menghubungi anda
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* Pilihan Nombor Telefon - Hanya tunjuk jika kotak ditanda */}
            {isInteresting && (
              <div className="mb-6 animate-fadeIn">
                <label className="block text-white font-bold mb-2">
                  Nombor Telefon untuk Susulan:
                  <span className="text-yellow-300 ml-1">*</span>
                </label>

                {auth?.phone ? (
                  <>
                    <div className="mb-3">
                      <label className="flex items-center cursor-pointer mb-2">
                        <input
                          type="radio"
                          checked={useStoredPhone}
                          onChange={() => setUseStoredPhone(true)}
                          disabled={submitting}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${useStoredPhone ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {useStoredPhone && (
                            <span className="text-white text-xs">●</span>
                          )}
                        </div>
                        <div>
                          <span className="text-white">Guna telefon berdaftar saya: </span>
                          <span className="text-yellow-300 font-bold">{auth.phone}</span>
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center cursor-pointer mb-2">
                        <input
                          type="radio"
                          checked={!useStoredPhone}
                          onChange={() => setUseStoredPhone(false)}
                          disabled={submitting}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${!useStoredPhone ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {!useStoredPhone && (
                            <span className="text-white text-xs">●</span>
                          )}
                        </div>
                        <span className="text-white">Guna nombor telefon lain:</span>
                      </label>

                      {!useStoredPhone && (
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={submitting}
                          placeholder="Masukkan nombor telefon (cth: 012-3456789)"
                          className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          required={isInteresting}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={submitting}
                    placeholder="Masukkan nombor telefon anda (cth: 012-3456789)"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required={isInteresting}
                  />
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  Kami perlukan nombor telefon anda untuk menghubungi anda bagi tujuan susulan
                </p>
              </div>
            )}

            {/* Mesej Ralat */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-900/50 rounded-lg border border-red-700">
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {submitError}
                </p>
              </div>
            )}

            {/* Butang Hantar */}
            <button
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || submitting}
              className={`w-full py-3 rounded-xl font-bold text-lg transition duration-200 flex items-center justify-center gap-2 ${rating === 0 || submitting ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg'}`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menghantar...
                </>
              ) : (
                'Hantar Maklum Balas'
              )}
            </button>
          </>
        )}

        {/* Butang Tutup */}
        {!feedbackSubmitted && !submitting && (
          <button
            onClick={() => setShowFeedbackModal(false)}
            className="w-full mt-3 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition duration-200"
            disabled={submitting}
          >
            Kemudian
          </button>
        )}
      </div>
    </div>
  );
};

export default function QuizPage({ level = 'L1', onQuizComplete, onBackToLeaderboard, auth }) {
  // Pengurusan State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [firstTryAnswers, setFirstTryAnswers] = useState([]);

  const [explanationVisible, setExplanationVisible] = useState(false);
  const [showRetryOption, setShowRetryOption] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // State Pemasa
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // States Penyerahan Pangkalan Data
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [submittingResults, setSubmittingResults] = useState(false);

  // States Maklum Balas
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [isInteresting, setIsInteresting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // State Kalkulator
  const [showCalculator, setShowCalculator] = useState(false);

  // Inisialisasi soalan berdasarkan tahap
  useEffect(() => {
    const mixedQuestions = getMixedQuestionsFromLevel(level, 5);
    console.log(`Dimuatkan ${mixedQuestions.length} soalan untuk tahap ${level}`);
    setQuestions(mixedQuestions);
    setFirstTryAnswers(Array(mixedQuestions.length).fill(null));
  }, [level]);

  // Efek Pemasa
  useEffect(() => {
    let intervalId;

    if (timerRunning && questions.length > 0) {
      intervalId = setInterval(() => {
        setTimeElapsed(seconds => seconds + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerRunning, questions.length]);

  // Mulakan pemasa apabila soalan dimuatkan
  useEffect(() => {
    if (questions.length > 0 && !timerRunning) {
      setTimerRunning(true);
    }
  }, [questions.length, timerRunning]);

  // Pengiraan Memoized
  const correctAnswersCount = useMemo(() =>
    firstTryAnswers.filter(answer => answer === true).length,
    [firstTryAnswers]
  );

  const getLevelInfo = () => levelInfo[level] || { age: '7 tahun', category: 'Rendah', name: 'Tahun 1' };

  const handleBackToLeaderboard = () => {
    window.location.reload(true);

    if (onBackToLeaderboard) {
      onBackToLeaderboard();
    }
  };

  // Fungsi untuk simpan keputusan ke pangkalan data
  const saveToDatabase = async (results) => {
    if (!auth?.mykad_number) {
      console.error('Tiada nombor MyKad dijumpai dalam auth');
      return { success: false, error: 'Pengguna tidak disahkan' };
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const quizData = {
        ic_number: auth.mykad_number,
        total_correct: results.correctFirstTry,
        total_time: formatTimeForDatabase(results.timeElapsed),
        level: results.level,
      };

      console.log('Menyimpan data kuiz ke pangkalan data:', quizData);

      const response = await axios.post('/api/record-challenges', quizData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('Respons simpan pangkalan data:', response.data);

      setSaveSuccess(true);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('Ralat menyimpan ke pangkalan data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menyimpan keputusan kuiz';
      setSaveError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi pembantu untuk format masa untuk pangkalan data (format HH:MM:SS)
  const formatTimeForDatabase = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    const newMixedQuestions = getMixedQuestionsFromLevel(level, 5);
    setQuestions(newMixedQuestions);

    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setExplanationVisible(false);
    setFirstTryAnswers(Array(newMixedQuestions.length).fill(null));
    setShowRetryOption(false);
    setQuizCompleted(false);
    setQuizResults(null);
    setSaveSuccess(false);
    setSaveError(null);

    setTimeElapsed(0);
    setTimerRunning(true);
  };

  const handleOptionSelect = (optionIndex) => {
    if (!showExplanation && firstTryAnswers[currentQuestion] === null) {
      setSelectedOption(optionIndex);
      setIsCorrect(optionIndex === questions[currentQuestion].correctAnswer);
    }
  };

  const checkAnswer = () => {
    if (selectedOption === null || questions.length === 0) return;

    setShowExplanation(true);
    setExplanationVisible(true);

    if (firstTryAnswers[currentQuestion] === null) {
      const newFirstTryAnswers = [...firstTryAnswers];
      newFirstTryAnswers[currentQuestion] = isCorrect;
      setFirstTryAnswers(newFirstTryAnswers);

      if (!isCorrect) {
        setShowRetryOption(true);
      }
    }

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setExplanationVisible(false);
    setSelectedOption(null);
    setShowRetryOption(false);
    setCurrentQuestion(prev => {
      if (prev < questions.length - 1) {
        return prev + 1;
      } else {
        handleSubmit();
        return prev;
      }
    });
  };

  const goToQuestion = (index) => {
    if (firstTryAnswers[currentQuestion] !== null || index === currentQuestion) {
      setShowExplanation(false);
      setExplanationVisible(false);
      setSelectedOption(null);
      setShowRetryOption(false);
      setCurrentQuestion(index);
    }
  };

  const toggleExplanation = () => {
    setExplanationVisible(!explanationVisible);
  };

  const handleSubmit = () => {
    setTimerRunning(false);

    const results = {
      level,
      levelInfo: getLevelInfo(),
      totalQuestions: questions.length,
      correctFirstTry: firstTryAnswers.filter(answer => answer === true).length,
      wrongFirstTry: firstTryAnswers.filter(answer => answer === false).length,
      unanswered: firstTryAnswers.filter(answer => answer === null).length,
      timeElapsed,
      score: Math.round((firstTryAnswers.filter(answer => answer === true).length / questions.length) * 100),
      questions: questions.map((q, index) => ({
        question: q.question,
        correctFirstTry: firstTryAnswers[index] === true,
        category: q.category,
        difficulty: q.difficulty,
        userAnswer: firstTryAnswers[index] === null ? 'Tidak dijawab' : firstTryAnswers[index] ? 'Betul' : 'Salah'
      })),
      firstTryAnswers: [...firstTryAnswers]
    };

    setQuizCompleted(true);
    setQuizResults(results);

    setSubmittingResults(true);

    const quizData = {
      ic_number: auth?.mykad_number,
      total_correct: results.correctFirstTry,
      total_time: results.timeElapsed.toString(),
      level: results.level,
    };

    router.post('/quiz/save-results', quizData, {
      preserveScroll: true,
      onSuccess: (page) => {
        console.log('Keputusan kuiz berjaya disimpan:', page.props);
        setSaveSuccess(true);
        setSubmittingResults(false);
      },
      onError: (errors) => {
        console.error('Ralat menyimpan keputusan kuiz:', errors);
        const errorMessage = Object.values(errors).join(', ') || 'Gagal menyimpan keputusan kuiz';
        setSaveError(errorMessage);
        setSubmittingResults(false);
      },
    });
  };

  // Tunjuk state pemuatan semasa soalan sedang dimuatkan
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border-2 border-blue-500 p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-4">Memuatkan Cabaran...</h2>
            <p className="text-gray-300 mb-6">Menyediakan soalan untuk tahap {level}</p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submittingResults) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border-2 border-yellow-400 p-8 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-lg"></div>

            <div className="text-6xl mb-6 animate-bounce">
              🏆
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              {isSaving ? 'Menyimpan Keputusan...' : 'Mengira Skor Anda!'}
            </h2>

            <div className="bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
            </div>

            <p className="text-blue-300 mb-2 text-lg font-semibold">
              {isSaving ? '💾 Menyimpan ke pangkalan data...' : '🎯 Memproses Keputusan Anda...'}
            </p>

            <p className="text-gray-400 mb-6">
              Tahap {level} • {getLevelInfo().name}
            </p>

            {isSaving && (
              <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                <p className="text-blue-300 text-sm">
                  Menyimpan skor anda ke papan pendahulu...
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-2 mb-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s`, animationDuration: '1s' }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-green-400 font-bold">✓ Betul</div>
                <div className="text-white text-xl">{firstTryAnswers.filter(a => a === true).length}/{questions.length}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-blue-400 font-bold">⏱️ Masa</div>
                <div className="text-white text-xl">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-yellow-400 font-bold">🏆 Skor</div>
                <div className="text-white text-xl">{Math.round((firstTryAnswers.filter(a => a === true).length / questions.length) * 100)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika kuiz selesai, tunjuk keputusan
  if (quizCompleted && quizResults) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
        <div className="bg-black bg-opacity-70 min-h-screen">
          <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Trophy Banner with Animation */}
            <div className="text-center mb-8 animate-fadeIn">
              <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full p-6 shadow-2xl border-4 border-yellow-300 mb-4 animate-bounce">
                <span className="text-7xl">🏆</span>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 mb-3 drop-shadow-lg">
                Tahniah!
              </h1>
              <p className="text-2xl text-white font-bold mb-2">Anda Telah Menyelesaikan Kuiz!</p>
              <p className="text-gray-300 text-lg">Tahap {level} • {getLevelInfo().name}</p>
              <div className="inline-block mt-3 px-4 py-2 bg-yellow-500/20 border border-yellow-400 rounded-full">
                <p className="text-yellow-300 text-sm font-semibold">✨ Keputusan Percubaan Pertama Sahaja ✨</p>
              </div>

              {/* Status Simpan Pangkalan Data */}
              {saveSuccess && (
                <div className="mt-4 p-3 bg-green-900/70 rounded-xl border-2 border-green-500 max-w-md mx-auto backdrop-blur-sm animate-slideIn">
                  <p className="text-green-200 text-sm flex items-center justify-center gap-2 font-semibold">
                    <span className="text-xl">✅</span>
                    Keputusan berjaya disimpan ke pangkalan data!
                  </p>
                </div>
              )}

              {saveError && (
                <div className="mt-4 p-3 bg-red-900/70 rounded-xl border-2 border-red-500 max-w-md mx-auto backdrop-blur-sm">
                  <p className="text-red-200 text-sm flex items-center justify-center gap-2 font-semibold">
                    <span className="text-xl">⚠️</span>
                    {saveError}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Correct Answers Card */}
              <div className="group bg-gradient-to-br from-emerald-600 to-green-700 p-5 rounded-2xl shadow-2xl border-4 border-emerald-400 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">✅</div>
                  <div className="text-5xl font-black text-white mb-2">
                    {quizResults.correctFirstTry}<span className="text-3xl text-emerald-200">/{quizResults.totalQuestions}</span>
                  </div>
                  <div className="text-emerald-100 font-bold text-lg">Betul</div>
                  <div className="text-emerald-200 text-sm mt-1">(Percubaan Pertama)</div>
                  <div className="mt-4 w-full bg-emerald-900/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-300 to-green-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(quizResults.correctFirstTry / quizResults.totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Time Card */}
              <div className="group bg-gradient-to-br from-purple-600 to-indigo-700 p-5 rounded-2xl shadow-2xl border-4 border-purple-400 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⏱️</div>
                  <div className="text-5xl font-black text-white mb-2 font-mono">
                    {Math.floor(quizResults.timeElapsed / 60)}:{(quizResults.timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-100 font-bold text-lg">Masa Diambil</div>
                  <div className="text-purple-200 text-sm mt-1">Minit : Saat</div>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-8 bg-purple-400 rounded-full"
                        style={{ opacity: (i + 1) / 5 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Score Card */}
              <div className="group bg-gradient-to-br from-yellow-500 to-orange-600 p-5 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <div className="text-5xl font-black text-white mb-2">
                    {quizResults.score}<span className="text-3xl text-yellow-100">%</span>
                  </div>
                  <div className="text-yellow-100 font-bold text-lg">Jumlah Skor</div>
                  <div className="text-yellow-200 text-sm mt-1">Peratusan Kejayaan</div>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-3xl ${i < Math.round(quizResults.score / 20) ? 'text-yellow-200' : 'text-yellow-700'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Pecahan Prestasi
                </h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Betul</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Salah</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {quizResults.questions.map((q, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                      q.correctFirstTry 
                        ? 'border-green-500 bg-gradient-to-r from-green-900/40 to-emerald-900/40 hover:from-green-900/60 hover:to-emerald-900/60' 
                        : q.userAnswer === 'Salah' 
                        ? 'border-red-500 bg-gradient-to-r from-red-900/40 to-pink-900/40 hover:from-red-900/60 hover:to-pink-900/60' 
                        : 'border-gray-600 bg-gradient-to-r from-gray-900/40 to-gray-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          q.correctFirstTry ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          q.correctFirstTry 
                            ? 'bg-green-500 text-white' 
                            : q.userAnswer === 'Salah' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {q.correctFirstTry ? '✓ Betul' : q.userAnswer === 'Salah' ? '✗ Salah' : '○ Tidak Dijawab'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-500/30 border border-blue-400 rounded-lg text-blue-200 text-xs font-semibold">
                          {q.category}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/30 border border-purple-400 rounded-lg text-purple-200 text-xs font-semibold">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm ml-11 leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleBackToLeaderboard}
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-xl font-bold text-lg shadow-2xl border-2 border-blue-400 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
                  <span>Papan Pendahulu</span>
                </div>
              </button>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="group bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg shadow-2xl border-2 border-yellow-400 hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
                  <span>Maklum Balas</span>
                </div>
              </button>

              <button
                onClick={resetQuiz}
                className="group bg-gradient-to-r from-green-600 to-emerald-700 text-white py-5 rounded-xl font-bold text-lg shadow-2xl border-2 border-green-400 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                  <span>Main Lagi</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tambah FeedbackModal di sini dengan props */}
        <FeedbackModal
          showFeedbackModal={showFeedbackModal}
          setShowFeedbackModal={setShowFeedbackModal}
          rating={rating}
          setRating={setRating}
          isInteresting={isInteresting}
          setIsInteresting={setIsInteresting}
          feedbackSubmitted={feedbackSubmitted}
          setFeedbackSubmitted={setFeedbackSubmitted}
          auth={auth}
        />

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #6366f1, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #4f46e5, #7c3aed);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          .animate-slideIn {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isQuestionAnswered = firstTryAnswers[currentQuestion] !== null;
  const showNextButton = showExplanation && isQuestionAnswered;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <div className="bg-black bg-opacity-60 min-h-screen">
        {showConfetti && <Confetti />}
        
        {/* Calculator Modal */}
        {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}

        {/* Kepala */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBackToLeaderboard}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition duration-200 flex items-center gap-2"
              >
                ← Kembali ke Papan Pendahulu
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">🎯 Cabaran Kuiz</h1>
                <p className="text-gray-600 text-sm">Tahap {level} • {getLevelInfo().name}</p>
                <p className="text-xs text-red-500 font-bold mt-1">PERCUBAAN PERTAMA SAHAJA - Tiada langkau!</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition duration-200 flex items-center gap-2"
                  title="Buka Kalkulator"
                >
                  <span className="text-lg">🔢</span>
                  <span className="hidden sm:inline">Kalkulator</span>
                </button>
                <TimerDisplay timeElapsed={timeElapsed} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-500">
            {/* Kepala Kemajuan */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex justify-between items-center">
                <div className="text-white font-bold flex items-center gap-2">
                  <span>📝</span>
                  Soalan {currentQuestion + 1}/{questions.length}
                  <span className="ml-2 text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full">
                    {currentQuestionData?.category}
                  </span>
                </div>
                {/* Titik Navigasi Soalan */}
                <div className="flex justify-center gap-2 mt-6">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      disabled={index > currentQuestion && firstTryAnswers[currentQuestion] === null}
                      className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ${index === currentQuestion
                        ? 'bg-blue-500 text-white scale-110 border-2 border-white'
                        : firstTryAnswers[index] === true
                          ? 'bg-green-500 text-white'
                          : firstTryAnswers[index] === false
                            ? 'bg-red-500 text-white'
                            : firstTryAnswers[index] === null
                              ? 'bg-gray-400 text-white'
                              : 'bg-gray-300 text-gray-700'
                        } ${(index > currentQuestion && firstTryAnswers[currentQuestion] === null) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                      title={index > currentQuestion && firstTryAnswers[currentQuestion] === null ?
                        "Selesaikan soalan semasa dahulu" : `Soalan ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Kemajuan Soalan */}
              <div className="mt-3 bg-gray-700 bg-opacity-50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6">
              {/* Emoji dan Teks Soalan */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">{currentQuestionData?.emoji || "❓"}</span>
                {isQuestionAnswered && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${firstTryAnswers[currentQuestion] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {firstTryAnswers[currentQuestion] ? '✓ Betul' : '✗ Salah'}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
                {currentQuestionData.question}
              </h2>

              <div className="text-sm font-bold text-gray-600 mb-4 text-center">
                {isQuestionAnswered ? '🎯 Jawapan Percubaan Pertama Anda:' : '🎯 Pilih Jawapan:'}
              </div>

              {/* Pilihan */}
              <QuestionOptions
                questions={questions}
                currentQuestion={currentQuestion}
                selectedOption={selectedOption}
                showExplanation={showExplanation}
                answeredQuestions={firstTryAnswers}
                handleOptionSelect={handleOptionSelect}
                isCorrect={isCorrect}
              />

              {/* Butang Tindakan */}
              <div className="flex gap-3 mt-6">
                {!isQuestionAnswered && !showExplanation ? (
                  <button
                    onClick={checkAnswer}
                    disabled={selectedOption === null}
                    className={`flex-1 py-3 rounded-xl font-bold text-lg transition duration-200 flex items-center justify-center gap-2 ${selectedOption === null
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                      }`}
                  >
                    Hantar Jawapan
                  </button>
                ) : showNextButton ? (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <span>{currentQuestion < questions.length - 1 ? "Soalan Seterusnya" : "Tamat Kuiz 🏁"}</span>
                  </button>
                ) : isQuestionAnswered && !showExplanation ? (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <span>📖</span>
                    Tunjuk Penjelasan
                  </button>
                ) : null}
              </div>

              {/* Togol Penjelasan */}
              {showExplanation && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={toggleExplanation}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow hover:shadow-md transition duration-200 flex items-center gap-2"
                  >
                    <span>📖</span>
                    {explanationVisible ? "Sembunyikan Penjelasan" : "Tunjukkan Penjelasan"}
                  </button>
                </div>
              )}

              {/* Penjelasan */}
              {showExplanation && explanationVisible && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-400 mt-4">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg mr-3 ${isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}>
                      {isCorrect ? "✓" : "!"}
                    </div>
                    <div>
                      <h3 className={`font-bold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                        {isCorrect ? "Tepat! 🎉" : "Jawapan yang betul: "}
                        {!isCorrect && (
                          <span className="text-green-800 ml-2">
                            {currentQuestionData.options[currentQuestionData.correctAnswer]}
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 mt-2">
                        {currentQuestionData.explanation}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 font-bold">
                        {firstTryAnswers[currentQuestion]
                          ? "✓ Anda menjawab dengan betul pada percubaan pertama!"
                          : "✗ Jawapan anda salah pada percubaan pertama."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}