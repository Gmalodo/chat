// import * as cv from 'opencv4nodejs'
// import {VideoCapture} from "opencv4nodejs";
import * as M from "@math.gl/core"
import {exec, execSync} from "child_process";
import fs from "fs";
const PiCamera = require('pi-camera');
// import puppeteer from "puppeteer";
export class serverCommand {
    // private static cap: VideoCapture;

    static setupCam(socket) {
        // this.cap = new cv.VideoCapture(0)
        // this.cap.set(3, 620)
        // this.cap.set(4, 480)

        // setInterval(() => {
        //     let frame = this.cap.read()
        //     let image = cv.imencode(".jpg", frame).toString("base64")
        //     socket.emit('newImage', image)
        // }, 1000 / 10)

        // exec("sudo ffmpeg -y -f v4l2 -video_size 640x480 -i /dev/video0 -r 0.2 -qscale:v 2 -update 1 ./dist/public/webcam/video1.mp4")
        // let timer = 0
        // setInterval(() => {
        //     exec("sudo ffmpeg -y -f v4l2 -video_size 640x480 -i /dev/video0 -r 0.2 -qscale:v 2 -update 1 ./dist/public/webcam/video1.mp4")
        //     // exec("sudo streamer -f jpeg -o ./dist/public/webcam/image.jpeg")
        //     timer = timer + 1000
        //     exec("sudo ffmpeg -loop 1 -i ./dist/public/webcam/image.jpeg -c:v libx264 -t "+  +" -pix_fmt yuv420p ./dist/public/webcam/video.mp4")
        // }, 1000)


        // const Webcam = NodeWebcam.create({
        //     width: 640,
        //     height: 480,
        //     quality: 100,
        //     frames: 1,
        //     delay: 0,
        //     saveShots: true,
        //     output: "png",
        //     device: false,
        //     callbackReturn: "base64",
        //     verbose: false
        // });
        const myCamera = new PiCamera({
            mode: 'photo',
            output: `./dist/public/webcam/test.jpg`,
            width: 640,
            height: 480,
            nopreview: true,
        });


        setInterval(() => {
            myCamera.snap()
            .then((result) => {
                const data = fs.readFileSync("./dist/public/webcam/test.jpg", {encoding: 'base64'});
                socket.emit("tienvoilalaphoto", data)
            })
            .catch((err) => console.log(err))
        }, 1000)

        socket.on("handsPosition", (hands) => {
            console.log(hands)
            if (hands["multiHandLandmarks"][0] !== undefined) {
                let poucePosition = new M.Vector3(
                    Math.round(hands["multiHandLandmarks"][0][4]["x"] * 100),
                    Math.round(hands["multiHandLandmarks"][0][4]["y"] * 100),
                    Math.round(hands["multiHandLandmarks"][0][4]["z"] * 100))
                let indexPosition = new M.Vector3(
                    Math.round(hands["multiHandLandmarks"][0][8]["x"] * 100),
                    Math.round(hands["multiHandLandmarks"][0][8]["y"] * 100),
                    Math.round(hands["multiHandLandmarks"][0][8]["z"] * 100))

                let volume = Math.round(poucePosition.distance(indexPosition)*4)
                if (volume < 5){volume = 0}
                else if (volume > 100){volume = 100}

                console.log(volume)
                exec(`amixer sset 'Master' ${volume}%`)
            }
        })
    }
}