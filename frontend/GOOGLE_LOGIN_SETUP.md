# Google Login Configuration

To enable Google login in your SmartCampus application, follow these steps:

## 1. Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the "Google+ API"
4. Create OAuth 2.0 credentials (Web Application)
5. Add your frontend URL to authorized origins (e.g., `http://localhost:5173`)
6. Copy your Client ID

## 2. Set Up Environment Variable

Add your Google Client ID to the `.env.local` file in the frontend folder:

```
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

Replace `your_actual_google_client_id_here` with your actual Google Client ID.

## 3. Restart Development Server

Restart your frontend development server to load the environment variable:

```bash
npm run dev
```

## 4. Test Google Login

- Go to the login page
- Click on the Google Sign-In button
- You should now be able to sign in with your Google account

## Troubleshooting

If you see: "Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID to enable it."

1. Verify the `.env.local` file exists in the `frontend` folder
2. Ensure the `VITE_GOOGLE_CLIENT_ID` variable is set correctly
3. Restart the development server
4. Clear your browser cache

---

For more information on setting up Google OAuth, visit:
https://developers.google.com/identity/gsi/web/guides/get-google-api-console-project
