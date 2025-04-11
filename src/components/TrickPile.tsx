import React from "react";
import { CardType, Player } from "@/pages";

interface TrickPileProps {
  trick: { card: CardType; playerIndex: number }[];
  players: Player[];
}

const TrickPile: React.FC<TrickPileProps> = ({ trick, players }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {trick.map((entry, i) => {
          const isRed = entry.card.suit === "♥" || entry.card.suit === "♦";
          return (
            <div
              key={i}
              className={`absolute bg-white border px-2 py-1 rounded shadow-md transition-all duration-500 ease-out scale-110 animate-fly-in opacity-90 ${isRed ? 'text-red-600' : 'text-black'}`}
              style={{ transform: `translate(${i * 12}px, ${i * 8}px)` }}
            >
              {entry.card.value}{entry.card.suit}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrickPile;