const db = require("../Models")
const passport = require('passport')
module.exports=app=>{
    const auth = passport.authenticate("jwt",{session:false})
    const room = require('../Controller/Room.controller')
    app.route('/api/room/:r_id')
        .get(auth,room.fetch_room)
        .delete(auth,room.delete_room)
    app.post('/api/create/room',auth,room.create_room)
    app.post('/api/rooms',auth,room.filter_room)
}