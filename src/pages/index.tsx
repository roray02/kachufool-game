// index.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlayerList from "@/components/PlayerList";
import TrickArea from "@/components/TrickArea";
import GameBoard from "@/components/GameBoard";
import { suits, values, shuffleDeck, cardValue } from "@/lib/cards";

export type CardType = {
  suit: string;
  value: string;
};

export type Player = {
  name: string;
  hand: CardType[];
  bid: number | null;
  actual: number | null;
  score: number;
};

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [biddingPhase, setBiddingPhase] = useState(false);
  const [handsDealt, setHandsDealt] = useState(false);
  const [currentBidderIndex, setCurrentBidderIndex] = useState(0);
  const [currentBidInput, setCurrentBidInput] = useState("");
  const [maxCardsPerRound, setMaxCardsPerRound] = useState(5);
  const [playingPhase, setPlayingPhase] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [trick, setTrick] = useState<{ card: CardType; playerIndex: number }[]>([]);
  const [leadSuit, setLeadSuit] = useState<string | null>(null);
  const [tricksWon, setTricksWon] = useState<number[]>([]);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [roundOver, setRoundOver] = useState(false);

  const totalTricks = () => Math.min(round, maxCardsPerRound);
  const trumpSuits = ['♠', '♦', '♣', '♥'];
  const trumpSuit = trumpSuits[(round - 1) % 4];

  const addPlayer = () => {
    if (players.length < 6 && nameInput.trim()) {
      setPlayers((prev) => [
        ...prev,
        {
          name: nameInput.trim(),
          hand: [],
          bid: null,
          actual: null,
          score: 0,
        },
      ]);
      setNameInput("");
    }
  };

  const startRound = () => {
    const shuffled = shuffleDeck();
    const cardsPerPlayer = totalTricks();
    const newPlayers = players.map((player, i) => ({
      ...player,
      hand: shuffled.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer),
      bid: null,
      actual: null,
    }));
    setPlayers(newPlayers);
    setDeck(shuffled.slice(cardsPerPlayer * players.length));
    setTricksWon(new Array(players.length).fill(0));
    setTrick([]);
    setLeadSuit(null);
    const firstPlayer = (dealerIndex + 1) % players.length;
    setCurrentTurn(firstPlayer);
    setCurrentBidderIndex(firstPlayer); // First bidder is next after dealer
    setCurrentBidInput("");
    setHandsDealt(true);
    setBiddingPhase(false);
    setPlayingPhase(false);
    setRoundOver(false);
  };

  const handleBidSubmit = () => {
    const bid = parseInt(currentBidInput);
    if (isNaN(bid)) return;

    const updatedPlayers = [...players];
    updatedPlayers[currentBidderIndex].bid = bid;
    setPlayers(updatedPlayers);

    const tricks = totalTricks();
    const bidsPlaced = updatedPlayers.filter((p) => p.bid !== null);
    const bidsSoFar = updatedPlayers.map(p => p.bid ?? 0);
    const totalBids = bidsSoFar.reduce((sum, val) => sum + val, 0);

    const firstBidderIndex = (dealerIndex + 1) % players.length;
    const lastBidderIndex = dealerIndex;
    const isLastBidder = currentBidderIndex === lastBidderIndex;


    if (isLastBidder && totalBids < tricks) {
      alert(`Your bid must make the total bids at least equal to ${tricks}. So you must bid at least ${tricks - (totalBids - bid)}.`);
      return;
    }

    if (isLastBidder) {
      setBiddingPhase(false);
      setPlayingPhase(true);
    } else {
      const nextBidder = (currentBidderIndex + 1) % players.length;
      setCurrentBidderIndex(nextBidder);
    }   
    
    setCurrentBidInput("");
};

  return (
    <div className="p-6 space-y-6 text-black bg-gray-100 min-h-screen relative">
      <div className="absolute top-4 right-6 text-right">
        <p className="text-sm font-medium text-gray-700">Trump Suit</p>
        <div className="text-3xl font-bold">{trumpSuit}</div>
      </div>

      <Card>
        <CardContent className="space-y-4 text-black">
          <h1 className="text-2xl font-bold">Kachufool Game Setup</h1>
          <div className="flex items-center gap-4">
            <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Enter player name" />
            <Button onClick={addPlayer} disabled={players.length >= 6}>Add Player</Button>
          </div>
          <div className="flex items-center gap-4">
            <label>Max Cards Per Round:</label>
            <Input
              type="number"
              value={maxCardsPerRound}
              onChange={(e) => setMaxCardsPerRound(Math.min(parseInt(e.target.value) || 1, Math.floor(52 / players.length)))}
              className="w-24"
              disabled={players.length > 0}
            />
          </div>
          <PlayerList players={players} dealerIndex={dealerIndex} />
          <Button onClick={startRound} disabled={players.length < 3 || players.length * totalTricks() > 52}>
            Deal Cards
          </Button>
        </CardContent>
      </Card>

      {handsDealt && !biddingPhase && !playingPhase && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Hands Dealt</h2>
            <p className="mb-2">Review your cards below, then click to begin bidding.</p>
            <GameBoard players={players} />
            <Button className="mt-4" onClick={() => setBiddingPhase(true)}>
              Start Bidding
            </Button>
          </CardContent>
        </Card>
      )}

      {biddingPhase && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Bidding Phase</h2>
            <p className="mt-2">
              <strong>{players[currentBidderIndex].name}</strong>, how many tricks will you win?
            </p>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={currentBidInput}
                min={0}
                max={totalTricks()}
                onChange={(e) => setCurrentBidInput(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleBidSubmit}>Submit Bid</Button>
            </div>
            <GameBoard players={players} />
          </CardContent>
        </Card>
      )}

      {playingPhase && (
        <TrickArea
          players={players}
          trick={trick}
          trumpSuit={trumpSuit}
          leadSuit={leadSuit}
          currentTurn={currentTurn}
          setPlayers={setPlayers}
          setTrick={setTrick}
          setLeadSuit={setLeadSuit}
          setCurrentTurn={setCurrentTurn}
          setTricksWon={setTricksWon}
          tricksWon={tricksWon}
          setPlayingPhase={setPlayingPhase}
          setRound={() => setRoundOver(true)}
        />
      )}

      {roundOver && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold">Round Complete</h2>
            <ul className="mt-2 list-disc list-inside">
              {players.map((p, i) => (
                <li key={i}>
                  {p.name}: Bid {p.bid} | Won {p.actual} | Score {p.score}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4"
              onClick={() => {
                setRound(round + 1);
                setDealerIndex((dealerIndex + 1) % players.length);
                setRoundOver(false);
                startRound();
              }}
            >
              Start Next Round
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}