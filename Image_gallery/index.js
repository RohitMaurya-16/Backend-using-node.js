import http from 'http'; // Node's built-in HTTP module creates the web server.
import fs from 'fs'; // The fs module reads files from the project folder.
import path from 'path'; // The path module helps build correct file paths.
import { fileURLToPath } from 'url'; // This converts the current module path into a filesystem path.

try {
    process.loadEnvFile(); // Try to load environment variables from a .env file if it exists.
} catch (err) {
    console.log('.env file not found, using system environment variables.'); // If no .env file is present, continue normally.
}

const __filename = fileURLToPath(import.meta.url); // Convert the current file URL to a normal file path.
const __dirname = path.dirname(__filename); // Get the current folder path for this project.

const PORT = Number(process.env.PORT) || 8081; // Read the port from the .env file and never hardcode it in app code.

const BASE_IMAGE_API_URL = process.env.PICSUM_API_URL; // Read the API base URL from the .env file.
const IMAGE_BASE_URL = process.env.PICSUM_IMAGE_BASE_URL; // Read the image host from the .env file.

if (!BASE_IMAGE_API_URL || !IMAGE_BASE_URL) {
    throw new Error('Missing required env values: PICSUM_API_URL or PICSUM_IMAGE_BASE_URL');
}

const server = http.createServer(async (req, res) => {
    const publicDir = path.join(__dirname, 'public'); // Point to the public folder that contains the HTML and CSS files.

    // Parse the browser request into a URL object so we can safely inspect the path and query string.
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname; // Get only the route path, like / or /api/images.
    const cleanUrl = pathname === '/' ? '/' : pathname.replace(/\/+$/, ''); // Remove extra trailing slashes to normalize URLs.

    // Route 1: serve the main home page.
    if (cleanUrl === '/') {
        const filePath = path.join(publicDir, 'index.html'); // Build the exact path to index.html.
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' }); // If the file cannot be read, send a 500 error.
                res.end('500 Internal Server Error'); // Send a text message to the browser.
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' }); // Send a successful response for HTML.
            res.end(content, 'utf-8'); // Send the page content to the browser.
        });
    }
    // Route 2: serve the stylesheet.
    else if (cleanUrl === '/style.css') {
        const filePath = path.join(publicDir, 'style.css'); // Build the path to the CSS file.
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' }); // If CSS is missing, return 404.
                res.end('404 Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' }); // Tell the browser this is CSS.
            res.end(content, 'utf-8'); // Send the CSS content.
        });
    }
    // Route 3: fetch image data from Picsum for the gallery.
    else if (cleanUrl === '/api/images') {
        try {
            const page = parsedUrl.searchParams.get('page') || '1'; // Read page number from URL query string.
            const limit = parsedUrl.searchParams.get('limit') || '20'; // Read how many images per request.
            const picsumUrl = `${BASE_IMAGE_API_URL}?page=${page}&limit=${limit}`; // Build the external API URL from the .env config.

            const apiResponse = await fetch(picsumUrl); // Request image data from the configured source.

            if (!apiResponse.ok) {
                throw new Error(`Picsum API error: ${apiResponse.status}`); // If the external API fails, throw a clear error.
            }

            const data = await apiResponse.json(); // Convert the response to JavaScript objects.
            const imageData = Array.isArray(data)
                ? data.map(item => ({
                    ...item,
                    imageUrl: `${IMAGE_BASE_URL}/${item.id}/300/200`
                }))
                : []; // Add a safe image URL to each item using the env-configured image base.

            res.writeHead(200, { 'Content-Type': 'application/json' }); // Tell the browser the response is JSON.
            res.end(JSON.stringify(imageData)); // Send the image list back to the page.
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' }); // If the external API fails, return a server error.
            res.end(JSON.stringify({ error: 'Failed to fetch from external database' })); // Send a simple error object.
        }
    }
    // 404 fallback: route does not exist.
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' }); // Send 404 status.
        res.end('404 Not Found'); // Show plain text to the browser.
    }
});

server.listen(PORT, () => { // Start listening for requests on the chosen port.
    console.log(`Server is running at http://localhost:${PORT}`); // Print the local URL users can open.
});