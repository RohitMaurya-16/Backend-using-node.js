The Core Rule: Static vs. Dynamic
Static Hosts (GitHub Pages, Vercel, Netlify): Only for HTML/CSS/JS. They cannot run Node.js servers or manage databases.

PaaS Providers (Render, Railway): Required for Node.js apps because they run your server instances and hook up databases.

2. Essential Deployment Checklist (Node.js/Express)
Start Script: Ensure your package.json has a correct start script ("start": "node app.js" or similar). PaaS providers look for this to run your app.

Port Configuration: Never hardcode your port (e.g., const PORT = 3000). Use environment variables provided by the host:

```
JavaScript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
Environment Variables (.env): Never push secrets (DATABASE_URL, API keys) to GitHub. Add them directly in your PaaS dashboard under "Environment Variables".
```

Database Connection: Ensure your connection string uses the live database URL from your cloud provider (like Neon or Aiven) instead of localhost.

3. Quick Troubleshooting Flow
Build Fails: Check the Build Logs in your PaaS dashboard to see missing dependencies or Node version mismatches.

500 Internal Server Error (Post-Deploy): Check the Application Logs in real-time while refreshing the page to catch unhandled crashes or failed database queries.

Rollback: Use git log and git checkout if a recent push broke a previously working deployment.
