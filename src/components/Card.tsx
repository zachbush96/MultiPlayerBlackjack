import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

export function Card({ card, hidden }: CardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (hidden) {
    return (
      <div className="w-24 h-36 bg-white rounded-lg shadow-md border-2 border-gray-200 flex items-center justify-center p-2 m-1">
        <div className="w-full h-full bg-blue-800 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="w-24 h-36 bg-white rounded-lg shadow-md border-2 border-gray-200 flex flex-col justify-between p-2 m-1">
      <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.value}
      </div>
      <div className={`text-4xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.suit}
      </div>
      <div className={`text-lg font-bold self-end ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.value}
      </div>
    </div>
  );
}