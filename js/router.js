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

function slideshows() {
    let slideshows = document.querySelectorAll('.slideshow');
    for (let i = 0; i < slideshows.length; i++) {
        let imgArray = slideshows[i].children;
        imgArray[0].style.opacity = 1;
        for (let i = 1; i < imgArray.length; i++) {
            imgArray[i].style.display = "none";
        }
    }
    setInterval(function () {
            let slideshows = document.querySelectorAll('.slideshow');
            for (let i = 0; i < slideshows.length; i++) {
                let imgArray = slideshows[i].children;
                let currentImg;
                for (let i = 0; i < imgArray.length; i++) {
                    if (imgArray[i].style.display !== "none") {
                        currentImg = i
                    }
                }
                let animatingOut = currentImg
                anime({
                        targets: imgArray[animatingOut],
                        opacity: 0,
                        translateX: -80,
                        easing: 'easeInOutCirc',
                        duration: 700,
                        complete: function () {
                            imgArray[animatingOut].style.display = "none";
                            imgArray[animatingOut].style.transform = "translate(0)";
                            }
                        });
                        currentImg++;
                    if (currentImg === imgArray.length) {
                        currentImg = 0;
                    }
                    imgArray[currentImg].style.display = "block"; anime({
                        targets: imgArray[currentImg],
                        opacity: 1,
                        translateX: [{
                                value: 80,
                                duration: 1
                            },
                            {
                                value: 0,
                                duration: 699
                            }
                        ],
                        easing: 'easeInOutCirc',
                        duration: 700,
                    });



                }
            }, 3200);
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

    window.onhashchange = async function () {
        const pathname = window.location.hash.substring(1);
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
                    slideshows();
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