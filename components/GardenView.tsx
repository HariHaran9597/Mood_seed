
import React from 'react';
import { Plant } from '../types';
import { PlantDisplay } from './PlantDisplay';

interface GardenViewProps {
  garden: Plant[];
  onSelectPlant: (plant: Plant) => void;
}

export const GardenView: React.FC<GardenViewProps> = ({ garden, onSelectPlant }) => {
  if (garden.length === 0) {
    return (
      <div className="text-center text-slate-400">
        <h2 className="text-2xl font-bold mb-2">Your garden is empty.</h2>
        <p>Create a new plant from a journal entry to begin your collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {garden.map((plant) => (
        <div
          key={plant.id}
          className="bg-slate-800/50 rounded-lg p-2 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/10"
          onClick={() => onSelectPlant(plant)}
        >
          <PlantDisplay plant={plant} />
          <div className="p-2 text-center">
            <p className="font-bold text-sm truncate text-teal-300">{plant.params.mood}</p>
            <p className="text-xs text-slate-400">{new Date(plant.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
