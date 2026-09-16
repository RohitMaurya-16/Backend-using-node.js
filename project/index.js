import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName=fileURLToPath(import.meta.url);
const __dirname=path.dirname(fileName);

const PORT=8081;

const kr=()=>(req, res)=>
{
    const publicDir=path.join(__dirname,'public')
    
    /* path.join() ek aisa tool/function hai jo alag-alag folder aur file ke namos (segments) ko jodkar
     ek complete file path banata hai. Iska sabse bada fayda ye hai ki ye aapke operating system ke hisab
      se sahi slash (/ ya \) apne aap laga deta hai */

    const url=req.url ||'/';
      
    /* req.url || '/': Fallback operator ensuring that if req.url is undefined or empty,
    it defaults to the root path (/). */

    
    const cleanUrl = url === '/' ? '/' : url.replace(/\/+$/, '');

    /*It ensures that no matter how a user types the link, they always 
    end up on the exact same, clean page:http://localhost:8081/about/ ➔ 
    becomes ➔ http://localhost:8081/abouthttp://localhost:8081/about//// ➔ 
    becomes ➔ http://localhost:8081/about

    */

    let fileName='404.html';
    let status=404;

    if(cleanUrl==='/')
    {
        fileName='index.html';
        status=200;
    }
    else if(cleanUrl==='/about')
    {
        fileName='about.html'
        status=200;
    }
    else if(cleanUrl=='/contact-me')
    {
        fileName='contact-me.html'
        status=200;
    }

   const filePath = path.join(publicDir, fileName);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }

         /* fs.readFile(): Reads the target HTML file from 
    your disk in the background without blocking the Node.js
     event loop. It takes a callback function that runs once 
     the reading operation finishes or fails. 
     */

        res.writeHead(status, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8'); // return if everyhting is good 
        
        //In Node.js, res.writeHead and res.end are tools used to send a 
        // response from your server back to a user's web browser.
    });

};

const startServer = (port) => {
    const server = http.createServer(kr());

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy. Trying ${port + 1}...`);
            startServer(port + 1);
            return;
        }
       
        /*
        'EADDRINUSE' Error kya hai? Iska matlab hai "Address Already In Use". 
        Yani jis port number (jaise 8081) par aap apna server chalana chahte ho, 
        uspar pehle se hi koi dusra program ya server chal raha hai.
        */
        throw err;
    });

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};

startServer(PORT);

   

