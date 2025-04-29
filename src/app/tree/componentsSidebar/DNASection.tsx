'use client';

export default function DNASection() {
  return (
    <div className="p-6 border-t">
      <button className="block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all bg-white">
        Faire un test ADN
      </button>
      <button className="mt-3 block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all bg-white">
        Importer des données ADN
      </button>
    </div>
  );
}