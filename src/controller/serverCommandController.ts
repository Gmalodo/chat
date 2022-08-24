import {userStatus} from "../service/userStatusService";

module.exports = (app) => {
    app.get('/server/volume', (req, res) => {
        res.render('pages/cam')

    })

}