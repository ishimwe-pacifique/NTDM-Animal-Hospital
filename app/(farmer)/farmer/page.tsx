"use client";

export default function FarmerDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Farmer Dashboard</h1>
      <p className="mb-8">Welcome to the farmer dashboard! Here you can manage your animals, consultations, and more.</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700">12</span>
          <span className="text-gray-600 mt-2">Animals Registered</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700">3</span>
          <span className="text-gray-600 mt-2">Upcoming Consultations</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700">5</span>
          <span className="text-gray-600 mt-2">Pending Requests</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button className="bg-green-700 text-white px-6 py-3 rounded shadow hover:bg-green-800 transition">
          Register New Animal
        </button>
        <button className="bg-yellow-500 text-white px-6 py-3 rounded shadow hover:bg-yellow-600 transition">
          Book Consultation
        </button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
          View Reports
        </button>
      </div>

      {/* Placeholder for future widgets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul className="text-gray-700 list-disc pl-5 space-y-1">
          <li>Animal "Bella" registered on 2025-06-01</li>
          <li>Consultation booked with Dr. Smith for "Max"</li>
          <li>Request for vaccination submitted</li>
        </ul>
      </div>
    </div>
  );
}