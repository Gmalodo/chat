const camSocket = io.connect('/')
const img = document.querySelector("img")

const frame = new Image()
frame.crossOrigin = "anonymous"
frame.height = 480
frame.width = 640

const page = document.querySelector(".page")
let hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
camSocket.on('newImage', (image) => {
    frame.src = 'data:image/jpeg;base64, ' + image
    hands.send({image: frame})
    img.src = frame.src
    page.appendChild(img)
})

hands.onResults((results) => {
    console.log(results)
    if (results["multiHandLandmarks"][0] !== undefined) {
        camSocket.emit("handsPosition", results)
    }
})