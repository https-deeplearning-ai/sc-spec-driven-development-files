const stats = [
  { label: "Registered Patients", value: "—", icon: "🤖" },
  { label: "Active Visits", value: "—", icon: "📋" },
  { label: "Known Ailments", value: "—", icon: "🦠" },
  { label: "Treatments Given", value: "—", icon: "💊" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Clinic Overview</h1>
        <p className="mt-1 text-sm text-gray-400">
          Monitor agent health across your fleet.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white">Recent Visits</h3>
          <p className="mt-4 text-sm text-gray-500">
            No visits recorded yet. Submit a visit via the API to get started.
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white">Ailment Trends</h3>
          <p className="mt-4 text-sm text-gray-500">
            Ailment frequency data will appear here once visits are processed.
          </p>
        </div>
      </div>
    </div>
  );
}
