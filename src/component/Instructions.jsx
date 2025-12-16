export default function Instructions({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-80 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>

        <ul className="text-gray-300 text-left space-y-2 mb-4">
          <li>1️⃣ Tap "Start Game" to begin.</li>
          <li>2️⃣ Some boxes will blink for a moment.</li>
          <li>3️⃣ Memorize all blinking boxes.</li>
          <li>4️⃣ After blinking stops, tap the same boxes.</li>
          <li>5️⃣ Correct selection → Score +1</li>
          <li>6️⃣ Wrong selection → Lose 1 lifeline</li>
          <li>7️⃣ When lifelines reach 0 → Game Over</li>
          <li>8️⃣ Your high score is saved automatically.</li>
        </ul>

        <button
          className="bg-red-500 px-4 py-2 rounded w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
