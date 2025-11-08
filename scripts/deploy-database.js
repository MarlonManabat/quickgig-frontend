#!/usr/bin/env node
/**
 * QuickGig.ph Database Deployment Script
 * 
 * This script deploys the database schema and seed data to Supabase
 * Run with: node scripts/deploy-database.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://duhczsmefhdvhohqlwig.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1aGN6c21lZmhkdmhvaHFsd2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDU2MTksImV4cCI6MjA3MTMyMTYxOX0.mKFOtjZYS-QHL7VBoUWhCpg2AS3_gf0mul4FWnsOQC0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sampleGigs = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    owner: '11111111-1111-1111-1111-111111111111',
    title: 'Web Developer Needed',
    description: 'Looking for an experienced web developer to build a modern e-commerce website. Must have experience with React, Next.js, and Tailwind CSS.',
    budget: 50000,
    location: 'Quezon City',
    status: 'published',
    paid: true,
    company: 'TechStart Philippines',
    region: 'National Capital Region',
    rate: 50000,
    pay_min: 45000,
    pay_max: 55000,
    remote: false,
    published: true
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    owner: '22222222-2222-2222-2222-222222222222',
    title: 'Graphic Designer for Marketing',
    description: 'Need a creative graphic designer to create marketing materials for our new product launch. Experience with Adobe Creative Suite required.',
    budget: 25000,
    location: 'Cebu City',
    status: 'published',
    paid: true,
    company: 'Creative Agency Cebu',
    region: 'Central Visayas (Region VII)',
    rate: 25000,
    pay_min: 20000,
    pay_max: 30000,
    remote: true,
    published: true
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    owner: '11111111-1111-1111-1111-111111111111',
    title: 'Mobile App Developer',
    description: 'Seeking a skilled mobile app developer to create a food delivery app for iOS and Android. Flutter or React Native experience preferred.',
    budget: 75000,
    location: 'Makati City',
    status: 'published',
    paid: true,
    company: 'FoodTech Solutions',
    region: 'National Capital Region',
    rate: 75000,
    pay_min: 70000,
    pay_max: 80000,
    remote: false,
    published: true
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    owner: '22222222-2222-2222-2222-222222222222',
    title: 'Content Writer',
    description: 'Looking for a talented content writer to create blog posts and social media content. Must have excellent English writing skills.',
    budget: 15000,
    location: 'Remote',
    status: 'published',
    paid: true,
    company: 'Digital Marketing Hub',
    region: 'National Capital Region',
    rate: 15000,
    pay_min: 12000,
    pay_max: 18000,
    remote: true,
    published: true
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    owner: '11111111-1111-1111-1111-111111111111',
    title: 'Virtual Assistant',
    description: 'Need a reliable virtual assistant for administrative tasks, email management, and scheduling. Must be available during PH business hours.',
    budget: 20000,
    location: 'Remote',
    status: 'published',
    paid: true,
    company: 'BPO Services Inc',
    region: 'CALABARZON (Region IV-A)',
    rate: 20000,
    pay_min: 18000,
    pay_max: 22000,
    remote: true,
    published: true
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    owner: '22222222-2222-2222-2222-222222222222',
    title: 'Social Media Manager',
    description: 'Seeking an experienced social media manager to handle our Facebook, Instagram, and TikTok accounts. Must have proven track record.',
    budget: 30000,
    location: 'Davao City',
    status: 'published',
    paid: true,
    company: 'E-commerce Startup',
    region: 'Davao Region (Region XI)',
    rate: 30000,
    pay_min: 28000,
    pay_max: 35000,
    remote: true,
    published: true
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    owner: '11111111-1111-1111-1111-111111111111',
    title: 'Data Entry Specialist',
    description: 'Looking for detail-oriented data entry specialists for a 3-month project. Fast typing speed and accuracy required.',
    budget: 12000,
    location: 'Manila',
    status: 'published',
    paid: true,
    company: 'Data Solutions Corp',
    region: 'National Capital Region',
    rate: 12000,
    pay_min: 10000,
    pay_max: 14000,
    remote: false,
    published: true
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    owner: '22222222-2222-2222-2222-222222222222',
    title: 'Video Editor',
    description: 'Need a skilled video editor for YouTube content. Experience with Premiere Pro and After Effects required.',
    budget: 35000,
    location: 'Remote',
    status: 'published',
    paid: true,
    company: 'Content Creator Network',
    region: 'Central Luzon (Region III)',
    rate: 35000,
    pay_min: 30000,
    pay_max: 40000,
    remote: true,
    published: true
  },
  {
    id: 'a9999999-9999-9999-9999-999999999999',
    owner: '11111111-1111-1111-1111-111111111111',
    title: 'Customer Service Representative',
    description: 'Hiring customer service representatives for our e-commerce platform. Must have excellent communication skills.',
    budget: 18000,
    location: 'Quezon City',
    status: 'published',
    paid: true,
    company: 'Online Retail PH',
    region: 'National Capital Region',
    rate: 18000,
    pay_min: 16000,
    pay_max: 20000,
    remote: false,
    published: true
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    owner: '22222222-2222-2222-2222-222222222222',
    title: 'SEO Specialist',
    description: 'Looking for an SEO specialist to improve our website rankings. Must have experience with Google Analytics and SEO tools.',
    budget: 28000,
    location: 'Remote',
    status: 'published',
    paid: true,
    company: 'Digital Growth Agency',
    region: 'National Capital Region',
    rate: 28000,
    pay_min: 25000,
    pay_max: 32000,
    remote: true,
    published: true
  }
];

async function deployDatabase() {
  console.log('🚀 Starting QuickGig.ph database deployment...\n');

  try {
    // Insert gigs
    console.log('📝 Inserting sample gigs...');
    const { data, error } = await supabase
      .from('gigs')
      .upsert(sampleGigs, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error inserting gigs:', error);
      throw error;
    }

    console.log('✅ Successfully inserted 10 sample gigs!\n');

    // Verify deployment
    const { data: gigs, error: fetchError } = await supabase
      .from('gigs')
      .select('id, title, company, region, rate')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching gigs:', fetchError);
      throw fetchError;
    }

    console.log('✅ Deployment verification:');
    console.log(`   Total published gigs: ${gigs.length}`);
    console.log('\n📋 Sample gigs:');
    gigs.slice(0, 5).forEach(gig => {
      console.log(`   - ${gig.title} (${gig.company}) - ₱${gig.rate?.toLocaleString()} - ${gig.region}`);
    });

    console.log('\n✅ Database deployment complete!');
    console.log('🌐 Visit https://app.quickgig.ph to see the live data\n');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployDatabase();

