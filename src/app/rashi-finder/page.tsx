import React from 'react';

const RashiFinderPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-[#161513] dark:text-white antialiased">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-fixed">
        <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-primary/10">
          <button className="p-2 -ml-2 text-primary">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-display font-bold mr-8">Discover Your Rashi</h1>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative size-32 rounded-full border-2 border-primary/30 flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-pulse">auto_awesome</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-sapphire dark:text-primary mb-3">Celestial Alignment</h2>
            <p className="text-[#80776b] text-sm leading-relaxed px-4">
              Knowing your Rashi helps find the right remedies and gemstones to balance your life's energies.
            </p>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">person</span>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#2a2825] border border-primary/10 rounded-xl parchment-shadow input-focus text-base"
                  placeholder="Enter your name"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Date of Birth</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">calendar_today</span>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#2a2825] border border-primary/10 rounded-xl parchment-shadow input-focus text-base appearance-none"
                  type="date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Time of Birth</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">schedule</span>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#2a2825] border border-primary/10 rounded-xl parchment-shadow input-focus text-base"
                  type="time"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Place of Birth</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">location_on</span>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#2a2825] border border-primary/10 rounded-xl parchment-shadow input-focus text-base"
                  placeholder="City, State, Country"
                  type="text"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-primary/30 text-lg">my_location</span>
                </div>
              </div>
            </div>
          </form>
          <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-[11px] text-[#80776b] font-medium italic">
              All calculations are based on Vedic Astrology principles for 100% accuracy.
            </p>
          </div>
        </main>
        <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95">
          <button className="w-full h-16 bg-saffron hover:bg-[#e68a2e] text-white font-bold text-lg rounded-2xl shadow-xl shadow-saffron/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">cyclone</span>
            Generate Report
          </button>
        </div>
        <nav className="hidden fixed bottom-0 inset-x-0 h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 flex items-center justify-around px-6 z-50">
          <button className="flex flex-col items-center gap-1 text-[#80776b]">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#80776b]">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-[10px] font-medium">Shop</span>
          </button>
          <button className="flex flex-col items-center gap-1 -mt-8">
            <div className="size-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-background-light dark:border-background-dark">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <span className="text-[10px] font-bold text-primary mt-1">Consult</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#80776b]">
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-[10px] font-medium">Wishlist</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#80776b]">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default RashiFinderPage;
