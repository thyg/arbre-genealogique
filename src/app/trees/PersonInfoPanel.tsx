import { FaEdit, FaLink } from 'react-icons/fa';

export default function PersonInfoPanel({ selectedNode, onEditClick, onCreateLinkClick, isSelf }) {
  return (
    <div className="absolute right-4 top-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-md ${selectedNode.profileImage ? '' : selectedNode.gender === 'male' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'}`}>
          {selectedNode.profileImage ? (
            <img src={selectedNode.profileImage} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <FaUser className={`h-6 w-6 ${selectedNode.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{selectedNode.name || 'Inconnu'}</h3>
          <p className="text-xs text-gray-500">
            {isSelf ? 'Moi' : 
             selectedNode.relationship === 'parent' ? (selectedNode.gender === 'male' ? 'Père' : 'Mère') :
             selectedNode.relationship === 'child' ? 'Enfant' :
             selectedNode.relationship === 'partner' ? 'Conjoint(e)' : ''}
          </p>
        </div>
      </div>
      
      {/* Person details */}
      <div className="space-y-2 text-sm mb-4">
        <div>
          <span className="text-gray-600">Genre:</span> {selectedNode.gender === 'male' ? 'Masculin' : 'Féminin'}
        </div>
        
        {selectedNode.birthDate && (
          <div>
            <span className="text-gray-600">Naissance:</span> {selectedNode.birthDate}
          </div>
        )}
        
        {selectedNode.birthPlace && (
          <div>
            <span className="text-gray-600">Lieu:</span> {selectedNode.birthPlace}
          </div>
        )}
        
        <div>
          <span className="text-gray-600">Relations:</span> {' '}
          {selectedNode.parents.length} parent(s), {' '}
          {selectedNode.children.length} enfant(s), {' '}
          {selectedNode.partners.length} conjoint(s)
          {selectedNode.specialRelations?.length > 0 && (
            <>, {selectedNode.specialRelations.length} relation(s) spéciale(s)</>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        {isSelf ? (
          <button 
            onClick={onEditClick}
            className="flex items-center space-x-1 px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            <FaEdit />
            <span>Modifier</span>
          </button>
        ) : (
          <div></div>
        )}
        
        <button 
          onClick={onCreateLinkClick}
          className="flex items-center space-x-1 px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
        >
          <FaLink />
          <span>Lier</span>
        </button>
      </div>
    </div>
  );
}