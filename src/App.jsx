import { useState, useEffect } from "react";
import Footer from "../src/component/Footer";
import GameOver from "./component/GameOver";
import Instructions from "./component/Instructions";
import Leaderboard from "./component/Leaderboard";
import MainGame from "./component/MainGame";
import Menu from "./component/Menu";

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
      <Menu
        onLogin={() => setMode("login")}
        onSignup={() => setMode("signup")}
        onInstructions={() => setShowInstructions(true)}
      />
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
      <MainGame
        playerName={playerName}
        score={score}
        lifelines={lifelines}
        highScore={highScore}
        startGame={startGame}
        setShowInstructions={setShowInstructions}
        setShowLeaderboardMobile={setShowLeaderboardMobile}
        TOTAL_BOXES={TOTAL_BOXES}
        blinkBoxes={blinkBoxes}
        selected={selected}
        wrongBox={wrongBox}
        handleClick={handleClick}
      />

      {/* DESKTOP & Mobile LEADERBOARD PANEL */}
      <Leaderboard
        leaderboard={leaderboard}
        showMobile={showLeaderboardMobile}
        onCloseMobile={() => setShowLeaderboardMobile(false)}
      />

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
