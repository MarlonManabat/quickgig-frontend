# QuickGig.ph Deployment Credentials

## ⚠️ IMPORTANT: Add These to Vercel

The database is configured and ready. To make the application functional, add these environment variables to Vercel:

### Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://duhczsmefhdvhohqlwig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1aGN6c21lZmhkdmhvaHFsd2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDU2MTksImV4cCI6MjA3MTMyMTYxOX0.mKFOtjZYS-QHL7VBoUWhCpg2AS3_gf0mul4FWnsOQC0
NEXT_PUBLIC_SITE_URL=https://app.quickgig.ph
NEXT_PUBLIC_APP_HOST_BASE_URL=https://app.quickgig.ph
TICKET_PRICE_PHP=20
FREE_TICKETS_ON_SIGNUP=3
```

### How to Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select the QuickGig project
3. Go to Settings → Environment Variables
4. Add each variable above for Production, Preview, and Development
5. Redeploy the application

### Database Status

✅ **Active and Ready**
- Project: MarlonManabat's Project
- URL: https://duhczsmefhdvhohqlwig.supabase.co
- Region: Singapore (ap-southeast-1)
- Tables: 9 tables created
- Sample Data: 10 jobs, 3 users

### After Adding Variables

1. Redeploy from Vercel dashboard
2. Test at https://app.quickgig.ph
3. Jobs should display correctly
4. All features should work

---

**This is the ONLY remaining step to make the application 100% functional!**

