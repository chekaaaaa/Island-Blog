const zoomel = document.getElementById("zoomel")
const imgWrapper = document.getElementById("imgWrapper")
const info = document.getElementById("info")

document.addEventListener('click', function (event) {
    if (event.path[0].classList.contains('zoomable')) {
        openImgZoom(event.path[0])
    }
})

zoomel.addEventListener('click', function () {
    anime({
        targets: zoomel,
        opacity: 0,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 600,
        complete: function () {
            zoomel.style.visibility = "hidden";
        }
    });

})

function openImgZoom(img) {
    let path = img.src
    zoomel.style.visibility = "visible";
    anime({
        targets: zoomel,
        opacity: 1,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 600,
    });
    imgWrapper.style.backgroundImage = 'url(' + path + ')';
}