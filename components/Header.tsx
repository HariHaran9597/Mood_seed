
import React from 'react';
import { LeafIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-3">
        <LeafIcon className="w-10 h-10 sm:w-12 sm:h-12 text-teal-400" />
        MoodSeed
      </h1>
      <p className="text-slate-400 mt-2 text-base sm:text-lg">Your digital garden of emotions.</p>
    </header>
  );
};
