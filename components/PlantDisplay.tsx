
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Plant } from '../types';
import { generateLSystem, interpretLSystem } from '../services/lindenmayerService';

interface PlantDisplayProps {
  plant: Plant;
}

export const PlantDisplay: React.FC<PlantDisplayProps> = ({ plant }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState('0 0 100 100');

  const { lines, gradientId } = useMemo(() => {
    const { params } = plant;
    const lSystemString = generateLSystem(params.axiom, params.rules, params.iterations);
    const generatedLines = interpretLSystem(
      lSystemString,
      params.initialAngle,
      params.turnAngle,
      params.branchLength,
      params.lengthFactor,
      params.strokeWidth
    );
    return {
        lines: generatedLines,
        gradientId: `gradient-${plant.id}`
    };
  }, [plant]);

  useEffect(() => {
    if (lines.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      lines.forEach(line => {
        minX = Math.min(minX, line.x1, line.x2);
        minY = Math.min(minY, line.y1, line.y2);
        maxX = Math.max(maxX, line.x1, line.x2);
        maxY = Math.max(maxY, line.y1, line.y2);
      });
      const padding = 20;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;
      setViewBox(`${minX - padding} ${minY - padding} ${width} ${height}`);
    } else {
        // Center on 0,0 for the initial point before lines are drawn
        setViewBox('-50 -100 100 100');
    }
  }, [lines]);

  const pathData = useMemo(() => {
      if (lines.length === 0) return "";
      return lines.map(l => `M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`).join(' ');
  }, [lines]);

  return (
    <div className="w-full aspect-square bg-slate-800/50 rounded-lg p-2">
      <svg ref={svgRef} viewBox={viewBox} width="100%" height="100%">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            {plant.params.colorStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <path
            className="plant-path"
            d={pathData}
            stroke={`url(#${gradientId})`}
            strokeWidth={plant.params.strokeWidth / (plant.params.iterations * 0.8) }
            strokeLinecap="round"
            fill="none"
        />
      </svg>
    </div>
  );
};
