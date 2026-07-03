import Link from "next/link";

export default function DepartmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ravenshaw-800 mb-8">All Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Link key={i} href={`/departments/statistics`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
            <h3 className="font-bold text-lg">Department {i}</h3>
            <p className="text-sm text-gray-500">Click to view details</p>
          </Link>
        ))}
      </div>
    </div>
  );
}