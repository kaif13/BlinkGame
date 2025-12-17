const Leaderboard = ({ leaderboard, showMobile, onCloseMobile }) => {
  return (
    <>
      {/* 🔹 Desktop Leaderboard */}
      <div className="hidden md:block w-80 bg-slate-800 p-5 border-l border-slate-700 absolute right-0 top-0 bottom-0">
        <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>

        <ul>
          {leaderboard.map((item, index) => (
            <li
              key={index}
              className="mb-3 p-2 bg-slate-700 rounded flex justify-between"
            >
              <p className="font-bold">
                #{index + 1} — {item.name}
              </p>
              <p>{item.score}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Mobile Leaderboard (Modal) */}
      {showMobile && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center md:hidden z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-72">
            <h3 className="text-2xl font-bold mb-4 text-center">
              🏆 Leaderboard
            </h3>

            <ul>
              {leaderboard.map((item, index) => (
                <li
                  key={index}
                  className="mb-3 p-2 bg-slate-700 rounded flex justify-between"
                >
                  <p className="font-bold">
                    #{index + 1} — {item.name}
                  </p>
                  <p>{item.score}</p>
                </li>
              ))}
            </ul>

            <button
              className="mt-4 bg-red-500 px-4 py-2 rounded w-full"
              onClick={onCloseMobile}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
