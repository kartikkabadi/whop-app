import { Dashboard } from "@/app/components/Dashboard";

export default function RevenuePage() {
  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
            <p className="text-gray-500">Revenue tracking and analytics functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
