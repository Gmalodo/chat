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
    frame.src = 'data:image/jpeg;base64, ' + image
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
//
// {
//     "name": "chat",
//     "version": "1.0.0",
//     "description": "",
//     "main": "serevr.js",
//     "type": "module",
//     "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//         "dev": "concurrently -k -n \"Typescript,Node\" -p \"[{name}]\" -c \"blue,green\" \"tsc --watch\" \"nodemon ./dist/server.js\"",
//         "start": "./dist/server.js"
// },
//     "keywords": [],
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//     "@math.gl/core": "^3.6.3",
//         "@mediapipe/drawing_utils": "^0.3.1620248257",
//         "@mediapipe/hands": "^0.4.1646424915",
//         "@types/socket.io-client": "^3.0.0",
//         "body-parser": "^1.20.0",
//         "concurrently": "^7.3.0",
//         "dotenv": "^16.0.1",
//         "ejs": "^3.1.8",
//         "express": "^4.18.1",
//         "express-session": "^1.17.3",
//         "mongoose": "^6.5.1",
//         "node-audio-volume-mixer": "^1.0.3",
//         "node-webcam": "^0.8.1",
//         "nodemon": "^2.0.19",
//         "opencv-build": "^0.1.9",
//         "peer": "^0.6.1",
//         "puppeteer": "^17.1.1",
//         "socket.io": "^4.5.1",
//         "socket.io-client": "^4.5.1",
//         "typescript": "^4.7.4",
//         "yargs": "^17.5.1"
// },
//     "devDependencies": {
//     "@typegoose/typegoose": "^9.11.0",
//         "@types/express": "^4.17.13",
//         "@types/node": "^18.6.5",
//         "@types/yargs": "^17.0.11"
// }
// }





