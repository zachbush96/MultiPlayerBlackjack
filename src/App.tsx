import React, { useState, useEffect } from 'react';
import { PlayerHand } from './components/PlayerHand';
import { GameControls } from './components/GameControls';
import { GameState, Player, Card } from './types';
import { CircleDollarSign } from 'lucide-react';

const INITIAL_BANKROLL = 100;

function createDeck(): Card[] {
  const suits: Card['suit'][] = ['♠', '♣', '♥', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  return shuffle(deck);
}

function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function calculateHandValue(cards: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.hidden) continue;
    if (card.value === 'A') {
      aces += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

function App() {
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    dealer: { cards: [], status: 'waiting' },
    gameStatus: 'betting',
    deck: createDeck(),
  });
  const [currentBet, setCurrentBet] = useState(10);

  useEffect(() => {
    if (!playerName) {
      const name = prompt('Enter your name:') || `Player ${Math.floor(Math.random() * 1000)}`;
      setPlayerName(name);
      setGameState(prev => ({
        ...prev,
        players: [{
          id: '1',
          name,
          cards: [],
          bankroll: INITIAL_BANKROLL,
          currentBet: 0,
          status: 'playing',
          isCurrentTurn: true
        }]
      }));
    }
  }, [playerName]);

  const dealInitialCards = () => {
    const deck = [...gameState.deck];
    const playerCards = [deck.pop()!, deck.pop()!];
    const dealerCards = [deck.pop()!, { ...deck.pop()!, hidden: true }];

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => ({
        ...player,
        cards: playerCards,
        currentBet,
        bankroll: player.bankroll - currentBet
      })),
      dealer: {
        ...prev.dealer,
        cards: dealerCards,
        status: 'waiting'
      },
      deck,
      gameStatus: 'playing'
    }));
  };

  const hit = () => {
    const deck = [...gameState.deck];
    const newCard = deck.pop()!;
    
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.isCurrentTurn) {
          const newCards = [...player.cards, newCard];
          const value = calculateHandValue(newCards);
          return {
            ...player,
            cards: newCards,
            status: value > 21 ? 'bust' : 'playing'
          };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
        deck
      };
    });
  };

  const stand = () => {
    setGameState(prev => {
      const currentPlayer = prev.players.find(p => p.isCurrentTurn);
      if (!currentPlayer) return prev;

      // Reveal dealer's cards and play dealer's hand
      const dealerCards = prev.dealer.cards.map(card => ({ ...card, hidden: false }));
      let finalDealerCards = [...dealerCards];
      const deck = [...prev.deck];

      while (calculateHandValue(finalDealerCards) < 17) {
        finalDealerCards = [...finalDealerCards, deck.pop()!];
      }

      const dealerValue = calculateHandValue(finalDealerCards);
      const playerValue = calculateHandValue(currentPlayer.cards);

      // Determine winner and update bankroll
      const playerWins = 
        (dealerValue > 21) || 
        (playerValue <= 21 && playerValue > dealerValue);

      return {
        ...prev,
        players: prev.players.map(player => ({
          ...player,
          status: 'standing',
          bankroll: playerWins ? 
            player.bankroll + (player.currentBet * 2) : 
            player.bankroll
        })),
        dealer: {
          ...prev.dealer,
          cards: finalDealerCards,
          status: 'standing'
        },
        deck,
        gameStatus: 'roundOver'
      };
    });
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => ({
        ...player,
        cards: [],
        currentBet: 0,
        status: 'playing'
      })),
      dealer: {
        cards: [],
        status: 'waiting'
      },
      deck: createDeck(),
      gameStatus: 'betting'
    }));
  };

  const currentPlayer = gameState.players[0];
  const isGameOver = currentPlayer?.status === 'bust' || gameState.gameStatus === 'roundOver';

  return (
    <div className="min-h-screen bg-green-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CircleDollarSign size={32} />
            Blackjack
          </h1>
          {gameState.gameStatus === 'roundOver' && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              New Game
            </button>
          )}
        </header>

        <div className="space-y-8">
          <PlayerHand player={{ 
            ...gameState.dealer, 
            name: 'Dealer',
            id: 'dealer',
            bankroll: 0,
            currentBet: 0,
            status: 'playing',
            isCurrentTurn: false
          }} isDealer />
          
          <div className="border-t border-white/20 my-8" />
          
          {gameState.players.map(player => (
            <PlayerHand key={player.id} player={player} />
          ))}
        </div>

        {gameState.gameStatus === 'betting' ? (
          <GameControls
            onHit={() => dealInitialCards()}
            onStand={() => {}}
            disabled={false}
            currentBet={currentBet}
            onBetChange={setCurrentBet}
            gameStatus="betting"
          />
        ) : (
          <GameControls
            onHit={hit}
            onStand={stand}
            disabled={isGameOver}
            currentBet={currentBet}
            onBetChange={setCurrentBet}
            gameStatus="playing"
          />
        )}
      </div>
    </div>
  );
}

export default App;