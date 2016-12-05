var http = require("http");
var url = require("url");
var manejadorArticulos = require('./manejadorArticulos');
var mu = require('mu2');
var server = http.createServer();
var fs = require('fs');
var express = require("express");
var app = express();
mu.root = __dirname + '/public';
var page = {};

app.get('/', function (req, res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var noticias = manejadorArticulos.imprimirNoticias();
    var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: noticias});
    stream.pipe(res);
});

app.get('/index.html', function (req, res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var noticias = manejadorArticulos.imprimirNoticias();
    var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: noticias});
    stream.pipe(res);

});

app.get('/post/:id', function (req, res) {
    mu.clearCache();
    var post = req.params.id;
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var articulo = manejadorArticulos.imprimirArticulo(post);
    var stream = mu.compileAndRender('single.html', {title: "Reddit" ,contenido: articulo.contenido, imagen: articulo.imagen});
    stream.pipe(res);
    return;
});

app.use("/css",express.static(__dirname + '/public/css'));
app.use("/scss",express.static(__dirname + '/public/scss'));
app.use("/img",express.static(__dirname + '/public/images'));
app.use("/js",express.static(__dirname + '/public/js'));
app.use(express.static(__dirname +  '/public'));




app.use(function(req, res, next){
    res.status(404);

    if (req.accepts('html')) {
        mu.clearCache();
        page.title = 'Reddit - Curso - Dinamico';
        page.description = '';
        // var stream = mu.compileAndRender('index.html', {page: page, nombre: "Jonathan", noticias: noticiasService.get()});
        var stream = mu.compileAndRender('404.html', {title: "Reddit"});
        stream.pipe(res);
        return;
    }

});


app.listen(process.env.PORT || 3000);


/*
server.on ("request", function (req, res) {
    var urlData = url.parse(req.url, true);
    var path = urlData.pathname;
    if(path == '/' || path == '/index.html') {
        //WORK WITH MUSTACHE
        mu.clearCache();
        page.title = 'Reddit - Curso - Dinamico';
        page.description = '';
        var noticias = manejadorArticulos.imprimirNoticias();
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

server.listen(process.env.PORT || 3000);*/
