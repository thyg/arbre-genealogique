export default function EditForm({ userData, onSave, onCancel }) {
    // Vous devrez implémenter la logique du formulaire ici
    // avec les états pour chaque champ modifiable
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            onSave(/* données du formulaire */);
          }}>
            {/* Ajoutez ici les champs du formulaire */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input 
                type="text" 
                defaultValue={userData.userName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
  
            {/* Ajoutez d'autres champs selon vos besoins */}
  
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }