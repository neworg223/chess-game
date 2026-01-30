"use client";

import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("White to move");

  function makeAMove(move: any) {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setMoveHistory([...moveHistory, result.san]);
        updateStatus();
        return result;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen for simplicity
    });

    if (move === null) return false;
    return true;
  }

  function updateStatus() {
    if (game.isCheckmate()) {
      setStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
    } else if (game.isDraw()) {
      setStatus("Draw!");
    } else if (game.isCheck()) {
      setStatus(`Check! ${game.turn() === "w" ? "White" : "Black"} to move.`);
    } else {
      setStatus(`${game.turn() === "w" ? "White" : "Black"} to move`);
    }
  }

  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setStatus("White to move");
  }

  function undoMove() {
    game.undo();
    setGame(new Chess(game.fen()));
    setMoveHistory(moveHistory.slice(0, -1));
    updateStatus();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Board Container */}
        <div className="w-full max-w-[500px] aspect-square shadow-2xl rounded-lg overflow-hidden border border-neutral-800">
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop}
            boardOrientation="white"
            customDarkSquareStyle={{ backgroundColor: "#262626" }}
            customLightSquareStyle={{ backgroundColor: "#404040" }}
          />
        </div>

        {/* Info & Controls */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-xl">
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Chess Game</h1>
            <p className="text-neutral-400 text-sm mb-6">Built with Next.js & Chess.js</p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${game.turn() === "w" ? "bg-white" : "bg-neutral-600"} border border-neutral-700`} />
              <span className="font-medium text-lg">{status}</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={resetGame}
                className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-950 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={undoMove}
                disabled={moveHistory.length === 0}
                className="flex-1 py-2 px-4 bg-neutral-800 text-neutral-100 rounded-lg font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-xl max-h-[250px] flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Move History</h2>
            <div className="overflow-y-auto flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-mono">
              {moveHistory.map((move, idx) => (
                <div key={idx} className="flex gap-2 text-neutral-400">
                  <span className="text-neutral-600 w-6">{Math.floor(idx / 2) + 1}.</span>
                  <span className="text-neutral-200">{move}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
