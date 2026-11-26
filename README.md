This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Panoul de administrare pe Vercel

Panoul (`/admin`) editează cataloagele de produse și urcă imagini. Pe Vercel
sistemul de fișiere este read-only, deci totul trece prin **Vercel Blob**:

1. **Creează un Blob store**: Project → Storage → Create Storage → Blob, cu
   accesul setat pe **Public** (imaginile produselor trebuie să fie publice).
2. **Conectează store-ul la proiect** (store → Projects → Connect to Project),
   pentru **Production** și **Preview**. Vercel injectează automat
   `BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`; tokenul read-write e opțional.
3. **Redeploy** după conectare — variabilele de mediu intră în vigoare doar la un
   deployment nou.
4. **Variabile de mediu** în Project → Settings → Environment Variables:
   `ADMIN_PASSWORD` și `ADMIN_SECRET` (aceleași valori le folosești și local).
5. La prima salvare din panou, cataloagele din `scrape/*.json` sunt copiate în
   Blob sub `catalog/*.json`, iar de atunci Blob-ul este sursa de adevăr.
   Imaginile urcate ajung în Blob sub `uploads/`.

Fără un store conectat site-ul funcționează normal, dar panoul nu poate salva
(scrie un mesaj clar în formular). Local, fără Blob, panoul scrie în continuare
în `scrape/` și în `data/uploads/`.

Limita de încărcare este 4 MB (Vercel limitează corpul cererii la 4,5 MB).

