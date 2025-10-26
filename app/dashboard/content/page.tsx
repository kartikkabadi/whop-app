import { Dashboard } from "@/app/components/Dashboard";

export default function ContentPage() {
  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Content</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Library</h2>
            <p className="text-gray-500">Content management functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
