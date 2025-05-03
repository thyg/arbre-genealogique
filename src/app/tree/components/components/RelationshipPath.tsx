"use client";

import React from "react";

export interface RelationshipStep {
  fromPerson: string;    // ex. "Bengono Amvela Nathan"
  toPerson: string;      // ex. "Ntolo Bengono Marie"
  relationType: string;  // ex. "DAUGHTER", "SON", …
}

interface RelationshipPathProps {
  path: RelationshipStep[];
  totalWeight?: number;
}

export function RelationshipPath({ path, totalWeight }: RelationshipPathProps) {
  if (!path || path.length === 0) {
    return null;
  }

  // Fonction utilitaire pour formater "DAUGHTER" → "est la fille de"
  const formatRelation = (relationType: string): string => {
    const relationMap: Record<string, string> = {
      "DAUGHTER": "est la fille de",
      "SON": "est le fils de",
      "FATHER": "est le père de",
      "MOTHER": "est la mère de",
      "BROTHER": "est le frère de",
      "SISTER": "est la sœur de",
      "HUSBAND": "est le mari de",
      "WIFE": "est la femme de",
      "GRANDFATHER": "est le grand-père de",
      "GRANDMOTHER": "est la grand-mère de",
      "GRANDSON": "est le petit-fils de",
      "GRANDDAUGHTER": "est la petite-fille de",
      "COUSIN": "est le/la cousin(e) de",
      "UNCLE": "est l'oncle de",
      "AUNT": "est la tante de",
      "NEPHEW": "est le neveu de",
      "NIECE": "est la nièce de",
    };
    
    return relationMap[relationType] || `est ${relationType.toLowerCase()} de`;
  };

  // Créer un chemin lisible
  const relationPath = path.map((step, index) => {
    // Pour le premier élément, on prend fromPerson
    if (index === 0) {
      return {
        person: step.fromPerson,
        relation: formatRelation(step.relationType),
        nextPerson: step.toPerson
      };
    }
    
    // Pour les éléments suivants, on ne prend que toPerson
    // (car fromPerson est déjà le toPerson de l'étape précédente)
    return {
      person: step.toPerson,
      relation: index < path.length - 1 ? formatRelation(path[index + 1].relationType) : null,
      nextPerson: index < path.length - 1 ? path[index + 1].toPerson : null
    };
  });

  return (
    <section
      className="mt-6 bg-white p-6 rounded-lg shadow-lg"
      aria-label="Chemin de parenté"
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Chemin de parenté {totalWeight && <span className="text-sm font-normal text-gray-500 ml-2">(Distance: {totalWeight})</span>}
      </h2>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-nowrap items-center min-w-max">
          {/* Premier élément */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shadow-md">
              {relationPath[0].person.split(' ').map(name => name[0]).join('')}
            </div>
            <span className="mt-2 text-sm font-medium text-blue-800 max-w-[120px] text-center">
              {relationPath[0].person}
            </span>
          </div>

          {/* Mapping des éléments suivants avec flèches */}
          {relationPath.map((item, idx) => {
            // Skip the first item as we've already rendered it
            if (idx === 0) return null;
            
            return (
              <React.Fragment key={idx}>
                {/* Flèche avec relation */}
                <div className="flex flex-col items-center mx-2 px-2">
                  <div className="text-xs text-gray-600 mb-1 italic text-center">
                    {path[idx-1].relationType.toLowerCase()}
                  </div>
                  <div className="w-24 h-px bg-blue-400 relative">
                    <div className="absolute -right-1 -top-2 text-blue-400">
                      ▶
                    </div>
                  </div>
                </div>

                {/* Personne */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shadow-md">
                    {item.person.split(' ').map(name => name[0]).join('')}
                  </div>
                  <span className="mt-2 text-sm font-medium text-blue-800 max-w-[120px] text-center">
                    {item.person}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Description textuelle du chemin familial */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-900">
        <h3 className="font-medium mb-2">Explication de la relation :</h3>
        <p className="text-sm">
          {path[0].toPerson} {formatRelation(path[0].relationType).toLowerCase()} {path[0].fromPerson}
          {path.slice(1).map((step, i) => (
            `, qui ${formatRelation(step.relationType).toLowerCase()} ${step.toPerson}`
          ))}
          .
        </p>
      </div>
    </section>
  );
}