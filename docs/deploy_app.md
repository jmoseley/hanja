# Deploy App

## Vercel

1. Update `app/vercel.prod.json` to point to the appropriate values. [TODO: Make this come from a shared .env]
2. Run `HASURA_ENDPOINT="<hasura endpoint>" ADMIN_SECRET="<admin secret>" yarn deploy-app-vercel`
