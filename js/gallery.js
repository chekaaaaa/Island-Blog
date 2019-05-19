const zoomel = document.getElementById("zoomel")
const imgWrapper = document.getElementById("imgWrapper")
const info = document.getElementById("info")
let scrolled = window.pageYOffset || document.documentElement.scrollTop;


document.addEventListener('click', function (event) {
    if (event.path[0].classList.contains('zoomable')) {
        openImgZoom(event.path[0])
    }
})

function openImgZoom(img) {
    let path = img.src
    path = path.replace('.jpg', '_high.jpg');
    console.log(path)
    zoomel.style.visibility = "visible";
    scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('noScroll');
    anime({
        targets: zoomel,
        opacity: 1,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 600,
    });
    var imgHighRes = new Image();
    imgHighRes.onload = function () {
        imgWrapper.style.backgroundImage = 'url(' + path + ')';
        EXIF.getData(imgHighRes, function () {
            var date = EXIF.getTag(this, "DateTimeOriginal");
            var iso = EXIF.getTag(this, "ISOSpeedRatings");
            var Brennweite = EXIF.getTag(this, "FocalLengthIn35mmFilm");
            var exposure = EXIF.getTag(this, "ExposureTime");
            var aperture = EXIF.getTag(this, "ApertureValue");
            info.innerHTML = `<h2>Bild Informationen</h2><br>
                             Datum: ${date} <br>
                             Iso: ${iso} <br>
                             Brennweite: ${Brennweite}mm <br>
                             Belichtungszeit: ${exposure.toFixed(4)}s <br>
                             Blende: ${aperture} `
        });
    };
    imgHighRes.src = path;
}

zoomel.addEventListener('click', function (event) {
    imgWrapper.classList.remove('fullSize');
    if (!(event.path[0].id === 'imgWrapper')) {
        anime({
            targets: zoomel,
            opacity: 0,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: 600,
            complete: function () {
                zoomel.style.visibility = "hidden";
                document.body.classList.remove('noScroll')
                document.documentElement.scrollTop = scrolled;
            }
        });
    }
    event.stopPropagation();
})



imgWrapper.addEventListener('click', function (event) {
    info.classList.toggle('moveRight');
    imgWrapper.classList.toggle('fullSize');
    event.stopPropagation();
})