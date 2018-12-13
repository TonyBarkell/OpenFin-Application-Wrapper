var frameInput                  = buildCheckboxInput("Frame:", "frameOption", "frameOption", true);
var topbarInput                 = buildCheckboxInput("Top Bar:", "topbar", "topbar", false);
var layoutServiceInput          = buildCheckboxInput("Layout Service:", "servicesLayouts", "servicesLayouts", false);
var opacityInput                = buildNumberInput("Opacity:", "opacity", 0.0, 1.0, 0.1, 1.0);

buildSection("Startup App Controls", "Startup-App-Options", [frameInput, opacityInput]);
buildSection("Services", "Services-Options", [layoutServiceInput]);
buildSection("Pre-load Scripts", "Preload-Options", [topbarInput]);

function buildSection(buttonText, optionsId, inputs){
    var container = document.createElement("div");
    var button = buildOptionButton(buttonText);
    container.appendChild(button);
    button.addEventListener("click", function(){
        setActiveControl(optionsId);
    });
    var options = buildOptionsContainer(optionsId, inputs);
    container.appendChild(options);
    document.getElementById("Options-Container").appendChild(container);
}

function setActiveControl(controlDiv){
    var classes = document.getElementById(controlDiv).classList;
    var hidden = false;
    classes.forEach(function(item){
        if(item === "Hidden"){
            hidden = true;
        };
    });
    if(hidden === true){
        classes.remove("Hidden");
    }else{
        classes.add("Hidden");
    };
}

function buildOptionButton(text){
    container = document.createElement("div");
    container.classList.add("Option-Button");
    label = document.createElement("p").appendChild(document.createTextNode("+ " + text));
    container.appendChild(label);

    return container;
};

function buildOptionsContainer(id, inputs){
    optionContainer = document.createElement("div");
    optionContainer.id = id;
    optionContainer.classList.add("Hidden");
    optionContainer.classList.add("Option-Area");
    inputs.forEach(function(element){
        optionContainer.appendChild(element);
    });
    return optionContainer;
};

function buildCheckboxInput(text, id, value, checked){
    thisOptionContainer = document.createElement("div");
    label = document.createElement("p").appendChild(document.createTextNode(text));
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("Input-Option");
    checkbox.id = id;
    checkbox.value = value;
    if(checked){
        checkbox.checked = true;
    }
    thisOptionContainer.appendChild(label);
    thisOptionContainer.appendChild(checkbox);
    return thisOptionContainer;
};

function buildNumberInput(text, id, min, max, step, value){
    thisOptionContainer = document.createElement("div");
    label = document.createElement("p").appendChild(document.createTextNode(text));
    var numberbox = document.createElement("input");
    numberbox.type = "number";
    numberbox.id = id;
    numberbox.min = min;
    numberbox.max = max;
    numberbox.step = step;
    numberbox.value = value;
    thisOptionContainer.appendChild(label);
    thisOptionContainer.appendChild(numberbox);
    return thisOptionContainer;
};

document.getElementById("urlInput").addEventListener("keypress", function(key){
    if(event.keyCode === 13) {
        openUrl();
    }
});

function minimiseWindow(){
    var finWindow = fin.desktop.Window.getCurrent();
    finWindow.minimize();
}

function closeWindow(){
    var finWindow = fin.desktop.Window.getCurrent();
    finWindow.close();
}

function openUrl(){
    queryString = buildQueryString();
    console.log("Querery string: " + queryString );

    fin.desktop.Application.createFromManifest("https://2eu6h6ru93.execute-api.us-east-1.amazonaws.com/beta" + queryString, function(app) {
        app.run();
    }, function(error) {
        console.error('Failed to create app from manifest: ', error);
    });
}

function buildQueryString(){
    var randomNo = random();
    // setup the query string wind mandatory values:
    // Mandatory: app URL
    var queryString = "?";
    // build the startup app url, add the http:// if a protocol has not been provided
    var url = document.getElementById("urlInput").value;
    var appUrl;
    if(url.startsWith("http://") || url.startsWith("https://")){
        appUrl = url;
    }else{
        appUrl = "http://" + url;
    }
    queryString += "url=" + appUrl;

    // Mandatory: Name and UUID - use the URL and add a Random number (so duplicates can be created)
    queryString += "&name=" + appUrl + randomNo;
    queryString += "&uuid=" + appUrl + randomNo;

    // Mandatory: Default to the Stable runtime
    queryString += "&runtimeVersion=stable";

    // Default to Auto Show
    queryString += "&autoShow=true";

    // Set the frame options
    if(document.getElementById("frameOption").checked){
        queryString += "&frame=true";
    }else{
        queryString += "&frame=false";
        if(document.getElementById("topbar").checked){
            queryString += "&topBar=true";
        }
    }

    if(document.getElementById("servicesLayouts").checked){
        queryString += "&servicesLayouts=true";
    }
    console.log(document.getElementById("opacity").value + " " + isNaN(document.getElementById("opacity").value));
    if(isNaN(document.getElementById("opacity"))){
        queryString += "&opacity=" + document.getElementById("opacity").value;
    }
    return queryString;
}

function random() {
    return "" + Math.random() * 1000;
}

