const zoomel = document.getElementById("zoomel")
const zoomedImg = document.getElementById("zoomedImg")
const info = document.getElementById("info")

document.addEventListener('click', function (event) {
    if (event.path[0].classList.contains('zoomable')) {
        openImgZoom(event.path[0])
    }
})

function openImgZoom(img) {
    let path = img.src
    path = path.replace('.jpg', '_high.jpg');
    zoomel.style.visibility = "visible";
    anime({
        targets: zoomel,
        opacity: 1,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 500,
    });
    zoomedImg.src = path;
    EXIF.getData(img, function () {
        let date = EXIF.getTag(this, "DateTimeOriginal");
        let iso = EXIF.getTag(this, "ISOSpeedRatings");
        let Brennweite = EXIF.getTag(this, "FocalLengthIn35mmFilm");
        let exposure = EXIF.getTag(this, "ExposureTime");
        let aperture = EXIF.getTag(this, "ApertureValue");
        info.innerHTML = `<h2>Bild Informationen</h2><br>
                             Datum: ${date} <br>
                             Iso: ${iso} <br>
                             Brennweite: ${Brennweite}mm <br>
                             Belichtungszeit: ${exposure.toFixed(4)}s <br>
                             Blende: ${aperture} `

    });

}

zoomel.addEventListener('click', function (event) {
    zoomedImg.classList.remove('fullSize');
    info.classList.remove('moveRight');
    if (!(event.path[0].id === 'zoomedImg')) {
        anime({
            targets: zoomel,
            opacity: 0,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: 500,
            complete: function () {
                zoomel.style.visibility = "hidden";
            }
        });
    }
    event.stopPropagation();
})

zoomedImg.addEventListener('click', function (event) {
    info.classList.toggle('moveRight');
    zoomedImg.classList.toggle('fullSize');
    event.stopPropagation();
})