#!/usr/bin/env bash
set -e

cd /var/www/vhosts/technosriracha.ac.th/httpdocs

echo "==> 1. Pulling latest code from Git..."
git pull origin main

echo "==> 1.1 Running Database Migrations..."
cd backend
php artisan migrate --force
cd /var/www/vhosts/technosriracha.ac.th/httpdocs

echo "==> 2. Building Frontend (React Router SPA)..."
cd frontend
npm install --legacy-peer-deps --no-audit --no-fund
npm run build

echo "==> 3. Copying Frontend build to httpdocs root..."
cp -rf build/client/* /var/www/vhosts/technosriracha.ac.th/httpdocs/
cd /var/www/vhosts/technosriracha.ac.th/httpdocs

echo "==> 4. Fixing file ownership (academic:psacln)..."
chown -R academic:psacln assets index.html favicon.ico fonts images logo logo_sriracha.png robots.txt song backend frontend 2>/dev/null || true

echo "✅ Deployment completed successfully!"

