'use client';
import { FaUser, FaCamera } from 'react-icons/fa';
import { useUserContext } from '@/app/tree/UserContext';

export default function ProfileSection() {
  const { userData } = useUserContext();

  return (
    <div className="p-6 border-b">
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-inner transition-all duration-300 group-hover:shadow-md">
            {userData.profileImage ? (
              <img 
                src={userData.profileImage} 
                alt="Profile" 
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <FaUser className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-all">
            <FaCamera className="h-3 w-3 text-gray-500" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-800">{userData.userName}</h2>
          <div className="flex items-center mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              C'est vous
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {userData.birthDate} {userData.birthDate && userData.birthPlace ? '• ' : ''} {userData.birthPlace}
          </p>
        </div>
      </div>
      <div className="mt-4 text-sm text-orange-500 hover:text-orange-700 cursor-pointer flex items-center font-medium">
        <span>Rechercher cette personne</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}