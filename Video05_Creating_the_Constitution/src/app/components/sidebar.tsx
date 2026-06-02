const navItems = [
  { label: "Overview", href: "/dashboard", icon: "🏠" },
  { label: "Patients", href: "/dashboard/patients", icon: "🤖" },
  { label: "Ailments", href: "/dashboard/ailments", icon: "🦠" },
  { label: "Visits", href: "/dashboard/visits", icon: "📋" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "📊" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-gray-800 bg-gray-900 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <span className="text-2xl">🏥</span>
        <span className="text-lg font-semibold text-white">AgentClinic</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
