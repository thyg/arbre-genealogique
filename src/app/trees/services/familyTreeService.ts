import { api } from './api';

export const FamilyTreeService = {
  getFamilyTree: async (treeId: number) => {
    return api.get(`/family-trees/${treeId}`);
  },

  createFamilyTree: async (data: { name: string }) => {
    return api.post('/family-trees', data);
  },

  updateFamilyTree: async (treeId: number, data: { name: string }) => {
    return api.patch(`/family-trees/${treeId}`, data);
  },

  deleteFamilyTree: async (treeId: number) => {
    return api.delete(`/family-trees/${treeId}`);
  },

  getPersonsByTree: async (treeId: number) => {
    return api.get(`/persons/family-tree/${treeId}`);
  }
};