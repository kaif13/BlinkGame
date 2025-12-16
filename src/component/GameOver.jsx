export default function GameOverPopup({ score, onClose, onRestart }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-xl text-center shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>

        <p className="text-lg mb-4">
          Your Score: <span className="text-cyan-400">{score}</span>
        </p>

        <div className="flex justify-center gap-3">
          {/* <button className="px-4 py-2 bg-red-500 rounded-lg" onClick={onClose}>
            Close
          </button> */}

          <button
            className="px-4 py-2 bg-green-500 rounded-lg"
            onClick={onRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
