'use client';

export default function DiscoverySection() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Découvertes</h3>
      </div>
      <div className="bg-blue-50 rounded-lg p-3 flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">i</span>
        </div>
        <div>
          <p className="text-sm text-blue-700">Une incohérence a été détectée dans votre arbre généalogique</p>
          <p className="text-xs text-blue-500 mt-1">Cliquez pour en savoir plus</p>
        </div>
      </div>
    </div>
  );
}