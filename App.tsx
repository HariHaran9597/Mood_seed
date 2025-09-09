
import React, { useState, useEffect, useCallback } from 'react';
import { Plant, PlantParameters, View } from './types';
import { generatePlantFromMood } from './services/geminiService';
import { Header } from './components/Header';
import { MoodInput } from './components/MoodInput';
import { PlantDisplay } from './components/PlantDisplay';
import { GardenView } from './components/GardenView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LeafIcon, BookOpenIcon, SaveIcon, ArrowLeftIcon } from './components/Icons';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.CREATE);
  const [journalText, setJournalText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
  const [garden, setGarden] = useLocalStorage<Plant[]>('moodseed-garden', []);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const handleGeneratePlant = async () => {
    if (!journalText.trim()) {
      setError('Please write something in your journal.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentPlant(null);

    try {
      const plantParams: PlantParameters = await generatePlantFromMood(journalText);
      const newPlant: Plant = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        journalText,
        params: plantParams,
      };
      setCurrentPlant(newPlant);
    } catch (e) {
      console.error(e);
      setError('Could not grow a plant from this entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveToGarden = () => {
    if (currentPlant) {
      setGarden([currentPlant, ...garden]);
      setCurrentPlant(null);
      setJournalText('');
      setView(View.GARDEN);
    }
  };

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setView(View.DETAIL);
  }

  const renderContent = () => {
    switch(view) {
      case View.CREATE:
        return (
          <>
            <MoodInput
              journalText={journalText}
              setJournalText={setJournalText}
              onGenerate={handleGeneratePlant}
              isLoading={isLoading}
            />
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            {currentPlant && !isLoading && (
              <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center">
                <h3 className="text-xl font-bold text-teal-300 mb-2">Your new creation: A "{currentPlant.params.mood}" plant</h3>
                <PlantDisplay plant={currentPlant} />
                <button
                  onClick={handleSaveToGarden}
                  className="mt-4 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <SaveIcon />
                  Save to Garden
                </button>
              </div>
            )}
          </>
        );
      case View.GARDEN:
        return <GardenView garden={garden} onSelectPlant={handleSelectPlant} />;
      case View.DETAIL:
        return (
          <div className="w-full max-w-4xl mx-auto">
            <button onClick={() => setView(View.GARDEN)} className="mb-4 flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
              <ArrowLeftIcon />
              Back to Garden
            </button>
            {selectedPlant && (
               <div className="flex flex-col md:flex-row gap-8 bg-slate-800/50 p-6 rounded-xl">
                 <div className="md:w-1/2">
                   <PlantDisplay plant={selectedPlant} />
                 </div>
                 <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-teal-300 mb-2">{selectedPlant.params.mood}</h2>
                   <p className="text-sm text-slate-400 mb-4">{new Date(selectedPlant.date).toLocaleString()}</p>
                   <div className="prose prose-invert bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                     <p>{selectedPlant.journalText}</p>
                   </div>
                 </div>
               </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 font-sans p-4 sm:p-6 md:p-8">
      <Header />
      <nav className="flex justify-center my-8">
        <div className="bg-slate-800 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setView(View.CREATE)}
            className={`px-4 py-2 rounded-md transition-colors text-sm sm:text-base font-semibold flex items-center gap-2 ${view === View.CREATE ? 'bg-teal-500 text-white' : 'hover:bg-slate-700'}`}
          >
            <LeafIcon /> Create
          </button>
          <button
            onClick={() => { setView(View.GARDEN); setSelectedPlant(null); }}
            className={`px-4 py-2 rounded-md transition-colors text-sm sm:text-base font-semibold flex items-center gap-2 ${view === View.GARDEN || view === View.DETAIL ? 'bg-teal-500 text-white' : 'hover:bg-slate-700'}`}
          >
            <BookOpenIcon /> My Garden ({garden.length})
          </button>
        </div>
      </nav>
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
