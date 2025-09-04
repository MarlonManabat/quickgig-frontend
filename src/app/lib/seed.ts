export type SeedJob = {
  id: string;
  title: string;
  description: string;
};

export async function getSeededJobs(): Promise<SeedJob[]> {
  if (process.env.NODE_ENV !== 'production') {
    return [
      {
        id: 'seed-1',
        title: 'Seeded Role One',
        description: 'Example description for seeded role one.',
      },
      {
        id: 'seed-2',
        title: 'Seeded Role Two',
        description: 'Example description for seeded role two.',
      },
      {
        id: 'seed-3',
        title: 'Seeded Role Three',
        description: 'Example description for seeded role three.',
      },
    ];
  }
  return [];
}
