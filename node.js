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
var _ = require('underscore');
var request = require('request')
body = require('body-parser');
app.use(body.json());
app.use(body.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', function (req, res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var noticias = manejadorArticulos.imprimirNoticias();
    var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: _.values(noticias)});
    stream.pipe(res);
});

app.get('/newArticulo',function (req,res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var stream = mu.compileAndRender('formularioArticulo.html', {title: "Reddit"});
    stream.pipe(res);
});

app.get('/delArticulo/:id', function (req, res) {
    mu.clearCache();
    var idborrar = req.params.id;
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    manejadorArticulos.borrarArticulos(idborrar);
    var noticias = manejadorArticulos.imprimirNoticias();
    res.redirect('/');
});

app.post("/postArticulo",function(req,res){
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var nuevoArticulo = JSON.stringify(req.body);
    console.log(nuevoArticulo);
    manejadorArticulos.nuevoArticulo(req.body);
    var noticias = manejadorArticulos.imprimirNoticias();
    var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: _.values(noticias)});
    stream.pipe(res);
});

app.post("/newComment/:id",function(req,res){
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var nuevoComentario = JSON.stringify(req.body);
    console.log(nuevoComentario);
    var idPost = req.params.id;
    console.log(idPost);
    manejadorArticulos.nuevoComentario(req.body,idPost);
    res.redirect('/post/'+idPost);
});

app.get('/index.html', function (req, res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var noticias = manejadorArticulos.imprimirNoticias();
    var stream = mu.compileAndRender('index.html', {title: "Reddit", noticias: _.values(noticias)});
    stream.pipe(res);

});

app.get('/post/ultimo', function (req, res) {
    mu.clearCache();
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var articulo = manejadorArticulos.imprimirUltimo();
    var stream = mu.compileAndRender('single.html', {title: "Reddit" ,contenido: articulo.contenido, imagen: articulo.imagen,id:articulo.id,listcomentarios: _.values(articulo.comentarios)});
    stream.pipe(res);
    return;
});



app.get('/post/:id', function (req, res) {
    mu.clearCache();
    var post = req.params.id;
    page.title = 'Reddit - Curso - Dinamico';
    page.description = '';
    var articulo = manejadorArticulos.imprimirArticulo(post);
    var stream = mu.compileAndRender('single.html', {title: "Reddit" ,contenido: articulo.contenido, imagen: articulo.imagen, id:articulo.id, listcomentarios: _.values(articulo.comentarios)});
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