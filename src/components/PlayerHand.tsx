import React from 'react';
import { Player } from '../types';
import { Card } from './Card';

interface PlayerHandProps {
  player: Player;
  isDealer?: boolean;
}

export function PlayerHand({ player, isDealer }: PlayerHandProps) {
  return (
    <div className={`flex flex-col items-center ${player.isCurrentTurn ? 'ring-4 ring-blue-400 rounded-xl p-4' : 'p-4'}`}>
      <div className="flex flex-col items-center mb-2">
        <h3 className="text-lg font-semibold">{isDealer ? 'Dealer' : player.name}</h3>
        {!isDealer && (
          <p className="text-sm text-gray-600">
            Bankroll: ${player.bankroll} | Bet: ${player.currentBet}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {player.cards.map((card, index) => (
          <Card 
            key={index} 
            card={card} 
            hidden={isDealer && index === 1 && player.cards.length === 2}
          />
        ))}
      </div>
      {player.status === 'bust' && (
        <span className="mt-2 text-red-600 font-bold">BUST!</span>
      )}
    </div>
  );
}