import { FaPlus, FaUser, FaEdit } from 'react-icons/fa';

export default function FamilyGraph({ userData, handleEditClick }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-center mb-8 space-x-16">
          <div className="flex flex-col items-center">
            <button className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaPlus className="text-gray-400" />
              <span className="ml-2 text-sm text-gray-600 font-medium">Père</span>
            </button>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-40 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaPlus className="text-gray-400" />
              <span className="ml-2 text-sm text-gray-600 font-medium">Mère</span>
            </button>
          </div>
        </div>
        
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
        
        <div className="border-2 border-blue-400 rounded-xl p-3 bg-white shadow-lg w-72 transition-all duration-200 hover:shadow-xl hover:border-blue-500">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{userData.userName}</div>
              <div className="text-xs text-gray-500">{userData.birthDate}</div>
            </div>
            <button 
              onClick={handleEditClick}
              className="ml-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
            >
              <FaEdit className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
        <div className="mt-0">
          <button className="py-2 px-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center">
            <FaPlus className="mr-0" />
          </button>
        </div>
      </div>
      
      <div className="absolute right-4 bottom-4 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}