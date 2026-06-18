import { useEffect } from 'react';

export default function SweetAlertModal({ 
    show, 
    title, 
    message, 
    type = 'warning',
    onConfirm,
    confirmText = 'OK',
    showCancel = false,
    cancelText = 'Batal',
    onCancel 
}) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    // Icon based on type
    const getIcon = () => {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            case 'question': return '❓';
            case 'warning': return '⚠️';
            default: return '⚠️';
        }
    };

    // Color based on type
    const getColor = () => {
        switch(type) {
            case 'success': return 'border-green-500';
            case 'error': return 'border-red-500';
            case 'info': return 'border-blue-500';
            case 'question': return 'border-purple-500';
            case 'warning': return 'border-yellow-500';
            default: return 'border-yellow-500';
        }
    };

    // Button color based on type
    const getButtonColor = () => {
        switch(type) {
            case 'success': return 'bg-green-600 hover:bg-green-700';
            case 'error': return 'bg-red-600 hover:bg-red-700';
            case 'info': return 'bg-blue-600 hover:bg-blue-700';
            case 'question': return 'bg-purple-600 hover:bg-purple-700';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700';
            default: return 'bg-blue-600 hover:bg-blue-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[9999]">
            <div className={`bg-gray-800 rounded-2xl shadow-2xl border-2 ${getColor()} max-w-md w-full p-6 animate-scale-in`}>
                <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{getIcon()}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-300">{message}</p>
                </div>

                <div className="flex gap-3">
                    {showCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition duration-200"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={`flex-1 ${getButtonColor()} text-white py-3 rounded-lg font-bold hover:shadow-lg transition duration-200`}
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}