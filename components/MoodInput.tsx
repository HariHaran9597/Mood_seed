
import React from 'react';

interface MoodInputProps {
  journalText: string;
  setJournalText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

export const MoodInput: React.FC<MoodInputProps> = ({ journalText, setJournalText, onGenerate, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <label htmlFor="journal" className="text-lg font-medium mb-2 self-start">How are you feeling today?</label>
      <textarea
        id="journal"
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write about your day, your thoughts, your dreams..."
        className="w-full h-48 p-4 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-slate-200 resize-none"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 px-8 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-3 w-48"
      >
        {isLoading ? <><LoadingSpinner /><span>Growing...</span></> : 'Grow Plant'}
      </button>
    </div>
  );
};
