export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
      <div className="flex items-center gap-4">
        <span className="text-2xl md:hidden">🏥</span>
        <h2 className="text-sm font-medium text-gray-400">Dashboard</h2>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          Clinic Online
        </span>
      </div>
    </header>
  );
}
