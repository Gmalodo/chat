const camSocket = io.connect('/', { reconnect: true })

const frame = new Image()
frame.crossOrigin = "anonymous"
frame.height = 480
frame.width = 640

let hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
})

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
})

let canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

setInterval(() => {
    console.log("image envoyer")
    frame.src = "http://localhost:8081"
    hands.send({image: frame})
    canvasCtx.save();
}, 1000)

hands.onResults((results) => {
    console.log("main recue")
    if (results["multiHandLandmarks"][0] !== undefined) {
        camSocket.emit("handsPosition", results)
    }
})
