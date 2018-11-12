var express = require("express"),
    http = require("http"),
    app = express();
const openfinConfigBuilder = require('openfin-config-builder');
const openfinLauncher = require('openfin-launcher');
const path = require('path');
const port = 3000;

let target;
const configPath = path.resolve('public/config/app.json');
target = `http://localhost:${ port }`;

//Update our config and launch openfin.
function launchOpenFin() {
    openfinConfigBuilder.update({
        startup_app: {
            url: target + '/index.html',
            applicationIcon: target + '/favicon.ico'
        },
        shortcut: {
            icon: target + '/favicon.ico'
        }
    }, configPath)
        .then(openfinLauncher.launchOpenFin({ configPath: configPath }))
        .catch(err => console.log(err));
}

http.createServer(app).listen(port);
    
app.use(express.static(__dirname + "/public"));

app.get("/appUrl", function(req, res){

    var appUrl;
    if(req.query.url.startsWith("http://") || req.query.url.startsWith("https://")){
        appUrl = req.query.url;
    }else{
        appUrl = "http://" + req.query.url;
    }

    const manifest = 
    {
        startup_app: {
            name:  req.query.url + random(),
            description: req.query.url,
            url: appUrl,
            uuid: req.query.url + random(),
            autoShow: true
        },
        runtime: {
            version: "stable"
        },
        shortcut: {
            company: "OpenFin",
            description: "Openfin POC",
            name: "Openfin POC"
        }
    };

    function random() {
        return "" + Math.random() * 1000;
    }

    console.log("get: " + req.query);
    res.send(manifest);
});

launchOpenFin();