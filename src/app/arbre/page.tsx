'use client';

import { useState, useEffect } from 'react';
import {
  FaUser,
  FaPen,
  FaPlus,
  FaEllipsisH,
  FaSearch
} from 'react-icons/fa';
import TreeViewer, {
  Member,
  Tree as TreeType
} from '@/components/TreeViewer';

// Helpers pour manipuler l’arbre
function findMemberById(list: Member[], id: number): Member | null {
  for (const m of list) {
    if (m.id === id) return m;
    if (m.children) {
      const found = findMemberById(m.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateMember(member: Member, updated: Member): Member {
  if (member.id === updated.id) {
    return { ...member, ...updated };
  }
  return {
    ...member,
    children: member.children
      ?.map(c => updateMember(c, updated))
      .filter(c => !!c) as Member[]
  };
}

function addChild(
  member: Member,
  parentId: number,
  child: Member
): Member {
  if (member.id === parentId) {
    const children = member.children ? [...member.children, child] : [child];
    return { ...member, children };
  }
  return {
    ...member,
    children: member.children
      ?.map(c => addChild(c, parentId, child))
      .filter(c => !!c) as Member[]
  };
}

function removeMember(member: Member, id: number): Member | null {
  if (member.id === id) return null;
  const children = member.children
    ?.map(c => removeMember(c, id))
    .filter((c): c is Member => c !== null) || [];
  return { ...member, children };
}

export default function FamilyTreePage() {
  // États principaux
  const [tree, setTree] = useState<TreeType | null>(null);
  const [selected, setSelected] = useState<Member | null>(null);

  // Formulaire création initiale
  const [memberName, setMemberName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  // Modes
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Formulaire édition
  const [editName, setEditName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editSex, setEditSex] = useState('');
  const [editBirthPlace, setEditBirthPlace] = useState('');

  // Formulaire ajout
  const [newName, setNewName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newSex, setNewSex] = useState('');
  const [newBirthPlace, setNewBirthPlace] = useState('');

  // Charger
  useEffect(() => {
    const saved = localStorage.getItem('familyTree');
    if (saved) {
      const t: TreeType = JSON.parse(saved);
      setTree(t);
      setSelected(t.members[0] || null);
    }
  }, []);

  // Sauvegarde
  function save(t: TreeType) {
    localStorage.setItem('familyTree', JSON.stringify(t));
    setTree(t);
    setSelected(t.members[0] || null);
  }

  // Création initiale
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const root: Member = {
      id: Date.now(),
      name: memberName,
      birthDate,
      sex,
      birthPlace,
      children: []
    };
    save({ members: [root] });
  }

  // Actions panneau
  function handleProfileClick() {
    setIsEditing(false);
    setIsAdding(false);
    setShowMore(false);
  }
  function handleEditClick() {
    if (!selected) return;
    setEditName(selected.name);
    setEditBirthDate(selected.birthDate ?? '');
    setEditSex(selected.sex ?? '');
    setEditBirthPlace(selected.birthPlace ?? '');
    setIsEditing(true);
    setIsAdding(false);
    setShowMore(false);
  }
  function handleAddClick() {
    setNewName('');
    setNewBirthDate('');
    setNewSex('');
    setNewBirthPlace('');
    setIsAdding(true);
    setIsEditing(false);
    setShowMore(false);
  }
  function handleMoreClick() {
    setShowMore(prev => !prev);
    setIsEditing(false);
    setIsAdding(false);
  }
  function handleDeleteClick() {
    if (!tree || !selected) return;
    const root = tree.members[0];
    if (root.id === selected.id) {
      localStorage.removeItem('familyTree');
      setTree(null);
      setSelected(null);
    } else {
      const newRoot = removeMember(root, selected.id);
      if (newRoot) save({ members: [newRoot] });
    }
    setShowMore(false);
  }
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!tree || !selected) return;
    const updated: Member = {
      ...selected,
      name: editName,
      birthDate: editBirthDate,
      sex: editSex,
      birthPlace: editBirthPlace
    };
    const newRoot = updateMember(tree.members[0], updated);
    save({ members: [newRoot] });
    setIsEditing(false);
  }
  function handleSaveAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!tree || !selected) return;
    const child: Member = {
      id: Date.now(),
      name: newName,
      birthDate: newBirthDate,
      sex: newSex,
      birthPlace: newBirthPlace,
      children: []
    };
    const newRoot = addChild(tree.members[0], selected.id, child);
    save({ members: [newRoot] });
    setIsAdding(false);
  }

  // Formulaire création
  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleCreate}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4">
            Créer votre arbre familial
          </h1>
          <label htmlFor="memberNameInit" className="block mb-1">
            Nom complet
          </label>
          <input
            id="memberNameInit"
            type="text"
            placeholder="Nom complet"
            aria-label="Nom complet du membre"
            className="w-full border p-2 rounded mb-4"
            value={memberName}
            onChange={e => setMemberName(e.target.value)}
            required
          />
          {/* Date, Sexe, Lieu with labels */}
          <label htmlFor="birthDateInit" className="block mb-1">
            Date de naissance
          </label>
          <input
            id="birthDateInit"
            type="date"
            aria-label="Date de naissance"
            className="w-full border p-2 rounded mb-4"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            required
          />
          <label htmlFor="sexInit" className="block mb-1">
            Sexe
          </label>
          <select
            id="sexInit"
            aria-label="Sexe"
            className="w-full border p-2 rounded mb-4"
            value={sex}
            onChange={e => setSex(e.target.value)}
            required
          >
            <option value="">Sélectionner</option>
            <option>Homme</option>
            <option>Femme</option>
          </select>
          <label htmlFor="birthPlaceInit" className="block mb-1">
            Lieu de naissance
          </label>
          <input
            id="birthPlaceInit"
            type="text"
            placeholder="Lieu de naissance"
            aria-label="Lieu de naissance"
            className="w-full border p-2 rounded mb-6"
            value={birthPlace}
            onChange={e => setBirthPlace(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Créer mon arbre
          </button>
        </form>
      </div>
    );
  }

  // Page principale
  return (
    <div className="h-screen flex bg-gray-100">
      <aside className="w-72 bg-white p-6 space-y-6 shadow-md overflow-auto">
        {selected && !isEditing && !isAdding && (
          <>
            {/* Profil basique */}
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <FaUser className="text-gray-400 text-3xl" />
              </div>
              <h2 className="text-lg font-bold capitalize">
                {selected.name}
              </h2>
              <p className="text-sm text-gray-600">
                {selected.birthDate} • {selected.sex}
              </p>
            </div>

            {/* Boutons : Profil, Modifier, Ajouter, Plus */}
            <div className="flex justify-around mt-4">
              <button
                onClick={handleProfileClick}
                aria-label="Profil"
                title="Profil"
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <FaUser />
                <span className="text-xs mt-1">Profil</span>
              </button>

              <button
                onClick={handleEditClick}
                aria-label="Modifier"
                title="Modifier"
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <FaPen />
                <span className="text-xs mt-1">Modifier</span>
              </button>

              <button
                onClick={handleAddClick}
                aria-label="Ajouter"
                title="Ajouter"
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <FaPlus />
                <span className="text-xs mt-1">Ajouter</span>
              </button>

              <div className="relative">
                <button
                  onClick={handleMoreClick}
                  aria-label="Plus"
                  title="Plus"
                  className="flex flex-col items-center text-gray-600 hover:text-gray-900"
                >
                  <FaEllipsisH />
                  <span className="text-xs mt-1">Plus</span>
                </button>
                {showMore && (
                  <div className="absolute top-8 right-0 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={handleDeleteClick}
                      aria-label="Supprimer le membre"
                      title="Supprimer le membre"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Supprimer le membre
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Formulaire Édition */}
        {isEditing && selected && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <h3 className="font-semibold">Modifier {selected.name}</h3>

            <label htmlFor="editName" className="block mb-1">Nom complet</label>
            <input
              id="editName"
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Nom complet"
              aria-label="Nom complet"
              className="w-full border p-2 rounded"
              required
            />

            <label htmlFor="editBirthDate" className="block mb-1">Date de naissance</label>
            <input
              id="editBirthDate"
              type="date"
              value={editBirthDate}
              onChange={e => setEditBirthDate(e.target.value)}
              aria-label="Date de naissance"
              className="w-full border p-2 rounded"
              required
            />

            <label htmlFor="editSex" className="block mb-1">Sexe</label>
            <select
              id="editSex"
              value={editSex}
              onChange={e => setEditSex(e.target.value)}
              aria-label="Sexe"
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Sexe</option>
              <option>Homme</option>
              <option>Femme</option>
            </select>

            <label htmlFor="editBirthPlace" className="block mb-1">Lieu de naissance</label>
            <input
              id="editBirthPlace"
              type="text"
              value={editBirthPlace}
              onChange={e => setEditBirthPlace(e.target.value)}
              placeholder="Lieu de naissance"
              aria-label="Lieu de naissance"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-100"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Formulaire Ajout */}
        {isAdding && (
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <h3 className="font-semibold">Ajouter un membre</h3>

            <label htmlFor="newName" className="block mb-1">Nom complet</label>
            <input
              id="newName"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nom complet"
              aria-label="Nom complet"
              className="w-full border p-2 rounded"
              required
            />

            <label htmlFor="newBirthDate" className="block mb-1">Date de naissance</label>
            <input
              id="newBirthDate"
              type="date"
              value={newBirthDate}
              onChange={e => setNewBirthDate(e.target.value)}
              aria-label="Date de naissance"
              className="w-full border p-2 rounded"
              required
            />

            <label htmlFor="newSex" className="block mb-1">Sexe</label>
            <select
              id="newSex"
              value={newSex}
              onChange={e => setNewSex(e.target.value)}
              aria-label="Sexe"
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Sexe</option>
              <option>Homme</option>
              <option>Femme</option>
            </select>

            <label htmlFor="newBirthPlace" className="block mb-1">Lieu de naissance</label>
            <input
              id="newBirthPlace"
              type="text"
              value={newBirthPlace}
              onChange={e => setNewBirthPlace(e.target.value)}
              placeholder="Lieu de naissance"
              aria-label="Lieu de naissance"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-100"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </aside>

      {/* Zone principale */}
      <main className="flex-1 p-8 relative h-screen">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <div className="flex items-center border rounded p-2 bg-white shadow">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Rechercher"
              aria-label="Rechercher"
              title="Rechercher"
              className="outline-none"
            />
          </div>
        </div>

        <TreeViewer
          tree={tree}
          onSelect={member => setSelected(member)}
          onAdd={(type, parentId) => {
            handleAddClick();
          }}
        />
      </main>
    </div>
  );
}
