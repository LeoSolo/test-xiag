const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

http.createServer((req, res) => {
    if(req.method === 'POST') {
        processPost(req, res, (shortUrl) => {
            console.log(req.post);

            res.writeHead(200, shortUrl, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': true
            });
            res.end();
        });
    } else if(req.method === 'GET') {
        if(req.url === "/"){
            fs.readFile("../../index.html", "UTF-8", function(err, html){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(html);
            });
        } else if(req.url.match("\.css$")) {
            let cssPath = path.join(__dirname, '../../', req.url);
            let fileStream = fs.createReadStream(cssPath, "UTF-8");
            res.writeHead(200, {"Content-Type": "text/css"});
            fileStream.pipe(res);
        } else if(req.url.match("\.js$")){
                let jsPath = path.join(__dirname, '../../' ,req.url);
                let fileStream = fs.createReadStream(jsPath, "UTF-8");
                res.writeHead(200, {"Content-Type": "application/javascript"});
                fileStream.pipe(res);
        } else {
            let hash = req.url.substring(1);
            LINKS.find(item => item.hash === hash) ? (
                res.writeHead(303, { Location: LINKS.find(item => item.hash === hash).longUrl }),
                res.end()
            ) : (
                res.writeHead(404, {"Content-Type": "text/html"}),
                res.end("No Page Found")
            );

        }
    }
    else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end();
    }
}).listen(port, () => {
    console.log(`Server running`)
});

function processPost(req, res, callback) {
    let queryData = '';
    let shortUrl = '';
    let data = '';

    req.on('data', (data) => {
        queryData += data;
    });

    req.on('end', () => {
        data = JSON.parse(queryData);
        shortUrl = getShortUrl(data.hash);

        saveLink(data.longUrl, data.hash);

        req.post = data;
        callback(shortUrl);
    });
}

function getShortUrl(data) {
    return `${hostname}:${port}/` + data
}

let LINKS = [];

function saveLink(longUrl, shortUrl) {
    LINKS.push({
        longUrl: longUrl,
        hash: shortUrl
    });
}