// const BASE_URL = '/api';

// // Fetch person by ID
// export const getPersonById = async (id) => {
//   const response = await fetch(`${BASE_URL}/persons/${id}`);
//   return await response.json();
// };

// // Update person
// export const updatePerson = async (id, data) => {
//   const response = await fetch(`${BASE_URL}/persons/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   return await response.json();
// };

// // Create family link
// export const createFamilyLink = async (data) => {
//   const response = await fetch(`${BASE_URL}/family-link`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   return await response.json();
// };

// // Get all persons in a family tree
// export const getPersonsByTreeId = async (treeId) => {
//   const response = await fetch(`${BASE_URL}/persons/family-tree/${treeId}`);
//   return await response.json();
// };

// // Update family link
// export const updateFamilyLink = async (linkId, data) => {
//   const response = await fetch(`${BASE_URL}/family-link/${linkId}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   return await response.json();
// };

// // Delete family link
// export const deleteFamilyLink = async (linkId) => {
//   const response = await fetch(`${BASE_URL}/family-link/${linkId}`, {
//     method: 'DELETE',
//   });
//   return await response.json();
// };

// // Delete family tree
// export const deleteFamilyTree = async (treeId) => {
//   const response = await fetch(`${BASE_URL}/family-trees/${treeId}`, {
//     method: 'DELETE',
//   });
//   return await response.json();
// };














const BASE_URL = '/api';

// Helper function to handle fetch and JSON parsing
const handleFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Improved error handling: include status text in error message
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Log the error for debugging
    console.error('Fetch error:', error);
    // Re-throw the error to be caught by the caller
    throw error;
  }
};

// Fetch person by ID
export const getPersonById = async (id) => {
  return handleFetch(`${BASE_URL}/persons/${id}`);
};

// Update person
export const updatePerson = async (id, data) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return handleFetch(`${BASE_URL}/persons/${id}`, options);
};

// Create family link
export const createFamilyLink = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/family-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Détails de l\'erreur:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la création du lien');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur complète:', error);
    throw error;
  }
};

// Update family link
export const updateFamilyLink = async (linkId, data) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return handleFetch(`${BASE_URL}/family-link/${linkId}`, options);
};

// Delete family link
export const deleteFamilyLink = async (linkId) => {
  const options = {
    method: 'DELETE',
  };
  return handleFetch(`${BASE_URL}/family-link/${linkId}`, options);
};

// Delete family tree
export const deleteFamilyTree = async (treeId) => {
  const options = {
    method: 'DELETE',
  };
  return handleFetch(`${BASE_URL}/family-trees/${treeId}`, options);
};


































