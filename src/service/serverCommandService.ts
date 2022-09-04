import * as cv from 'opencv4nodejs'
import {VideoCapture} from "opencv4nodejs";
import * as M from "@math.gl/core"
import {exec} from "child_process";
export class serverCommand {
    private static cap: VideoCapture;

    static setupCam(socket) {
        this.cap = new cv.VideoCapture(0)
        this.cap.set(3, 620)
        this.cap.set(4, 480)

        setInterval(() => {
            let frame = this.cap.read()
            let image = cv.imencode(".jpg", frame).toString("base64")
            socket.emit('newImage', image)
        }, 1000 / 10)

        socket.on("handsPosition", (hands) => {
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