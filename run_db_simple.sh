#!/bin/bash

echo "🚀 Starting Database Migration & Seeder..."

echo "📦 Creating database..."
npx sequelize-cli db:create

echo "🔄 Running migrations..."
npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
    echo "✅ Migration successful!"
    
    echo "🌱 Running seeders..."
    npx sequelize-cli db:seed:all
    
    if [ $? -eq 0 ]; then
        echo "✅ Seeder successful!"
        echo "🎉 Database setup completed!"
    else
        echo "❌ Seeder failed!"
        exit 1
    fi
else
    echo "❌ Migration failed!"
    exit 1
fi