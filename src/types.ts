export interface Player {
  id: string;
  name: string;
  cards: Card[];
  bankroll: number;
  currentBet: number;
  status: 'playing' | 'standing' | 'bust';
  isCurrentTurn: boolean;
}

export interface Card {
  suit: '♠' | '♣' | '♥' | '♦';
  value: string;
  hidden?: boolean;
}

export interface GameState {
  players: Player[];
  dealer: {
    cards: Card[];
    status: 'waiting' | 'playing' | 'standing';
  };
  gameStatus: 'betting' | 'playing' | 'roundOver';
  deck: Card[];
}