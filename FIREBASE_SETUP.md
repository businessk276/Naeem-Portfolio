# Firebase setup

The app uses the Firebase project configured in `.env.local` and stores the public portfolio at:

`portfolio/JubartPortfolio`

## One-time Firebase Console setup

1. Open the Firebase project from `.env.local` (`baladymcq` in the current workspace).
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create one admin user under **Authentication > Users**.
4. Open **Firestore Database**, create a database, and deploy or paste the rules from `firestore.rules`.
5. Open **Storage**, enable it, and deploy or paste the rules from `storage.rules`.
6. Start the app with `npm run dev`.
7. Click the lock icon in the portfolio navigation, sign in with the admin user, and click **Publish to Firebase**.

The first publish creates the `portfolio/JubartPortfolio` document using the complete local portfolio data. The admin editor controls every section represented by `PortfolioData`; edit the JSON and publish to update the public site.

## Environment variables

Vite exposes only variables prefixed with `VITE_`. The existing `.env.local` already contains:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Firebase web API keys are identifiers, not passwords. Keep admin credentials out of source control.

## Security note

The included rules allow public reads and require a signed-in Firebase user for writes. For a multi-user production system, replace `request.auth != null` with a custom admin claim or an allowlisted admin UID.
