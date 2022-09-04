const camSocket = io.connect('/')
const img = document.querySelector("img")

const frame = new Image()
frame.crossOrigin = "anonymous"
frame.height = 480
frame.width = 640


const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
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
    canvasCtx.save();
})

hands.onResults((results) => {
    if (results["multiHandLandmarks"][0] !== undefined) {
        camSocket.emit("handsPosition", results)
    }

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                {color: '#00FF00', lineWidth: 0.5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 0.1});
        }
    }
    canvasCtx.restore();

})