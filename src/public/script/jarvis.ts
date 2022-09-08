const camSocket = io.connect('/', { reconnect: true })

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

camSocket.on("tienvoilalaphoto", (image) => {
    const frame = new Image()
    frame.crossOrigin = "anonymous"
    frame.width = 640
    frame.height = 480
    frame.src = image
    hands.send({image: frame})
    canvasCtx.save();
})


hands.onResults((results) => {
    if (results["multiHandLandmarks"][0] !== undefined) {
        camSocket.emit("handsPosition", results)
    }
    //
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    // if (results.multiHandLandmarks) {
    //     for (const landmarks of results.multiHandLandmarks) {
    //         drawConnectors(
    //             canvasCtx,
    //             landmarks,
    //             HAND_CONNECTIONS,
    //             {
    //                 color: '#00FF00',
    //                 lineWidth: 0.5
    //             })
    //         drawLandmarks(
    //             canvasCtx,
    //             landmarks,
    //             {
    //                 color: '#FF0000',
    //                 lineWidth: 0.1
    //             })
    //     }
    // }
    // canvasCtx.restore()
})