export type DemoJob = {
  id: string;
  title: string;
  description: string;
  region: string;
  city: string;
  createdAt: string;
};

export const demoJobs: DemoJob[] = [
  {
    id: 'demo-1',
    title: 'Barista sa QC',
    description:
      'Maglingkod ng masarap na kape sa isang cozy na cafe sa Quezon City. Kailangan ang basic latte art at maayos na customer service.',
    region: 'NCR',
    city: 'Quezon City',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Online English Tutor',
    description:
      'Turuan ang mga batang mag-English gamit ang online platform. Flexible schedule at may training materials.',
    region: 'REGION_IV_A',
    city: 'Antipolo City',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Graphic Designer (Freelance)',
    description:
      'Gumawa ng social media visuals para sa isang lokal na brand. Preferable ang may experience sa Canva o Adobe Suite.',
    region: 'REGION_III',
    city: 'Angeles City',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Warehouse Assistant',
    description:
      'Tumulong sa inventory at packing ng mga orders sa warehouse sa Cebu City. Kailangan ang pagiging masinop at handang magbuhat.',
    region: 'REGION_VII',
    city: 'Cebu City',
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Community Manager',
    description:
      'Pamahalaan ang online community ng isang startup at makipag-ugnayan sa mga user sa social media.',
    region: 'REGION_VI',
    city: 'Iloilo City',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Sales Associate',
    description:
      'Magbenta ng lifestyle products sa isang pop-up store sa Davao City. Kailangan ang friendly demeanor at basic POS skills.',
    region: 'REGION_XI',
    city: 'Davao City',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
];
