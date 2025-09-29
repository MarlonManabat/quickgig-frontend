import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp Manila",
    description: "Build modern web applications using React and TypeScript",
    location: "Makati City",
    region: "National Capital Region",
    province: "Metro Manila",
    city: "Makati",
    salary_min: 50000,
    salary_max: 80000,
    employment_type: "full-time",
    skills: ["React", "TypeScript", "JavaScript"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Backend Developer",
    company: "DataSoft Inc",
    description: "Develop scalable APIs and microservices",
    location: "Quezon City",
    region: "National Capital Region",
    province: "Metro Manila",
    city: "Quezon City",
    salary_min: 60000,
    salary_max: 90000,
    employment_type: "full-time",
    skills: ["Node.js", "Python", "PostgreSQL"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mobile Developer",
    company: "AppWorks",
    description: "Create mobile apps for iOS and Android",
    location: "Cebu City",
    region: "Region VII (Central Visayas)",
    province: "Cebu",
    city: "Cebu City",
    salary_min: 45000,
    salary_max: 75000,
    employment_type: "full-time",
    skills: ["React Native", "Flutter", "Swift"],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company: "Creative Studio",
    description: "Design user interfaces and experiences",
    location: "Davao City",
    region: "Region XI (Davao Region)",
    province: "Davao del Sur",
    city: "Davao City",
    salary_min: 35000,
    salary_max: 55000,
    employment_type: "full-time",
    skills: ["Figma", "Adobe XD", "Sketch"],
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    description: "Manage cloud infrastructure and deployments",
    location: "Iloilo City",
    region: "Region VI (Western Visayas)",
    province: "Iloilo",
    city: "Iloilo City",
    salary_min: 70000,
    salary_max: 100000,
    employment_type: "full-time",
    skills: ["AWS", "Docker", "Kubernetes"],
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Data Analyst",
    company: "Analytics Pro",
    description: "Analyze business data and create insights",
    location: "Baguio",
    region: "Cordillera Administrative Region (CAR)",
    province: "Benguet",
    city: "Baguio",
    salary_min: 40000,
    salary_max: 65000,
    employment_type: "full-time",
    skills: ["Python", "SQL", "Tableau"],
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const province = searchParams.get("province");
  const city = searchParams.get("city");

  let filteredJobs = MOCK_JOBS;

  if (region) {
    filteredJobs = filteredJobs.filter(job => job.region === region);
  }
  if (province) {
    filteredJobs = filteredJobs.filter(job => job.province === province);
  }
  if (city) {
    filteredJobs = filteredJobs.filter(job => job.city === city);
  }

  return NextResponse.json({
    items: filteredJobs,
    total: filteredJobs.length,
  });
}
