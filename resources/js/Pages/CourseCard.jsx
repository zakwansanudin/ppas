export default function CourseCard() {
    return (
        <div className="relative w-full max-w-md mx-auto mt-6">

            {/* Floating Image */}
            <img
                src="/images/xcelearn_icon.png"
                alt="Xcelearn"
                className="absolute -top-14 left-1/2 -translate-x-1/2 w-40 z-20"
            />

            {/* Card Container */}
            <div className="rounded-3xl shadow-xl overflow-hidden">

                {/* Top Gradient Section */}
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 pt-20 pb-8 px-8 text-white text-center">
                    <h2 className="text-2xl font-bold">Xcelearn</h2>
                    <p className="mt-1 opacity-90">
                        Kelas tuisyen online interaktif
                    </p>
                </div>

                {/* White Footer (Full Width) */}
                <div className="bg-white px-6 py-6">
                    <button className="w-full bg-teal-600 text-white font-semibold py-4 rounded-2xl shadow-md hover:bg-teal-700 transition">
                        Terokai Kursus →
                    </button>
                </div>

            </div>
        </div>
    );
}
