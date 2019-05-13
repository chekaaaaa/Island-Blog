let app = document.getElementById("app");

window.onload = function () {
    goToInitialRoute();
}

window.onhashchange = function() { 
    let pathname = window.location.hash;
    goToRoute(pathname)
}

function goToInitialRoute() {
    for(route of routes)
    {
        if(route.initial == true) {
            fetchPageAndDisplay(route.file)
        }
    }
}

async function goToRoute(path) {
    path = path.substring(1);
    for(route of routes)
    {
        if(route.path == path){
            fetchPageAndDisplay(route.file)
        }
    }
}

function fetchPageAndDisplay(file){
    fetch(file).then(function(response) {
        return response.text().then(function(text) {
          app.innerHTML = text;
        });
      });
}