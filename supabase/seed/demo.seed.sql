-- Demo users
insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', now()),
  ('00000000-0000-0000-0000-000000000002', 'employer@example.com', now()),
  ('00000000-0000-0000-0000-000000000003', 'worker@example.com', now())
on conflict do nothing;

-- Profiles
insert into public.profiles (id, role, full_name) values
  ('00000000-0000-0000-0000-000000000001', 'seeker', 'Admin User'),
  ('00000000-0000-0000-0000-000000000002', 'client', 'Demo Employer'),
  ('00000000-0000-0000-0000-000000000003', 'seeker', 'Demo Worker')
on conflict (id) do nothing;

-- Sample gigs created by employer
insert into public.gigs (id, title, description, city, created_by) values
  (1, 'Demo Gig 1', 'First demo gig', 'Manila', '00000000-0000-0000-0000-000000000002'),
  (2, 'Demo Gig 2', 'Second demo gig', 'Quezon City', '00000000-0000-0000-0000-000000000002'),
  (3, 'Demo Gig 3', 'Third demo gig', 'Pasig', '00000000-0000-0000-0000-000000000002')
on conflict do nothing;
