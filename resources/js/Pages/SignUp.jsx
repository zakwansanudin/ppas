import { useState } from 'react';
import { useForm } from '@inertiajs/react';

// Komponen mock (atau gantikan dengan import anda)
const InputLabel = ({ htmlFor, value, className = "" }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
        {value}
    </label>
);

const TextInput = ({ className = "", ...props }) => (
    <input
        className={`border-2 focus:outline-none focus:ring-4 rounded-xl shadow-sm w-full ${className}`}
        {...props}
    />
);

const PrimaryButton = ({ children, className = "", ...props }) => (
    <button
        className={`font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default function UserForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        mykad_number: '',
        phone:''
    });

    const [message, setMessage] = useState('');
    const [isHovering, setIsHovering] = useState(false);

    const formatMyKad = (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 6) return digits;
        if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
        return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}`;
    };

    const formatPhone = (value) => {
        // Remove all non-digit characters
        let numbers = value.replace(/\D/g, '');

        // Format as 3-4-4 (012-3456 7890)
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)} ${numbers.slice(7, 11)}`;
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        post(route('signup.store'), {
            onError: (err) => {
                setMessage('⚠️ Sila betulkan kesalahan di bawah.');
            },
            onSuccess: () => {
                setMessage(`✅ Selamat datang, ${data.name}! Mengalihkan...`);
            },
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        }}>
            {/* Emoji terapung */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute text-6xl opacity-80" style={{ top: '10%', left: '5%', animation: 'float1 3s ease-in-out infinite' }}>📚</div>
                <div className="absolute text-5xl opacity-80" style={{ top: '20%', right: '10%', animation: 'float2 4s ease-in-out infinite' }}>✏️</div>
                <div className="absolute text-6xl opacity-80" style={{ bottom: '15%', left: '8%', animation: 'float3 3.5s ease-in-out infinite' }}>🎒</div>
                <div className="absolute text-5xl opacity-80" style={{ bottom: '25%', right: '5%', animation: 'float4 4.5s ease-in-out infinite' }}>⭐</div>
            </div>

            {/* Kandungan utama */}
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 relative transform transition-all duration-300 hover:shadow-pink-300/50" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-block rounded-full p-4 mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', animation: 'pulse 2s ease-in-out infinite' }}>
                                <span className="text-6xl">🎓</span>
                            </div>
                            <h1 className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Portal Pelajar</h1>
                            <p className="text-gray-600 text-lg font-medium">Mari kita daftar anda! 🚀</p>
                        </div>

                        {/* Mesej */}
                        {message && (
                            <div className={`mb-6 text-center p-4 rounded-2xl font-bold text-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`} style={{ animation: message.includes('✅') ? 'bounce 0.5s' : 'shake 0.5s' }}>
                                {message}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Input nama */}
                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <InputLabel htmlFor="name" value="👤 Apakah nama anda?" className="text-lg font-bold text-purple-700 mb-2" />
                                <div className="relative">
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        className="text-lg p-4 border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                                        placeholder="Sila masukkan nama anda! ✨"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>
                            </div>

                            {/* Input MyKad */}
                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <InputLabel htmlFor="mykad_number" value="🆔 Nombor MyKad" className="text-lg font-bold text-pink-700 mb-2" />
                                <div className="relative">
                                    <TextInput
                                        id="mykad_number"
                                        type="text"
                                        name="mykad_number"
                                        className="font-mono tracking-wide text-lg p-4 border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                                        placeholder="XXXXXX-XX-XXXX"
                                        maxLength={14}
                                        value={data.mykad_number}
                                        onChange={(e) => setData('mykad_number', formatMyKad(e.target.value))}
                                    />
                                    {errors.mykad_number && <p className="text-red-600 text-sm mt-1">{errors.mykad_number}</p>}
                                </div>
                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                    <span>💡</span> <span>12 digit diperlukan! (contoh: 040615-10-1234)</span>
                                </p>
                            </div>

                            {/* Input Phone */}
                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <InputLabel
                                    htmlFor="phone"
                                    value="📱 Nombor Telefon"
                                    className="text-lg font-bold text-pink-700 mb-2"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        className="font-mono tracking-wide text-lg p-4 border-pink-300 focus:border-pink-500 focus:ring-pink-200"
                                        placeholder="012-3456 7890"
                                        maxLength={13}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', formatPhone(e.target.value))}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                    <span>💡</span>
                                    <span>Format: 012-3456 7890</span>
                                </p>
                            </div>


                            {/* Butang Hantar */}
                            <div className="pt-4">
                                <PrimaryButton type="submit" disabled={processing} className="w-full text-xl py-4 text-white shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                                    {isHovering ? '🚀 Jom Mula!' : '🎯 Daftar Masuk'}
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">Semoga hari anda cemerlang di sekolah! 🌟</p>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-white font-bold text-sm drop-shadow-lg">Dibuat dengan 💜 untuk pelajar yang hebat</div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-20px) rotate(10deg);} }
                @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-25px) rotate(-10deg);} }
                @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-15px) rotate(5deg);} }
                @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-30px) rotate(-5deg);} }
                @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.1);} }
                @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
                @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-10px);} 75%{transform:translateX(10px);} }
            `}</style>
        </div>
    );
}