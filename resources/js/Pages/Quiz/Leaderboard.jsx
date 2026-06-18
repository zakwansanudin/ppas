import { useState, useEffect } from 'react';
import QuizPage from './QuizPage';
import SweetAlertModal from '../../Components/SweetAlertModal';
import { router } from '@inertiajs/react';

export default function LeaderboardPage({ auth, onStartQuiz }) {
    const [activeTab, setActiveTab] = useState('L1');
    const [showStartModal, setShowStartModal] = useState(false);
    const [showQuizPage, setShowQuizPage] = useState(false);
    const [recommendedLevel, setRecommendedLevel] = useState('L1');
    const [leaderboard, setLeaderboard] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [eligibility, setEligibility] = useState(null);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

    const [alertModal, setAlertModal] = useState({
        show: false,
        title: '',
        message: '',
        type: 'warning'
    });

    // Updated state for feedback modal to match QuizPage
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [isInteresting, setIsInteresting] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [useStoredPhone, setUseStoredPhone] = useState(true);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const levelTabs = [
        { id: 'L1', label: 'Darjah 1', age: '7 tahun', category: 'primary' },
        { id: 'L2', label: 'Darjah 2', age: '8 tahun', category: 'primary' },
        { id: 'L3', label: 'Darjah 3', age: '9 tahun', category: 'primary' },
        { id: 'L4', label: 'Darjah 4', age: '10 tahun', category: 'primary' },
        { id: 'L5', label: 'Darjah 5', age: '11 tahun', category: 'primary' },
        { id: 'L6', label: 'Darjah 6', age: '12 tahun', category: 'primary' },
        { id: 'U1', label: 'Tingkatan 1', age: '13 tahun', category: 'secondary' },
        { id: 'U2', label: 'Tingkatan 2', age: '14 tahun', category: 'secondary' },
        { id: 'U3', label: 'Tingkatan 3', age: '15 tahun', category: 'secondary' },
        { id: 'U4', label: 'Tingkatan 4', age: '16 tahun', category: 'secondary' },
        { id: 'U5', label: 'Tingkatan 5', age: '17 tahun', category: 'secondary' },
    ];

    // Function to handle feedback submission (updated to use router.post like QuizPage)
    const handleFeedbackSubmit = async () => {
        if (rating === 0) {
            setSubmitError('Sila berikan penilaian bintang.');
            return;
        }

        setSubmittingFeedback(true);
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
                    setSubmittingFeedback(false);
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

            console.log('Menghantar maklum balas dari papan pendahulu:', feedbackData);

            // Use router.post similar to QuizPage for consistency
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
                        setSubmittingFeedback(false);
                    }, 2000);
                },
                onError: (errors) => {
                    console.error('Ralat menghantar maklum balas:', errors);
                    const errorMessage = Object.values(errors).join(', ') || 'Gagal menghantar maklum balas';
                    setSubmitError(errorMessage);
                    setSubmittingFeedback(false);
                },
            });
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitError('Ralat tidak dijangka berlaku. Sila cuba lagi.');
            setSubmittingFeedback(false);
        }
    };

    // Function to handle feedback modal opening (updated)
    const handleOpenFeedbackModal = () => {
        // Reset feedback form
        setRating(0);
        setIsInteresting(false);
        setFeedbackSubmitted(false);
        setSubmitError(null);
        
        // Pre-fill phone number if user is logged in
        if (auth?.phone) {
            setPhoneNumber(auth.phone);
            setUseStoredPhone(true);
        } else {
            setPhoneNumber('');
        }
        
        setShowStartModal(false);
        setShowFeedbackModal(true);
    };

    // Function to check quiz eligibility
    const checkQuizEligibility = async () => {
        setIsCheckingEligibility(true);
        
        try {
            const response = await fetch('/quiz/check-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    ic_number: auth.mykad_number,
                    level: activeTab
                })
            });

            const data = await response.json();
            setEligibility(data);

            if (data.success && data.eligible) {
                setShowStartModal(false);
                setShowQuizPage(true);
            } else {
                setAlertModal({
                    show: true,
                    title: 'Had Dicapai',
                    message: data.message || 'Anda tidak layak untuk memulakan kuiz.',
                    type: 'warning'
                });
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
            setAlertModal({
                show: true,
                title: 'Ralat',
                message: 'Ralat semasa menyemak kelayakan. Sila cuba lagi.',
                type: 'error'
            });
        } finally {
            setIsCheckingEligibility(false);
        }
    };

    const showSweetAlert = (title, message, type = 'warning') => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: title,
                text: message,
                icon: type,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'bg-gray-800 border border-gray-700',
                    title: 'text-white',
                    htmlContainer: 'text-gray-300',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700'
                }
            });
        } else {
            alert(`${title}: ${message}`);
        }
    };

    useEffect(() => {
        fetchLeaderboardData(activeTab);
    }, [activeTab]);

    useEffect(() => {
        if (auth?.mykad_number) {
            const level = calculateRecommendedLevel(auth.mykad_number);
            setRecommendedLevel(level);
            setActiveTab(level);
        }
    }, [auth?.mykad_number]);

    const fetchLeaderboardData = async (level) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/quiz/leaderboard/${level}`);
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard data');
            }

            const data = await response.json();

            if (data.success) {
                const formattedData = data.leaderboard.map((player, index) => ({
                    name: player.name,
                    mykad: player.mykad,
                    score: player.score,
                    time: player.time,
                }));

                setLeaderboard(prev => ({
                    ...prev,
                    [level]: formattedData
                }));
            } else {
                setLeaderboard(prev => ({
                    ...prev,
                    [level]: []
                }));
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data');
            setLeaderboard(prev => ({
                ...prev,
                [level]: []
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const maskMyKad = (mykad) => {
        if (!mykad || typeof mykad !== 'string') {
            return '******-**-****';
        }

        const cleanMyKad = mykad.replace(/[-\s]/g, '');

        if (cleanMyKad.length < 10) {
            return '******-**-****';
        }

        const firstSix = cleanMyKad.slice(0, 6);
        return `${firstSix}-**-****`;
    };

    const calculateRecommendedLevel = (mykad) => {
        try {
            const cleanMyKad = mykad.replace(/[-\s]/g, '');

            if (cleanMyKad.length < 6) {
                return 'L1';
            }

            const yearPart = cleanMyKad.substring(0, 2);
            const monthPart = cleanMyKad.substring(2, 4);
            const dayPart = cleanMyKad.substring(4, 6);

            let birthYear = parseInt('20' + yearPart);
            const currentYear = new Date().getFullYear();
            if (birthYear > currentYear) {
                birthYear = parseInt('19' + yearPart);
            }

            const birthDate = new Date(birthYear, parseInt(monthPart) - 1, parseInt(dayPart));

            if (isNaN(birthDate.getTime())) {
                return 'L1';
            }

            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age >= 7 && age <= 12) {
                return `L${age - 6}`;
            } else if (age >= 13 && age <= 17) {
                return `U${age - 12}`;
            } else if (age < 7) {
                return 'L1';
            } else {
                return 'U5';
            }
        } catch (error) {
            return 'L1';
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleStartQuiz = () => {
        setShowStartModal(true);
    };

    const handleConfirmStart = () => {
        if (!auth?.mykad_number) {
            alert('Sila log masuk terlebih dahulu.');
            return;
        }
        checkQuizEligibility();
    };

    const getRemainingAttemptsDisplay = () => {
        if (!eligibility?.attempts) return null;

        const { attempts_today, remaining, limit } = eligibility.attempts;

        return (
            <div className={`mt-3 p-2 rounded-lg ${remaining > 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                <p className="text-sm">
                    <span className="font-bold">Cubaan Hari Ini: </span>
                    <span className={remaining > 0 ? 'text-green-400' : 'text-red-400'}>
                        {attempts_today} / {limit}
                    </span>
                </p>
                <p className="text-xs text-gray-300">
                    {remaining > 0
                        ? `Anda masih ada ${remaining} cubaan untuk hari ini.`
                        : 'Anda telah mencapai had maksimum untuk hari ini.'}
                </p>
            </div>
        );
    };

    const handleBackToLeaderboard = () => {
        setShowQuizPage(false);
    };

    const handleQuizComplete = (results) => {
        console.log('Quiz completed with results:', results);

        fetch(`/quiz/leaderboard/${activeTab}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.leaderboard) {
                    setLeaderboard(prev => ({
                        ...prev,
                        [activeTab]: data.leaderboard
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching updated leaderboard:', error);
            });

        setShowQuizPage(false);
    };

    if (showQuizPage) {
        return <QuizPage
            level={activeTab}
            onQuizComplete={handleQuizComplete}
            onBackToLeaderboard={handleBackToLeaderboard}
            auth={auth}
        />;
    }

    const isLoggedIn = !!auth;

    return (
        <div className="min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
            
            <div className="p-4">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-12 relative pt-8">
                        <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl mb-6">
                            <h1 className="text-4xl font-bold text-white bg-gray-800 py-4 px-8 rounded-xl">
                                🏆 PANGKAT PEMAIN
                            </h1>
                        </div>
                        <p className="text-lg text-gray-300 mb-2">
                            Lihat kedudukan anda • Bandingkan skor • Jadi juara
                        </p>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-500 overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span>🏆</span> Pemain Terbaik
                                </h2>
                                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                    {leaderboard[activeTab]?.length || 0} Pemain
                                </span>
                            </div>
                        </div>

                        {/* Level Tabs */}
                        <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                            <div className="mb-3">
                                <div className="flex gap-2 text-xs text-gray-300 mb-2">
                                    <span className="font-bold">Rendah (Primary):</span>
                                    <span>7-12 tahun</span>
                                    <span className="mx-2">|</span>
                                    <span className="font-bold">Menengah (Secondary):</span>
                                    <span>13-17 tahun</span>
                                </div>

                                {isLoggedIn && (
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg mb-3">
                                        <div className="text-sm text-gray-300">
                                            <span className="font-bold">Pemain: </span>
                                            <span className="text-white">{auth.name}</span>
                                            <span className="mx-2">•</span>
                                            <span className="font-bold">MyKad: </span>
                                            <span className="text-white font-mono">{auth.mykad_number}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className={`px-2 py-1 rounded-full ${activeTab === recommendedLevel ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>
                                                {activeTab === recommendedLevel ? '⭐ Peringkat Anda' : 'Peringkat Lain'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {levelTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 relative ${activeTab === tab.id
                                            ? tab.category === 'primary'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                                                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            } ${tab.id === recommendedLevel ? 'border-2 border-yellow-400' : ''}`}
                                    >
                                        {tab.label}
                                        {tab.id === recommendedLevel && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                                                👤
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <div className="max-h-[400px] overflow-y-auto border border-gray-600 rounded-lg">
                                    <table className="w-full relative">
                                        <thead className="bg-gray-700 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-blue-300 uppercase">Kedudukan</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-blue-300 uppercase">Pemain</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-blue-300 uppercase">MyKad</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-blue-300 uppercase">Skor</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-blue-300 uppercase">Masa</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-600">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center">
                                                        <div className="flex justify-center items-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                                            <span className="ml-3 text-gray-300">Loading leaderboard...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-red-400">
                                                        {error}
                                                        <button
                                                            onClick={() => fetchLeaderboardData(activeTab)}
                                                            className="ml-3 px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                                                        >
                                                            Retry
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : leaderboard[activeTab]?.length > 0 ? (
                                                leaderboard[activeTab].map((player, index) => (
                                                    <tr key={index} className="hover:bg-gray-700 transition duration-150">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center space-x-2">
                                                                {index === 0 && <span className="text-2xl">🥇</span>}
                                                                {index === 1 && <span className="text-2xl">🥈</span>}
                                                                {index === 2 && <span className="text-2xl">🥉</span>}
                                                                {index > 2 && (
                                                                    <span className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                                                        {index + 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <div className="font-bold text-white">{player.name}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-gray-300 font-mono text-sm">{maskMyKad(player.mykad)}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="font-bold text-green-400 text-lg">{player.score} / 5</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-gray-300 font-mono">{player.time}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                                                        No players found for this level. Be the first to play!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="text-center">
                        <button
                            onClick={handleStartQuiz}
                            disabled={!isLoggedIn}
                            className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 
                                     rounded-xl font-bold text-lg shadow-lg hover:shadow-xl 
                                     transform hover:scale-105 transition duration-200 
                                     flex items-center gap-2 border-2 border-blue-400 mx-auto ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <span>⚔️</span>
                            {isLoggedIn ? 'Sertai Cabaran' : 'Sila Log Masuk'}
                            <span>🎯</span>
                        </button>

                        {isLoggedIn && recommendedLevel && (
                            <div className="mt-4 p-4 bg-gray-800/50 rounded-xl max-w-md mx-auto">
                                <p className="text-sm text-gray-300">
                                    <span className="font-bold">💡 Tips: </span>
                                    {activeTab === recommendedLevel ? (
                                        <span className="text-green-400">Anda sedang melihat peringkat yang sesuai dengan umur anda!</span>
                                    ) : (
                                        <span>Peringkat <span className="font-bold text-yellow-300">{recommendedLevel}</span> adalah yang sesuai berdasarkan umur anda.</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Start Quiz Modal */}
            {showStartModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-green-500 max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">🎮</div>
                            <h3 className="text-2xl font-bold text-green-400 mb-2">Mulakan Cabaran!</h3>
                            
                            {isLoggedIn && (
                                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-bold">Pemain: </span>
                                        <span className="text-white">{auth.name}</span>
                                    </p>
                                    <p className="text-sm text-gray-300 mt-1">
                                        <span className="font-bold">MyKad: </span>
                                        <span className="text-white font-mono">{auth.mykad_number}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-700 rounded-xl p-4 mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Umur Sasaran:</span>
                                <span className="text-white font-bold">
                                    {levelTabs.find(tab => tab.id === activeTab)?.age}
                                </span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Status:</span>
                                <span className={`font-bold ${activeTab === recommendedLevel ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {activeTab === recommendedLevel ? '⭐ Sesuai Umur Anda' : '⚠️ Peringkat Lain'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Kategori:</span>
                                <span className={`font-bold ${levelTabs.find(tab => tab.id === activeTab)?.category === 'primary'
                                    ? 'text-green-400'
                                    : 'text-orange-400'
                                    }`}>
                                    {levelTabs.find(tab => tab.id === activeTab)?.category === 'primary'
                                        ? 'Sekolah Rendah'
                                        : 'Sekolah Menengah'}
                                </span>
                            </div>
                        </div>

                        {eligibility?.attempts && (
                            <div className="mb-4">
                                {getRemainingAttemptsDisplay()}
                            </div>
                        )}

                        {activeTab !== recommendedLevel && (
                            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                                <p className="text-sm text-yellow-300 flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>Anda memilih peringkat yang <strong>berbeza</strong> dari yang dicadangkan.</span>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirmStart}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition duration-200"
                            >
                                Ya, Mulakan Sekarang! 🏁
                            </button>
                            
                            <button
                                onClick={handleOpenFeedbackModal}
                                className="bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition duration-200"
                            >
                                Tidak, Beri Maklum Balas ❌
                            </button>
                            
                            <button
                                onClick={() => setShowStartModal(false)}
                                className="border border-gray-500 text-gray-300 py-2 rounded-lg font-bold hover:bg-gray-700 transition duration-200"
                            >
                                Kembali ke Papan Mata
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal - Updated to match QuizPage and use router.post */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-500 max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold text-yellow-400 mb-2">Maklum Balas</h3>
                            <p className="text-gray-300">Bagaimana pengalaman anda dengan papan pendahulu ini?</p>
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
                                    <label className="block text-white font-bold mb-3">Nilaikan papan pendahulu ini:</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                disabled={submittingFeedback}
                                                className={`text-3xl transition-transform ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-500'} ${submittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                            disabled={submittingFeedback}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center ${isInteresting ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isInteresting && (
                                                <span className="text-white text-sm">✓</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-white">Sistem ini menarik dan menghiburkan</span>
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
                                                            disabled={submittingFeedback}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${useStoredPhone ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                                                            disabled={submittingFeedback}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${!useStoredPhone ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} ${submittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                                                            disabled={submittingFeedback}
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
                                                disabled={submittingFeedback}
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
                                    onClick={handleFeedbackSubmit}
                                    disabled={rating === 0 || submittingFeedback}
                                    className={`w-full py-3 rounded-xl font-bold text-lg transition duration-200 flex items-center justify-center gap-2 ${rating === 0 || submittingFeedback ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg'}`}
                                >
                                    {submittingFeedback ? (
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
                        {!feedbackSubmitted && !submittingFeedback && (
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="w-full mt-3 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition duration-200"
                                disabled={submittingFeedback}
                            >
                                Kemudian
                            </button>
                        )}
                    </div>
                </div>
            )}

            <SweetAlertModal
                show={alertModal.show}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
                onConfirm={() => setAlertModal({ ...alertModal, show: false })}
                confirmText="OK"
            />
        </div>
    );
}