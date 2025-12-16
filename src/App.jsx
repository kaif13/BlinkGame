import { useState, useEffect } from "react";
import Footer from "../src/component/Footer";
import GameOver from "./component/GameOver";
import Instructions from "./component/Instructions";

export default function App() {
  const [mode, setMode] = useState("menu");
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

  const [showInstructions, setShowInstructions] = useState(false);
  const [loading, setLoading] = useState(false);

  const [floatText, setFloatText] = useState(null);

  const TOTAL_BOXES = 25;
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwMVYxiRa_O2fLmn__aU1Qj8BMMVmLpj7I5L_qho66UygmbMAk1wGNPzuyrUOhzGbox/exec";

  const getBlinkTime = () => {
    if (score >= 20) return 300;
    if (score >= 15) return 400;
    if (score >= 10) return 600;
    if (score >= 5) return 800;
    return 1000;
  };

  const handleSignup = async () => {
    if (!username || !userPassword) return alert("Enter name & password!");
    setLoading(true);

    setTimeout(async () => {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          mode: "signup",
          name: username,
          password: userPassword,
        }),
      });

      const text = await res.text();
      setLoading(false);

      if (text === "USER_EXISTS") return alert("User already exists!");
      if (text === "SIGNUP_SUCCESS") {
        alert("Signup successful!");
        setMode("login");
      }
    }, 3000);
  };

  const handleLogin = async () => {
    if (!username || !userPassword) return alert("Enter name & password!");
    setLoading(true);

    setTimeout(async () => {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          mode: "login",
          name: String(username),
          password: String(userPassword),
        }),
      });

      const text = await res.text();
      setLoading(false);

      if (text === "NO_USER") return alert("User does not exist!");
      if (text === "WRONG_PASSWORD") return alert("Wrong password!");

      const data = JSON.parse(text);
      setHighScore(data.score);
      setPlayerName(username);
      setMode("game");
    }, 3000);
  };

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

  const loadLeaderboard = async () => {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    const sorted = data.sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(sorted);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [showPopup]);

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
      setFloatText({ text: "-1", color: "text-red-500" });
      setTimeout(() => setFloatText(null), 2000);

      setTimeout(() => {
        if (lifelines > 1) {
          setLifelines((p) => p - 1);
          newRound();
        } else gameOver();
      }, 500);

      return;
    }

    const updated = [...selected, index];
    setSelected(updated);

    if (updated.length === correctPattern.length) {
      const newScore = score + 1;
      setScore(newScore);

      setFloatText({ text: "+1", color: "text-green-400" });
      setTimeout(() => setFloatText(null), 2000);

      if (newScore > highScore) setHighScore(newScore);

      // ⭐ next green blink se pehle 0.2 sec ka pause
      setTimeout(() => {
        newRound();
      }, 200);
    }
  };

  const gameOver = () => {
    setCanClick(false);
    saveScoreOnline();
    setShowPopup(true);
  };

  // ---------------- MENU ----------------
  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

        <button
          className="px-8 py-3 bg-green-500 rounded mb-3"
          onClick={() => setMode("login")}
        >
          Login
        </button>

        <button
          className="px-8 py-3 bg-blue-500 rounded mb-3"
          onClick={() => setMode("signup")}
        >
          Signup
        </button>

        <button
          className="px-8 py-2 bg-gray-700 rounded"
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
      </div>
    );
  }

  // ---------------- LOGIN ----------------
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>

        <input
          className="px-4 py-2 w-64 rounded text-black mb-2"
          placeholder="Enter Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="px-4 py-2 w-64 rounded text-black mb-4"
          placeholder="Enter Password"
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <button
          className="px-6 py-2 bg-green-600 rounded mb-3"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Processing..." : "Login"}
        </button>

        <button className="text-blue-400" onClick={() => setMode("signup")}>
          Create Account
        </button>
      </div>
    );
  }

  // ---------------- SIGNUP ----------------
  if (mode === "signup") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Signup</h1>

        <input
          className="px-4 py-2 w-64 rounded text-black mb-2"
          placeholder="Choose Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="px-4 py-2 w-64 rounded text-black mb-4"
          placeholder="Choose Password"
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <button
          className="px-6 py-2 bg-blue-600 rounded mb-3"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Processing..." : "Signup"}
        </button>

        <button className="text-green-400" onClick={() => setMode("login")}>
          Already have account?
        </button>
      </div>
    );
  }

  // ---------------- GAME SCREEN ----------------
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative">
      {/* FLOAT TEXT */}
      {floatText && (
        <div
          className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 
                         text-6xl font-bold ${floatText.color} animate-float`}
        >
          {floatText.text}
        </div>
      )}

      {/* MAIN GAME */}
      <div className="w-full flex flex-col items-center py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">Memory Booster Game</h1>

        <p className="text-lg mb-4">
          Player: <span className="text-yellow-300">{playerName}</span>
        </p>

        <div className="flex gap-6 text-xl mb-6">
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

        {/* DESKTOP BUTTONS */}
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

        {/* ⭐ MOBILE: SMALL BUTTONS SIDE BY SIDE */}
        {/* ⭐ MOBILE BUTTONS — Compact Centered Buttons */}
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

        {/* GRID */}
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
              ></div>
            );
          })}
        </div>

        {/* ⭐ MOBILE Instructions BELOW GRID */}
        <button
          className="md:hidden bg-gray-700 px-4 py-2 rounded text-sm mb-4"
          onClick={() => setShowInstructions(true)}
        >
          Instructions
        </button>
      </div>

      {/* DESKTOP LEADERBOARD PANEL */}
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

      {/* MOBILE LEADERBOARD POPUP */}
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

      {/* INSTRUCTIONS POPUP */}

      <button onClick={() => setShowInstructions(true)}></button>
      {showInstructions && (
        <Instructions onClose={() => setShowInstructions(false)} />
      )}

      {/* GAME OVER POPUP */}
      {showPopup && (
        <GameOver
          score={score}
          onClose={() => setShowPopup(false)}
          onRestart={startGame}
        />
      )}
      <Footer />
    </div>
  );
}
