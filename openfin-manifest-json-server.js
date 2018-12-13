var express = require("express"),
    http = require("http"),
    app = express(),
    path = require("path");
    port = 3000;

// Setup Routes for the preload
app.use(express.static(__dirname + '/topBarImages'));
app.use(express.static(__dirname + '/preload'));

http.createServer(app).listen(port);

app.get("/appUrl", function(req, res){
    var manifest = buildManifest(req.query);
    res.send(manifest);
});

function buildManifest(query){
    // build the url, add the http:// if a protocol has not been provided
    var appUrl;
    var runtimeVersion = "stable";
    if(query.url.startsWith("http://") || query.url.startsWith("https://")){
        appUrl = query.url;
    }else{
        appUrl = "http://" + query.url;
    }

    if(query.runtimeVersion != null){
        runtimeVersion = query.runtimeVersion;
    }

    // Manifest b
    var manifest = 
    {
        startup_app: {
            name:  query.url + random(),
            description: query.url,
            url: appUrl,
            uuid: query.url + random(),
            autoShow: true
        },
        runtime: {
            version: runtimeVersion
        }
    };

    // Frame options - Static Top Bar preload added only if the fr
    if(query.frame === "false"){
        manifest.startup_app.frame = false;
    };
    //
    if(query.topBar === "true"){
        manifest.startup_app.preloadScripts = [{url: "http://localhost:3000/topBarPreload.js"}]
    }

    if(query.servicesLayouts === "true"){
        manifest.services = [{"name": "layouts"}];
    }
    console.log("opacity: " + query.opacity + " " + isNaN(query.opacity));
    if(!isNaN(query.opacity)){
        manifest.startup_app.opacity = parseFloat(query.opacity);
    }
    console.log(manifest);
    return manifest;
};

function random() {
    return "" + Math.random() * 1000;
};