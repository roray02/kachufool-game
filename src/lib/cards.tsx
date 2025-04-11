export const suits = ['♠', '♦', '♣', '♥'];
export const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export type CardType = {
  suit: string;
  value: string;
};

export const shuffleDeck = (): CardType[] => {
  const deck: CardType[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const cardValue = (value: string): number => {
  return values.indexOf(value);
};
