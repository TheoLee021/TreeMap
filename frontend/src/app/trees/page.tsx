import Navigation from '@/components/Navigation';

export default function TreesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-xl font-semibold text-gray-900">Trees List</h1>
          </div>
          <div className="border-t border-gray-200">
            {/* Tree list component will be added here */}
            <div className="p-4">
              <p className="text-gray-500">Tree list will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 