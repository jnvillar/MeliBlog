var http = require("http");
var url = require("url");
var noticiasService = require('./manejadorArticulos');
var mu = require('mu2');
var server = http.createServer();
var fs = require('fs');

var express = require("express");
var app = express();



mu.root = __dirname + '/public';
// mu.root = __dirname;

var page = {};

server.on ("request", function (req, res) {

    var urlData = url.parse(req.url, true);
    var path = urlData.pathname;

    // if(path == '/' || path == '/noticias') {
    if(path == '/' || path == '/index.html') {
        //WORK WITH MUSTACHE

        mu.clearCache();

        page.title = 'Reddit - Curso - Dinamico';
        page.description = '';
        var noticias = noticiasService.get();
        // var stream = mu.compileAndRender('index.html', {page: page, nombre: "Jonathan", noticias: noticiasService.get()});
        var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: noticias});

        stream.pipe(res);
    }
    else{
        //Trabajo como antes

        var filePath= "public"+path;
        fs.exists(filePath,function(exists) {
            if (exists) {
                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        if (path == "/") {
                            filePath = "public/index.html";
                            fs.readFile(filePath, function (err, data) {
                                res.end(data);
                            })
                        }
                    } else {
                        res.end(data);
                    }
                })
            } else {
                res.writeHead(404);
                res.end("No existe");
            }
        })
    }
});


server.listen(process.env.PORT || 3000);