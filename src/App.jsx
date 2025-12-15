import { useState, useEffect } from "react";

export default function App() {
  const [mode, setMode] = useState("menu"); // menu | login | signup | game
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [blinkBoxes, setBlinkBoxes] = useState([]);
  const [correctPattern, setCorrectPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [wrongBox, setWrongBox] = useState(null);

  const [canClick, setCanClick] = useState(false);
  const [score, setScore] = useState(0);
  const [lifelines, setLifelines] = useState(3);
  const [highScore, setHighScore] = useState(0);

  const [leaderboard, setLeaderboard] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showLeaderboardMobile, setShowLeaderboardMobile] = useState(false);

  const TOTAL_BOXES = 25;
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzot9el7f0XghGfmBMuvBt3G-p3dbWAGdiDpJ7uD7f-bUo8AL13-U6Ag6LzY19c880I/exec";

  // ⭐ Blink Time Auto Increase
  const getBlinkTime = () => {
    if (score >= 20) return 300;
    if (score >= 15) return 400;
    if (score >= 10) return 600;
    if (score >= 5) return 800;
    return 1000;
  };

  // ⭐ SIGNUP Request
  const handleSignup = async () => {
    if (!username || !userPassword) return alert("Enter name & password!");

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        mode: "signup",
        name: username,
        password: userPassword,
      }),
    });

    const text = await res.text();

    if (text === "USER_EXISTS") return alert("User already exists!");
    if (text === "SIGNUP_SUCCESS") {
      alert("Signup successful!");
      setMode("login");
    }
  };

  // ⭐ LOGIN Request
  const handleLogin = async () => {
    if (!username || !userPassword) return alert("Enter name & password!");

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        mode: "login",
        name: username,
        password: userPassword,
      }),
    });

    const text = await res.text();

    if (text === "NO_USER") return alert("User does not exist!");
    if (text === "WRONG_PASSWORD") return alert("Wrong password!");

    const data = JSON.parse(text);
    setHighScore(data.score);
    setPlayerName(username);
    setMode("game");
  };

  // ⭐ Save Score Online
  const saveScoreOnline = async () => {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        mode: "save",
        name: playerName,
        score: score,
      }),
    });
  };

  // ⭐ Fetch Leaderboard
  const loadLeaderboard = async () => {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    const sorted = data.sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(sorted);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [showPopup]);

  // ⭐ Game Start Logic
  const startGame = () => {
    setScore(0);
    setLifelines(3);
    setShowPopup(false);
    newRound();
  };

  const newRound = () => {
    setSelected([]);
    setWrongBox(null);
    setCanClick(false);

    let count = Math.floor(Math.random() * 3) + 3;
    let arr = [];

    while (arr.length < count) {
      let r = Math.floor(Math.random() * TOTAL_BOXES);
      if (!arr.includes(r)) arr.push(r);
    }

    setBlinkBoxes(arr);
    setCorrectPattern(arr);

    setTimeout(() => {
      setBlinkBoxes([]);
      setCanClick(true);
    }, getBlinkTime());
  };

  const handleClick = (index) => {
    if (!canClick) return;

    if (!correctPattern.includes(index)) {
      setWrongBox(index);

      setTimeout(() => {
        if (lifelines > 1) {
          setLifelines((p) => p - 1);
          newRound();
        } else {
          gameOver();
        }
      }, 500);
      return;
    }

    const updated = [...selected, index];
    setSelected(updated);

    if (updated.length === correctPattern.length) {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore > highScore) setHighScore(newScore);

      newRound();
    }
  };

  const gameOver = () => {
    setCanClick(false);
    saveScoreOnline();
    setShowPopup(true);
  };

  // ⭐ ------------------------ MENU SCREEN ------------------------
  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl mb-8 font-bold">Memory Game</h1>

        <button
          className="px-8 py-3 bg-green-500 rounded mb-4"
          onClick={() => setMode("login")}
        >
          Login
        </button>

        <button
          className="px-8 py-3 bg-blue-500 rounded"
          onClick={() => setMode("signup")}
        >
          Signup
        </button>
      </div>
    );
  }

  // ⭐ ------------------------ LOGIN SCREEN ------------------------
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl mb-4 font-bold">Login</h1>

        <input
          className="px-4 py-2 text-black rounded w-64 mb-2"
          placeholder="Enter Name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-4 py-2 text-black rounded w-64 mb-4"
          placeholder="Enter Password"
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <button
          className="px-6 py-2 bg-green-600 rounded mb-3"
          onClick={handleLogin}
        >
          Login
        </button>

        <button className="text-blue-400" onClick={() => setMode("signup")}>
          Create Account
        </button>
      </div>
    );
  }

  // ⭐ ------------------------ SIGNUP SCREEN ------------------------
  if (mode === "signup") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl mb-4 font-bold">Signup</h1>

        <input
          className="px-4 py-2 text-black rounded w-64 mb-2"
          placeholder="Choose Name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-4 py-2 text-black rounded w-64 mb-4"
          placeholder="Choose Password"
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <button
          className="px-6 py-2 bg-blue-600 rounded mb-3"
          onClick={handleSignup}
        >
          Signup
        </button>

        <button className="text-green-400" onClick={() => setMode("login")}>
          Already have account?
        </button>
      </div>
    );
  }

  // ⭐ ------------------------ GAME SCREEN ------------------------
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative">
      {/* MAIN GAME PANEL */}
      <div className="w-full flex flex-col items-center py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">Memory Booster Game</h1>
        <p className="text-lg mb-4">
          Player: <span className="text-yellow-300">{playerName}</span>
        </p>

        <div className="flex gap-6 text-xl mb-5">
          <p>
            Score: <span className="text-cyan-400">{score}</span>
          </p>
          <p>
            Lifelines: <span className="text-red-400">{lifelines}</span>
          </p>
          <p>
            High Score: <span className="text-green-400">{highScore}</span>
          </p>
        </div>

        <button
          className="px-6 py-2 bg-cyan-600 rounded-lg text-lg mb-6"
          onClick={startGame}
        >
          Start Game
        </button>

        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: TOTAL_BOXES }).map((_, i) => {
            let boxColor = "#334155";

            if (blinkBoxes.includes(i)) boxColor = "#22ff55";
            if (selected.includes(i)) boxColor = "#9ca3af";
            if (wrongBox === i) boxColor = "#ef4444";

            return (
              <div
                key={i}
                onClick={() => handleClick(i)}
                style={{
                  backgroundColor: boxColor,
                  transition: "0.2s",
                }}
                className="w-16 h-16 rounded-xl cursor-pointer hover:scale-95"
              ></div>
            );
          })}
        </div>

        <button
          className="mt-6 md:hidden bg-blue-500 px-5 py-2 rounded"
          onClick={() => setShowLeaderboardMobile(true)}
        >
          Leaderboard
        </button>
      </div>

      {/* DESKTOP LEADERBOARD */}
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

      {/* ⭐ MOBILE LEADERBOARD POPUP (FIXED + WORKING NOW) */}
      {showLeaderboardMobile && (
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
              onClick={() => setShowLeaderboardMobile(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER POPUP */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-slate-800 p-8 rounded-xl text-center shadow-xl w-80">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="text-lg mb-4">
              Your Score: <span className="text-cyan-400">{score}</span>
            </p>

            <button
              className="px-4 py-2 bg-red-500 rounded-lg mr-3"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>

            <button
              className="px-4 py-2 bg-green-500 rounded-lg"
              onClick={startGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full py-4 bg-slate-800 text-center text-gray-300 border-t border-slate-700">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()} • Created with ❤️ by
          <span className="text-cyan-400 font-semibold"> Mohammad Kaif</span>
        </p>
      </footer>
    </div>
  );
}
