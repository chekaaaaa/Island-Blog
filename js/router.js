let app = document.getElementById("app");



function prefetch(pathname) {
    for (route of routes) {
        if (route.path == pathname) {
            if (route.prefetched == true) {
                fetch(route.file, {cache: "reload"});
                route.prefetched = false;
            }
        }
    }
}

window.onload = function () {
    let pathname = window.location.hash;
    pathname = pathname.substring(1)
    if (pathname == "") {
        for (route of routes) {
            if (route.initial == true) {
                window.location.hash = route.path;
            }
        }
    } else {
        let routeIsAvailable = false
        for (route of routes) {
            if (route.path == pathname) {
                window.onhashchange()
                routeIsAvailable = true;
            }
        }
        if (routeIsAvailable == false) {
            for (route of routes) {
                if (route.initial == true) {
                    window.location.hash = route.path;
                }
            }
        }
    }
}

window.onhashchange = function () {
    let path = window.location.hash;
    path = path.substring(1);
    for (route of routes) {
        if (route.path === path) {
            fetch(route.file, {cache: "force-cache"}).then(function (response) {
                return response.text().then(function (text) {
                    app.innerHTML = text;
                });
            });
        }
    }
}

