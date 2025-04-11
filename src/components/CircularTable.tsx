import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Player, CardType } from "@/pages";

interface CircularTableProps {
  players: Player[];
  currentTurn: number;
  dealerIndex: number;
  onPlayCard?: (card: CardType) => void;
}

const CircularTable: React.FC<CircularTableProps> = ({ players, currentTurn, dealerIndex, onPlayCard }) => {
  const angleStep = 360 / players.length;

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <div className="w-[400px] h-[400px] rounded-full border border-gray-300 relative">
        {players.map((player, index) => {
          const angle = angleStep * index;
          const rad = (angle * Math.PI) / 180;
          const x = 180 + 160 * Math.cos(rad);
          const y = 180 + 160 * Math.sin(rad);
          const isCurrent = currentTurn === index;
          const isDealer = dealerIndex === index;

          return (
            <div
              key={index}
              className={`absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
              style={{ top: `${y}px`, left: `${x}px` }}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {player.name} {isDealer && <span className="text-sm text-blue-600">(Dealer)</span>}
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {player.hand.map((card, idx) => {
                    const isRed = card.suit === '♦' || card.suit === '♥';
                    return (
                      <button
                        key={idx}
                        className={`px-1 py-0.5 text-sm border rounded ${isRed ? 'text-red-600' : 'text-black'} bg-white shadow hover:shadow-md transition-all`}
                        disabled={!onPlayCard}
                        onClick={() => onPlayCard?.(card)}
                      >
                        {card.value}{card.suit}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularTable;
