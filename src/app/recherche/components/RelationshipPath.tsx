"use client";

import React from 'react';

// Each step in the relationship path
export interface PathItem {
  userName: string;
  relation: string;
}

// Props for the RelationshipPath component
interface RelationshipPathProps {
  path: PathItem[];
}

// Displays the genealogical path between two members
export function RelationshipPath(props: RelationshipPathProps) {
  const { path } = props;

  if (!path || path.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-blue-800 mb-3">
        Chemin de parenté
      </h2>
      <ul className="space-y-2">
        {path.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="font-medium text-gray-900">{item.userName}</span>
            <span className="mx-2 text-gray-500">({item.relation})</span>
            {index < path.length - 1 && <span className="text-blue-500">→</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
