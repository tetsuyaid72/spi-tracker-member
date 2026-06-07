# Vercel Deployment Checklist

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables for Production:

```env
DATABASE_URL=libsql://spi-tracker-tetsuyaid72.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=your-turso-token
BETTER_AUTH_SECRET=your-strong-production-secret
BETTER_AUTH_URL=https://your-production-domain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-production-domain.com
```

Optional aliases also supported by the code:

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

## Notes

- Use the same Turso database URL/token from VPS to keep existing data.
- Do not use `file:sqlite.db` in production; that fallback is only for local development.
- After assigning a custom domain in Vercel, update both `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to that exact HTTPS origin.
- `VERCEL_URL` is trusted automatically for preview deployments, but Better Auth production URL should still be explicit.

## Deploy Steps

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel as a Next.js project.
3. Add the required environment variables above.
4. Deploy.
5. Open `/login` and verify sign-in.
6. Verify `/api/auth/get-session`, `/api/stores`, `/map`, `/stores`, `/admin`, and `/settings` while authenticated.
7. Only shut down the VPS after the Vercel deployment reads/writes the Turso database successfully.
