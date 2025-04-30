// components/ProfileEditForm.tsx
'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { FaUser, FaTimes, FaSave, FaCamera } from 'react-icons/fa';

// Constants
const GENDER_OPTIONS = ['masculin', 'feminin'] as const;
const STATUS_OPTIONS = ['vivant', 'decede'] as const;
const DATE_TYPE_OPTIONS = ['Exacte', 'Avant', 'Après'] as const;
const MONTHS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
  'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
] as const;

// Types
export type Gender = typeof GENDER_OPTIONS[number];
export type Status = typeof STATUS_OPTIONS[number];
export type DateType = typeof DATE_TYPE_OPTIONS[number];

export interface EditForm {
  profileImage: string | null;
  gender: Gender;
  firstName: string;
  lastName: string;
  dateType: DateType;
  day: string;
  month: string;
  year: string;
  birthPlace: string;
  status: Status;
}

interface ProfileEditFormProps {
  editForm: EditForm;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: (e: FormEvent) => void;
}

// Reusable Radio Group Component
interface RadioGroupProps {
  name: string;
  legend: string;
  options: readonly string[];
  currentValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  labels?: Record<string, string>;
}

const RadioGroup = ({ 
  name,
  legend,
  options,
  currentValue,
  onChange,
  labels 
}: RadioGroupProps) => (
  <fieldset className="flex space-x-6">
    <legend className="text-sm font-medium text-indigo-700 mb-2">{legend}</legend>
    <div className="flex gap-4">
      {options.map((value) => (
        <label key={value} className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name={name}
              value={value}
              checked={currentValue === value}
              onChange={onChange}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-300 peer-focus:ring-offset-1"></div>
            <div className="absolute inset-0 w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            </div>
          </div>
          <span className="text-sm capitalize text-gray-700 group-hover:text-indigo-700">
            {labels?.[value] || value}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default function ProfileEditForm({
  editForm,
  handleInputChange,
  handleImageChange,
  handleCancelEdit,
  handleSaveEdit
}: ProfileEditFormProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSaveEdit}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative border border-gray-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="h-8 w-1 bg-indigo-600 rounded-full mr-3"></span>
            Modifier le profil de <span className="text-indigo-600 ml-2">{editForm.firstName || '...'}</span>
          </h2>
          <button
            type="button"
            onClick={handleCancelEdit}
            aria-label="Fermer"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {editForm.profileImage ? (
                <img
                  src={editForm.profileImage}
                  alt="Photo de profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="h-16 w-16 text-indigo-300" />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-1 right-1 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-indigo-700 cursor-pointer transition-all duration-200 group"
              aria-label="Changer la photo"
            >
              <FaCamera className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          {/* Gender Selection */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <RadioGroup
              name="gender"
              legend="Sexe"
              options={GENDER_OPTIONS}
              currentValue={editForm.gender}
              onChange={handleInputChange}
              labels={{ masculin: 'Masculin', feminin: 'Féminin' }}
            />
          </div>

          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              label="Prénom et deuxième prénom"
              value={editForm.firstName}
              onChange={handleInputChange}
              placeholder="Prénom(s)"
              required
            />
            <InputField
              id="lastName"
              label="Nom de famille"
              value={editForm.lastName}
              onChange={handleInputChange}
              placeholder="Nom de famille"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <SelectField
                id="dateType"
                label="Date de naissance"
                value={editForm.dateType}
                onChange={handleInputChange}
                options={DATE_TYPE_OPTIONS}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                id="day"
                type="number"
                value={editForm.day}
                onChange={handleInputChange}
                placeholder="Jour"
                min={1}
                max={31}
                required
              />
              <SelectField
                id="month"
                value={editForm.month}
                onChange={handleInputChange}
                options={MONTHS}
                placeholder="Mois"
                required
              />
              <InputField
                id="year"
                type="number"
                value={editForm.year}
                onChange={handleInputChange}
                placeholder="Année"
                min={1000}
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          {/* Birth Place */}
          <InputField
            id="birthPlace"
            label="Lieu de naissance"
            value={editForm.birthPlace}
            onChange={handleInputChange}
            placeholder="Ex : Paris, France"
            icon="🌍"
          />

          {/* Status Selection */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <RadioGroup
              name="status"
              legend="Statut"
              options={STATUS_OPTIONS}
              currentValue={editForm.status}
              onChange={handleInputChange}
              labels={{ vivant: 'Vivant', decede: 'Décédé' }}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
          >
            <FaSave className="mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Field Component
interface InputFieldProps {
  id: string;
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  icon?: string;
}

const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  required,
  icon
}: InputFieldProps) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500">{icon}</span>
        </div>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        className={`w-full border border-gray-300 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors ${
          icon ? 'pl-9' : 'px-4'
        } hover:border-indigo-300`}
      />
    </div>
  </div>
);

// Reusable Select Field Component
interface SelectFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
}

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required
}: SelectFieldProps) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full appearance-none border border-gray-300 rounded-lg py-2.5 px-4 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-colors pr-10"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);