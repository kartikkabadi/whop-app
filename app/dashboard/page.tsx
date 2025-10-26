import { Dashboard } from "@/app/components/Dashboard";

export default function DashboardPage() {
  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metrics cards will be added here */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">$0.00</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Active Members</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Content Items</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Growth Rate</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">0%</p>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
