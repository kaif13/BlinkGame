const Menu = ({ onLogin, onSignup, onInstructions }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      <button className="px-8 py-3 bg-green-500 rounded mb-3" onClick={onLogin}>
        Login
      </button>

      <button className="px-8 py-3 bg-blue-500 rounded mb-3" onClick={onSignup}>
        Signup
      </button>

      {/* <button
        className="px-8 py-2 bg-gray-700 rounded"
        onClick={onInstructions}
      >
        How to Play
      </button> */}
    </div>
  );
};

export default Menu;
