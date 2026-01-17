"use client";

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black dark:bg-[#0b0e13] backdrop-blur-xl">

            <div className="flex flex-col items-center gap-6">

                {/* LOGO / BRAND */}
                <div className="text-3xl font-extrabold tracking-tight
          text-white animate-pulse">
                    Techis Talk
                </div>

                {/* LOADER RING */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-300/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 
            border-t-transparent animate-spin" />
                </div>

                {/* TEXT */}
                <p className="text-sm text-white dark:text-white tracking-wide">
                    Connecting you...
                </p>
            </div>
        </div>
    );
};

export default Loading;
