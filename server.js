"use strict";

const http = require("http");
const fs = require("fs");

const host="localhost";
const port=8080;

const myServer = http.createServer((req, res) => {

    if(req.url==="/"){
        fs.readFile("./front/index.html", (error, data)  => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        })
    }
    else if(req.url==="/css/styles.css") {
        fs.readFile("./front/css/styles.css", (error, data) => {
            console.log("DATA", data)
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(data);
            res.end();
        })
    }

    else if(req.url==="/js/main.js") {
        fs.readFile("./front/js/main.js", (error, data) => {
            console.log("DATA", data)
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(data);
            res.end();
        })
    }
        


})

myServer.listen(port, host, () => {
    console.log("conectado en:",port, host);
})
