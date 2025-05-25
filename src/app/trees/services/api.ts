// services/api.ts
import { Person, FamilyLink, APIResponse } from '../types/familyTree';

const API_BASE_URL = 'http://localhost:8030/api';

export const personService = {
  getPersonById: async (id: number): Promise<APIResponse<Person>> => {
    const response = await fetch(`${API_BASE_URL}/persons/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch person data');
    }
    return response.json();
  },

  updatePerson: async (id: number, data: Partial<Person>): Promise<APIResponse<Person>> => {
    const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update person data');
    }
    return response.json();
  },

  getPersonsByFamilyTree: async (treeId: number): Promise<APIResponse<Person[]>> => {
    const response = await fetch(`${API_BASE_URL}/persons/family-tree/${treeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch family tree persons');
    }
    return response.json();
  }
};

export const familyLinkService = {
  createLink: async (linkData: FamilyLink): Promise<APIResponse<FamilyLink>> => {
    const response = await fetch(`${API_BASE_URL}/family-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkData),
    });
    if (!response.ok) {
      throw new Error('Failed to create family link');
    }
    return response.json();
  },

  updateLink: async (id: number, data: Partial<FamilyLink>): Promise<APIResponse<FamilyLink>> => {
    const response = await fetch(`${API_BASE_URL}/family-link/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update family link');
    }
    return response.json();
  },

  deleteLink: async (id: number): Promise<APIResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/family-link/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete family link');
    }
    return response.json();
  }
};

export const familyTreeService = {
  deleteTree: async (id: number): Promise<APIResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/family-trees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete family tree');
    }
    return response.json();
  }
};