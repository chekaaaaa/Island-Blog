const zoomel = document.getElementById("zoomel")
const imgWrapper = document.getElementById("imgWrapper")
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
    imgWrapper.style.backgroundImage = 'url(' + path + ')';
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
    imgWrapper.classList.remove('fullSize');
    if (!(event.path[0].id === 'imgWrapper')) {
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

imgWrapper.addEventListener('click', function (event) {
    info.classList.toggle('moveRight');
    imgWrapper.classList.toggle('fullSize');
    event.stopPropagation();
})