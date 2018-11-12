function minimiseWindow(){
    var finWindow = fin.desktop.Window.getCurrent();
    finWindow.minimize();
}

function closeWindow(){
    var finWindow = fin.desktop.Window.getCurrent();
    finWindow.close();
}

function openUrl(){
    var manifestUrl = document.getElementById("appUrl").value;

    fin.desktop.Application.createFromManifest("http://localhost:3000/appUrl?url=" + manifestUrl, function(app) {
        app.run();
    }, function(error) {
        console.error('Failed to create app from manifest: ', error);
    });
}

