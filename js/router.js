const app = document.getElementById('app');

function prefetch(pathname) {
    const route = routes.find(route => route.path === pathname);

    if (route.shouldPrefetch && !route.prefetched) {
        fetch(route.file, {
            cache: 'reload'
        });
        route.prefetched = true;
    }
}

function lazyLoad() {
    const images = document.querySelectorAll('.zoomable');

    let observer = new IntersectionObserver(onIntersection);
    images.forEach(image => {
        observer.observe(image);
    });

    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                observer.unobserve(entry.target);
                const img = entry.target;
                img.classList.remove('fixedSize')
                const src = img.getAttribute('data-src');

                img.setAttribute('src', src);
            }
        });
    }
}



function scrollToTop() {
    app.scrollIntoView({
        behavior: 'smooth'
    });
    const pathname = window.location.hash.substring(1);
    history.replaceState(null, null, document.location.pathname + '#' + pathname.split('_')[0]);
}

window.onload = function () {
    const pathname = window.location.hash.substring(1);
    const initalRoute = routes.find(route => route.initial);
    const route = routes.find(route => route.path === pathname)

    if (pathname === '' || !route) {
        window.location.hash = initalRoute.path;
    } else {
        window.onhashchange();
    }
}

function saveCheckboxState() {
    var saveScroll = document.getElementById("saveScroll");
    if (typeof (Storage) !== "undefined") {
        if (saveScroll.checked == true) {
            localStorage.setItem('checkbox', "true")
        } else {
            localStorage.setItem('checkbox', "false")
        }
    }
}

function handleSaveScroll() {
    if (typeof (Storage) !== "undefined") {
        let checkbox = document.getElementById("saveScroll");
        if (localStorage.getItem('checkbox') == "true") {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        if (checkbox.checked == true) {
            let getOffset = localStorage.getItem("scroll")
            if (getOffset > 0) {
                window.scroll(0, getOffset);
            } else {
                let offset = window.pageYOffset || document.documentElement.scrollTop;
                localStorage.setItem("scroll", offset);
            }
        }
    }
}

window.onscroll = function () { 
    if (window.location.hash.substring(1).includes('touren')) {
        let checkbox = document.getElementById("saveScroll");
        if (checkbox.checked == true) {
            let offset = window.pageYOffset || document.documentElement.scrollTop;
            localStorage.setItem("scroll", offset);
        }
    }
}



window.onhashchange = async function () {
    const pathname = window.location.hash.substring(1);
    if (pathname.includes('touren')) {
        if (pathname.includes('_')) {
            let element = document.getElementById(pathname.split('_')[1]);
            element.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            const route = routes.find(route => route.path === pathname);
            const res = await fetch(route.file, {
                cache: "force-cache"
            });
            anime({
                targets: '#app',
                opacity: 0,
                easing: 'easeInOutCirc',
                duration: 700,
                complete: async function () {
                    app.innerHTML = await res.text();
                    lazyLoad();
                    handleSaveScroll();
                    anime({
                        targets: '#app',
                        opacity: 1,
                        easing: 'easeInOutCirc',
                        duration: 700,
                    });
                }
            });
        }
    } else {
        const route = routes.find(route => route.path === pathname);
        const res = await fetch(route.file, {
            cache: "force-cache"
        });
        anime({
            targets: '#app',
            opacity: 0,
            easing: 'easeInOutCirc',
            duration: 700,
            complete: async function () {
                app.innerHTML = await res.text();
                lazyLoad();
                anime({
                    targets: '#app',
                    opacity: 1,
                    easing: 'easeInOutCirc',
                    duration: 700,
                });
            }
        });
    }
}