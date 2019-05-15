const app = document.getElementById('app');

function prefetch(pathname) {
    const route = routes.find(route => route.path === pathname);

    if (route.shouldPrefetch && !route.prefetched) {
        fetch(route.file, { cache: 'reload' });
        route.prefetched = true;
    }
}

window.onload = function () {
    const pathname = window.location.hash.substring(1);
    const initalRoute = routes.find(route => route.initial);
    const route = routes.find(route => route.path === pathname)

    if (pathname === '' || !route) {
        window.location.hash = initalRoute.path;
    }
    else {
        window.onhashchange();
    }
}

window.onhashchange = async function () {
    const pathname = window.location.hash.substring(1);
    const route = routes.find(route => route.path === pathname);
    const res = await fetch(route.file, { cache: "force-cache" });
    app.innerHTML = await res.text();
}

