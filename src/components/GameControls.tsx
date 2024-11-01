import React from 'react';
import { Play, Square } from 'lucide-react';

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  disabled: boolean;
  currentBet: number;
  onBetChange: (bet: number) => void;
  gameStatus: 'betting' | 'playing' | 'roundOver';
}

export function GameControls({ 
  onHit, 
  onStand, 
  disabled, 
  currentBet, 
  onBetChange,
  gameStatus
}: GameControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {gameStatus === 'betting' ? (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">
              Bet Amount: $
              <input
                type="number"
                min="1"
                max="100"
                value={currentBet}
                onChange={(e) => onBetChange(Number(e.target.value))}
                className="ml-2 w-20 p-2 border rounded"
              />
            </label>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={onHit}
              disabled={disabled}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Play size={20} />
              Hit
            </button>
            <button
              onClick={onStand}
              disabled={disabled}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Square size={20} />
              Stand
            </button>
          </div>
        )}
      </div>
    </div>
  );
}