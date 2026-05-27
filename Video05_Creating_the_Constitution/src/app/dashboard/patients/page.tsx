import { db } from "@/db";
import { patients } from "@/db/schema";

export const dynamic = "force-dynamic";

export default function PatientsPage() {
  const allPatients = db.select().from(patients).all();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patients</h1>
          <p className="mt-1 text-sm text-gray-400">
            Registered agents in the clinic.
          </p>
        </div>
        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
          {allPatients.length} registered
        </span>
      </div>

      {allPatients.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-400">
            No patients registered yet. Use{" "}
            <code className="rounded bg-gray-800 px-2 py-0.5 text-emerald-400">
              POST /api/patients
            </code>{" "}
            to register an agent.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 bg-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 font-medium text-gray-400">Species</th>
                <th className="px-4 py-3 font-medium text-gray-400">Model</th>
                <th className="px-4 py-3 font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 font-medium text-gray-400">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {allPatients.map((patient) => (
                <tr key={patient.id} className="bg-gray-950 hover:bg-gray-900">
                  <td className="px-4 py-3 font-medium text-white">
                    {patient.name}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{patient.species}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {patient.modelProvider} / {patient.modelName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        patient.status === "active"
                          ? "bg-emerald-900/50 text-emerald-400"
                          : patient.status === "critical"
                          ? "bg-red-900/50 text-red-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
