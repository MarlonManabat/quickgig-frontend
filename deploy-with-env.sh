#!/bin/bash
# QuickGig.ph Deployment Script with Environment Variables
# This script configures and deploys QuickGig to app.quickgig.ph

set -e

echo "🚀 QuickGig.ph Deployment Script"
echo "================================"

# Supabase Configuration
export NEXT_PUBLIC_SUPABASE_URL="https://duhczsmefhdvhohqlwig.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1aGN6c21lZmhkdmhvaHFsd2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDU2MTksImV4cCI6MjA3MTMyMTYxOX0.mKFOtjZYS-QHL7VBoUWhCpg2AS3_gf0mul4FWnsOQC0"
export NEXT_PUBLIC_SITE_URL="https://app.quickgig.ph"
export NEXT_PUBLIC_APP_HOST_BASE_URL="https://app.quickgig.ph"
export TICKET_PRICE_PHP="20"
export FREE_TICKETS_ON_SIGNUP="3"

echo "✅ Environment variables configured"

# Build the application
echo "📦 Building application..."
npm run build

echo "✅ Build complete!"
echo ""
echo "🎉 Application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. The application has been built with Supabase credentials"
echo "2. Deploy to Vercel using: vercel --prod"
echo "3. Or push to GitHub main branch for auto-deployment"

