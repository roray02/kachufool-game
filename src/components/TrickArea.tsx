import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Player, CardType } from "@/pages";
import { cardValue } from "@/lib/cards";
import TrickPile from "@/components/TrickPile";
import CircularTable from "@/components/CircularTable";

interface TrickAreaProps {
  players: Player[];
  trick: { card: CardType; playerIndex: number }[];
  trumpSuit: string;
  leadSuit: string | null;
  currentTurn: number;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTrick: React.Dispatch<React.SetStateAction<{ card: CardType; playerIndex: number }[]>>;
  setLeadSuit: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentTurn: React.Dispatch<React.SetStateAction<number>>;
  tricksWon: number[];
  setTricksWon: React.Dispatch<React.SetStateAction<number[]>>;
  setPlayingPhase: React.Dispatch<React.SetStateAction<boolean>>;
  setRound: () => void;
}

const TrickArea: React.FC<TrickAreaProps> = ({
  players,
  trick,
  trumpSuit,
  leadSuit,
  currentTurn,
  setPlayers,
  setTrick,
  setLeadSuit,
  setCurrentTurn,
  tricksWon,
  setTricksWon,
  setPlayingPhase,
  setRound,
}) => {
  const isCardPlayable = (card: CardType): boolean => {
    if (!leadSuit) return true;
    if (card.suit === leadSuit) return true;
    const player = players[currentTurn];
    return !player.hand.some((c) => c.suit === leadSuit);
  };

  const playCard = (card: CardType) => {
    const updatedPlayers = [...players];
    const player = updatedPlayers[currentTurn];
    player.hand = player.hand.filter((c) => !(c.suit === card.suit && c.value === card.value));
    setPlayers(updatedPlayers);

    if (trick.length === 0) setLeadSuit(card.suit);

    const newTrick = [...trick, { card, playerIndex: currentTurn }];
    setTrick(newTrick);

    if (newTrick.length === players.length) {
      setTimeout(() => resolveTrick(newTrick), 600);
    } else {
      setCurrentTurn((prev) => (prev + 1) % players.length);
    }
  };

  const resolveTrick = (played: { card: CardType; playerIndex: number }[]) => {
    const winningCard = played.reduce((best, curr) => {
      const isTrump = curr.card.suit === trumpSuit;
      const bestIsTrump = best.card.suit === trumpSuit;

      if (isTrump && !bestIsTrump) return curr;
      if (!isTrump && bestIsTrump) return best;

      const isLead = curr.card.suit === leadSuit;
      const bestIsLead = best.card.suit === leadSuit;

      if (isLead && !bestIsLead) return curr;
      if (!isLead && bestIsLead) return best;

      return cardValue(curr.card.value) > cardValue(best.card.value) ? curr : best;
    });

    const updatedTricksWon = [...tricksWon];
    updatedTricksWon[winningCard.playerIndex]++;
    setTricksWon(updatedTricksWon);

    setTrick([]);
    setLeadSuit(null);
    setCurrentTurn(winningCard.playerIndex);

    const cardsLeft = players[0].hand.length;
    if (cardsLeft === 0) {
      const updatedPlayers = players.map((p, i) => {
        const correct = p.bid === updatedTricksWon[i];
        const points = correct ? 10 + (p.bid || 0) : 0;
        return { ...p, score: p.score + points, actual: updatedTricksWon[i] };
      });
      setPlayers(updatedPlayers);
      setPlayingPhase(false);
      setRound();
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold">Trick {players[0].hand.length + 1}</h2>
        <p className="mb-2">Trump Suit: {trumpSuit}</p>

        <CircularTable
          players={players}
          currentTurn={currentTurn}
          dealerIndex={players.findIndex(p => p.bid === null)} // optionally pass real dealerIndex if available
          onPlayCard={playCard}
        />

      <div className="mt-4 relative h-64">
        <TrickPile trick={trick} players={players} />
      </div>

      </CardContent>
    </Card>
  );
};

export default TrickArea;