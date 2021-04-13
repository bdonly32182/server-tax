const db = require("../Models")
const passport = require('passport')
module.exports=app=>{
    const auth = passport.authenticate("jwt",{session:false});
    const room = require('../Controller/Room.controller');
    app.route('/api/room/:r_id')
        .delete(auth,room.delete_room);
    app.post('/api/edit/room',auth,room.edit_room);
    app.post('/api/create/room',auth,room.create_room);
    app.get('/api/filter/room',auth,room.filter_room);
    app.delete('/api/delete/usefulroom/:uid',auth,room.onDelete_useful_room);
    app.get('/api/fetchsrooms/:condo_id',auth,room.fetchs_room)
    app.post('/api/rows/usefuls/',auth,room.onEdit_rows_useful);
    app.post('/api/rows/rooms',auth,room.onDelete_rows);
    app.get('/api/usefultype:condo_id',auth,room.fetchs_usefultyes);
}