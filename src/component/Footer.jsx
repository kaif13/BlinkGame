export default function Footer() {
  return (
    <footer className="w-full py-4 bg-slate-800 text-center text-gray-300 border-t border-slate-700">
      <p className="text-sm tracking-wide">
        © {new Date().getFullYear()} • Created with ❤️ by
        <span className="text-cyan-400 font-semibold"> Mohammad Kaif</span>
      </p>
    </footer>
  );
}
