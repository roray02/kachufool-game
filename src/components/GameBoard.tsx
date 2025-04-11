import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@/pages";

interface GameBoardProps {
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {players.map((player, idx) => (
        <Card key={idx}>
          <CardContent>
            <h2 className="font-semibold">{player.name}'s Hand</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {player.hand.map((card, j) => (
                <span
                  key={j}
                  className="px-2 py-1 border rounded shadow-sm bg-gray-50"
                >
                  {card.value}
                  {card.suit}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GameBoard;
