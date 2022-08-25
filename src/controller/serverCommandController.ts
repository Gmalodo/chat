import {serverCommand} from "../service/serverCommandService";

module.exports = (app, io) => {
    app.get('/server/cam', (req, res) => {
        res.render('pages/cam')
        io.sockets.on('connect', (client) => {
            serverCommand.setupCam(client)
        })
    })
}