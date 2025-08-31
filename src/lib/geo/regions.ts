export type Region = { code: string; name: string };

export const PH_REGIONS: Region[] = [
  { code: '130000000', name: 'Metro Manila' },
  { code: '140000000', name: 'Cordillera Administrative Region' },
  { code: '010000000', name: 'Ilocos Region' },
  { code: '020000000', name: 'Cagayan Valley' },
  { code: '030000000', name: 'Central Luzon' },
  { code: '040000000', name: 'CALABARZON' },
  { code: '170000000', name: 'MIMAROPA' },
  { code: '050000000', name: 'Bicol Region' },
  { code: '060000000', name: 'Western Visayas' },
  { code: '070000000', name: 'Central Visayas' },
  { code: '080000000', name: 'Eastern Visayas' },
  { code: '090000000', name: 'Zamboanga Peninsula' },
  { code: '100000000', name: 'Northern Mindanao' },
  { code: '110000000', name: 'Davao Region' },
  { code: '120000000', name: 'SOCCSKSARGEN' },
  { code: '160000000', name: 'Caraga' },
  { code: '150000000', name: 'BARMM' },
];

export const toRegionOptions = () =>
  PH_REGIONS.map(r => ({ value: r.code, label: r.name }));
