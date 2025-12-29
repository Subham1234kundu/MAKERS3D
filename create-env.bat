@echo off
echo ========================================
echo Creating .env.local file...
echo ========================================
echo.

(
echo # MongoDB Atlas Connection
echo MONGODB_URI=mongodb+srv://subhamkundu:Ironman2000@lms.4a4h7.mongodb.net/makers3d_db?retryWrites=true^&w=majority
echo.
echo # NextAuth Configuration
echo NEXTAUTH_URL=http://localhost:3000
echo NEXTAUTH_SECRET=pX9mK2vN8qL5wR7tY4uH6jG3fD1sA0zX9cV8bN7mQ5wE2rT4yU6iO8pA1sD3fG5h
echo.
echo # Google OAuth ^(Optional^)
echo # GOOGLE_CLIENT_ID=your_google_client_id
echo # GOOGLE_CLIENT_SECRET=your_google_client_secret
) > .env.local

echo.
echo ========================================
echo SUCCESS! .env.local file created!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your dev server (Ctrl+C, then: npm run dev)
echo 2. Visit: http://localhost:3000
echo 3. Click the user icon in navbar
echo.
pause
