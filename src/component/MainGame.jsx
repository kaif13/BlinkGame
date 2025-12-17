const MainGame = ({
  playerName,
  score,
  lifelines,
  highScore,
  startGame,
  setShowInstructions,
  setShowLeaderboardMobile,
  TOTAL_BOXES,
  blinkBoxes,
  selected,
  wrongBox,
  handleClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-2">Memory Booster Game</h1>

      <p className="text-lg mb-4">
        Player: <span className="text-yellow-300">{playerName || "Guest"}</span>
      </p>

      <div className="flex gap-6 text-xl mb-6">
        <p>
          Score: <span className="text-cyan-400">{score ?? 0}</span>
        </p>
        <p>
          Lifelines: <span className="text-red-400">{lifelines ?? 0}</span>
        </p>
        <p>
          High Score: <span className="text-green-400">{highScore ?? 0}</span>
        </p>
      </div>

      {/* 🔹 DESKTOP BUTTONS */}
      <div className="hidden md:flex gap-3 mb-6">
        <button
          className="px-6 py-2 bg-cyan-600 rounded-lg text-lg"
          onClick={startGame}
        >
          Start Game
        </button>

        <button
          className="px-6 py-2 bg-gray-700 rounded-lg text-lg"
          onClick={() => setShowInstructions(true)}
        >
          Instructions
        </button>
      </div>

      {/* 🔹 MOBILE BUTTONS */}
      <div className="flex md:hidden gap-3 mb-4 justify-center">
        <button
          className="bg-cyan-600 px-4 py-2 rounded text-sm"
          onClick={startGame}
        >
          Start Game
        </button>

        <button
          className="bg-blue-600 px-4 py-2 rounded text-sm"
          onClick={() => setShowLeaderboardMobile(true)}
        >
          Leaderboard
        </button>
      </div>

      {/* 🔹 GAME GRID */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: TOTAL_BOXES }).map((_, i) => {
          let boxColor = "#334155";
          if (blinkBoxes.includes(i)) boxColor = "#22ff55";
          if (selected.includes(i)) boxColor = "#9ca3af";
          if (wrongBox === i) boxColor = "#ef4444";

          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              style={{ backgroundColor: boxColor, transition: "0.2s" }}
              className="w-16 h-16 rounded-xl cursor-pointer hover:scale-95"
            />
          );
        })}
      </div>

      {/* 🔹 MOBILE INSTRUCTIONS BUTTON */}
      <button
        className="md:hidden bg-gray-700 px-4 py-2 rounded text-sm mb-4"
        onClick={() => setShowInstructions(true)}
      >
        Instructions
      </button>
    </div>
  );
};

export default MainGame;
