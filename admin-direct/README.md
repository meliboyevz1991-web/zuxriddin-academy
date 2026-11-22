# Zuxriddin Academy direct publish admin

Import this GitHub repository into Vercel and choose **Root Directory: admin-direct**, framework **Other**.

Set these Vercel production environment secrets (do NOT commit them):
- ADMIN_PASSWORD: strong, unique 16+ character password
- SESSION_SECRET: 48+ random characters
- GITHUB_TOKEN: GitHub fine-grained personal access token, ONLY this repository, Contents: Read and write

Redeploy after configuring environment variables. Open Vercel-assigned URL and log in to publish HTML tests.

This backend is NOT deployed merely by adding this directory to GitHub Pages. It needs Vercel to run serverless functions. Add Vercel Firewall / rate-limiting to protect password login from brute-force attacks.
