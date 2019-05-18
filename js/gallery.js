const zoomel = document.getElementById("zoomel")
const imgWrapper = document.getElementById("imgWrapper")
const info = document.getElementById("info")
let scrolled = window.pageYOffset || document.documentElement.scrollTop;


document.addEventListener('click', function (event) {
    if (event.path[0].classList.contains('zoomable')) {
        openImgZoom(event.path[0])
    }
})

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

imgWrapper.addEventListener('click', function(event) {
    imgWrapper.classList.toggle('fullSize');
    event.stopPropagation();
})

function openImgZoom(img) {
    let path = img.src
    zoomel.style.visibility = "visible";
    scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('noScroll');
    anime({
        targets: zoomel,
        opacity: 1,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 600,
    });
    imgWrapper.style.backgroundImage = 'url(' + path + ')';
    EXIF.getData(img, function() {
        var allMetaData = EXIF.getAllTags(this);
        console.log(allMetaData);
        info.innerHTML = `<h2>Bild Informationen</h2><br>
                             Datum: ${allMetaData.DateTimeOriginal} <br>
                             Iso: ${allMetaData.ISOSpeedRatings} <br>
                             Brennweite: ${allMetaData.FocalLength}mm <br>
                             Belichtungszeit: ${allMetaData.ExposureTime.toFixed(4)}s <br>
                             Blende: ${allMetaData.ApertureValue} `
    });
}