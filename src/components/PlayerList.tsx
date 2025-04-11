import React from "react";
import { Player } from "@/pages";

interface PlayerListProps {
  players: Player[];
  dealerIndex: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, dealerIndex }) => {
  return (
    <div>
      <p className="font-semibold">Players ({players.length}/6):</p>
      <ul className="list-disc list-inside">
        {players.map((p, i) => (
          <li key={i}>
            {p.name}
            {i === dealerIndex && <span className="ml-2 text-sm font-semibold text-blue-600">(Dealer)</span>}
            {' '}- Bid: {p.bid ?? "-"} – Tricks Won: {p.actual ?? "-"} – Score: {p.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
