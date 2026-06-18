import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ auth = { user: { name: 'Ahmad Zaidi', mykad_number: '040615-10-1234' } } }) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);



    const handleLogout = async () => {
        await axios.post('/logout');
        window.location.href = '/';
    };


    const cards = [
        {
            id: 'quiz',
            title: 'Quiz Arena',
            description: 'Ulang kaji pintar berstruktur',
            gradient: 'from-violet-600 via-purple-600 to-indigo-600',
            buttonText: 'Mulakan Quiz',
            href: '/quiz-arena',
            image: '/images/ppas_icon.png',
        },
        {
            id: 'xcelearn',
            title: 'Xcelearn',
            description: 'Kelas tuisyen online interaktif',
            gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
            buttonText: 'Terokai Kursus',
            href: '/sample-xcelearn',
            image: '/images/xcelearn_icon.png',
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            {/* Animated geometric background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                {/* Glowing orbs */}
                <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-pulse-slow"></div>
                <div className="absolute top-1/4 -right-40 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-pulse-slower"></div>
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-pulse-slowest"></div>

                {/* Floating particles */}
                <div className="absolute top-20 left-1/4 w-3 h-3 bg-white/60 rounded-full animate-float shadow-lg"></div>
                <div className="absolute top-40 right-1/4 w-4 h-4 bg-yellow-200/80 rounded-full animate-float-delay-1 shadow-lg"></div>
                <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-pink-200/80 rounded-full animate-float-delay-2 shadow-lg"></div>
                <div className="absolute top-60 right-1/3 w-3 h-3 bg-cyan-200/80 rounded-full animate-float-delay-3 shadow-lg"></div>

                {/* Diagonal lines */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>

                {/* Additional sparkle effects */}
                <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Portal Pelajar
                                </h1>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-gray-700">
                                    {auth.user.name} 👋
                                </p>
                                <p className="text-xs text-gray-500">
                                    {auth.user.mykad_number}
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {auth.user.name.charAt(0)}
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                                        <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-700">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {auth.user.mykad_number}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2 transition-colors"
                                        >
                                            <span>🚪</span>
                                            <span>Keluar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                    <div className="text-center">
                        <div className={`inline-block mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full shadow-5xl border border-white/50 animate-bounce-slow">
                                <span className="text-2xl">✨</span>
                                <span className="text-md font-semibold text-white drop-shadow">
                                    Selamat Datang Kembali!
                                </span>
                            </div>
                        </div>

                        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black mb-6 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <span className="text-white drop-shadow-2xl animate-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-300% bg-clip-text text-transparent">
                                Masa Untuk Belajar
                            </span>
                        </h1>

                        <p className={`text-xl sm:text-2xl text-white/90 drop-shadow-lg max-w-3xl mx-auto font-medium transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            Pilih modul pembelajaran anda dan teruskan perjalanan ke arah kejayaan 🚀
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                        {cards.map((card, index) => (
                            <a
                                key={card.id}
                                href={card.href}
                                className={`relative w-full max-w-2xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${700 + index * 200}ms` }}
                            >
                                {/* GROUP */}
                                <div className="group relative">

                                    {/* Floating Image */}
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="
          absolute
          -top-28
          left-1/2
          -translate-x-1/2
          w-full
          max-w-xs
          z-20
          transition-all
          duration-300
          group-hover:translate-y-[-8px]
          group-hover:scale-105
          drop-shadow-2xl
        "
                                    />

                                    {/* Glow effect behind card */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 blur-3xl rounded-[2.75rem] transition-opacity duration-300 group-hover:opacity-30`}></div>

                                    {/* Card Container */}
                                    <div
                                        className="
          relative
          rounded-[2.75rem]
          shadow-2xl
          overflow-hidden
          bg-white/95
          backdrop-blur-sm
          border-4
          border-white/50
          transition-all
          duration-300
          group-hover:-translate-y-2
          group-hover:shadow-purple-300/50
          group-hover:border-white/80
        "
                                    >
                                        {/* Top Gradient */}
                                        <div className={`bg-gradient-to-br ${card.gradient} pt-36 pb-16 px-14 text-white text-center relative overflow-hidden`}>
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                            {/* Animated waves */}
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent animate-wave"></div>
                                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent animate-wave-delay"></div>
                                            </div>

                                            <h2 className="text-5xl font-black relative z-10">{card.title}</h2>
                                            <p className="mt-4 text-xl text-white/90 font-medium relative z-10">{card.description}</p>
                                        </div>

                                        {/* Footer */}
                                        <div className="bg-white px-12 py-10">
                                            <button
                                                className={`
              w-full
              bg-gradient-to-r ${card.gradient}
              text-white
              font-bold
              text-2xl
              py-6
              rounded-3xl
              shadow-lg
              transition-all
              hover:scale-[1.03]
              hover:shadow-2xl
              relative
              overflow-hidden
              group/btn
            `}
                                            >
                                                <span className="relative z-10">{card.buttonText} →</span>
                                                {/* Button shimmer */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}

                    </div>
                </div>


                {/* Footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="text-center">
                        <p className="text-white/90 font-semibold drop-shadow">
                            Dibuat dengan 💜 untuk pelajar yang hebat
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.25; }
                }
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.3; }
                }
                @keyframes pulse-slowest {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.2; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); opacity: 0.5; }
                    50% { transform: translateY(-20px); opacity: 1; }
                }
                @keyframes float-card {
                    0%, 100% { transform: translate(-50%, 0px); }
                    50% { transform: translate(-50%, -10px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes wave {
                    0% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25%) translateY(-5px); }
                    100% { transform: translateX(-50%) translateY(0); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-pulse-slower {
                    animation: pulse-slower 10s ease-in-out infinite;
                }
                .animate-pulse-slowest {
                    animation: pulse-slowest 12s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delay-1 {
                    animation: float 7s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-float-delay-2 {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 2s;
                }
                .animate-float-delay-3 {
                    animation: float 9s ease-in-out infinite;
                    animation-delay: 3s;
                }
                .animate-float-card {
                    animation: float-card 4s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .animate-gradient {
                    animation: gradient 8s ease infinite;
                }
                .bg-300% {
                    background-size: 300%;
                }
                .animate-wave {
                    animation: wave 8s linear infinite;
                }
                .animate-wave-delay {
                    animation: wave 10s linear infinite;
                    animation-delay: -5s;
                }
            `}</style>
        </div>
    );
}