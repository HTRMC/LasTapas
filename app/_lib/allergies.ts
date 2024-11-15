// File: lib/allergies.ts

export type Allergy = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy' | 'shellfish';

export const allergyIcons: Record<Allergy, string> = {
  gluten: '🌾',
  dairy: '🥛',
  nuts: '🥜',
  eggs: '🥚',
  soy: '🫘',
  shellfish: '🦐'
};

export const allergyNames: Record<Allergy, string> = {
  gluten: 'Gluten',
  dairy: 'Dairy',
  nuts: 'Nuts',
  eggs: 'Eggs',
  soy: 'Soy',
  shellfish: 'Shellfish'
};