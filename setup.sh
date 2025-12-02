#!/bin/bash

# CSI Manakkala School Website Setup Script
# This script helps set up the development environment

set -e

echo "🎓 CSI Manakkala School Website Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Function to prompt for database URL
prompt_for_database_url() {
    echo -e "${YELLOW}📊 Database Configuration${NC}"
    echo ""
    echo "You need a Neon PostgreSQL connection string."
    echo "Get one from: https://console.neon.tech"
    echo ""
    echo "Your connection string should look like:"
    echo "postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
    echo ""
    read -p "Paste your DATABASE_URL here: " DATABASE_URL
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL cannot be empty${NC}"
        exit 1
    fi
}

# Setup backend
echo -e "${YELLOW}🔧 Setting up backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    
    # Prompt for database URL
    prompt_for_database_url
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
    else
        # Linux
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
    fi
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    else
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    fi
    
    echo -e "${GREEN}✅ Backend .env configured${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env already exists, skipping...${NC}"
fi

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npm run migrate

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# Setup frontend
cd ..
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp env.local.example .env.local
    echo -e "${GREEN}✅ Frontend .env.local configured${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env.local already exists, skipping...${NC}"
fi

echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"
echo ""

# Final instructions
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo -e "   ${YELLOW}cd server && npm run dev${NC}"
echo ""
echo "2. Start the frontend (in another terminal):"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Open your browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "4. Login with:"
echo "   Email: admin@csihssmanakala.edu"
echo "   Password: password123"
echo ""
echo -e "${YELLOW}⚠️  Remember to change the default password in production!${NC}"
echo ""

