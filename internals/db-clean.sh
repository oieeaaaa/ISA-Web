rm -rf prisma/migrations # Wipe-out migrations history
rm prisma/dev.db # Wipe-out database
touch prisma/dev.db # Create a new one

echo "DB is clean ✨"

yarn prisma:update

echo "Success! ✅"
