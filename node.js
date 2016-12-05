var fs = require('fs');
var http = require("http");
var server = http.createServer();
var url = require("url");
var ipVisitan = {}


server.on("request", function(req,res){
    var urlData=url.parse(req.url);
    var path = urlData.pathname;
    var filePath= "public"+path;
    var ip = req.connection.remoteAddress;

    ipVisitan[ip] = 0;
    console.log(ipVisitan);

    //res.end(ip);
    fs.exists(filePath,function(exists){
        if(exists){
            fs.readFile(filePath, function(err,data){
                if (err){
                    res.writeHead(500);
                    if (path=="/"){
                        filePath = "public/index.html";
                        fs.readFile(filePath, function(err,data){
                                res.end(data);
                        })
                    }
                }else{
                    res.end(data);
                }
            })
        }else {
            res.writeHead(404);
            filePath = "public/404.html";
            fs.readFile(filePath, function(err,data){
                res.end(data);
            })

        }
    });
});



server.listen(process.env.PORT || 3000);