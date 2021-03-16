const db = require('../Models');
const Op = db.Sequelize.Op
const create_room = async(req,res)=>{
    //test success
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {Useful_rooms,Room_ID} = req.body;
        let mapRoomID = Useful_rooms.map(type=>({...type,room_id :Room_ID}));
        const [room,created] = await db.Room.findOrCreate({where:{Room_ID:req.body.Room_ID},defaults:req.body});
        if(created) {
                await db.Useful_room.bulkCreate(mapRoomID);
        }
       return res.status(200).send();
    }
   return res.status(401).send();
}

const edit_room =async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {Useful_rooms,Room_ID} = req.body;
        await db.Room.update(req.body,{where:{Room_ID:Room_ID}});
        for (const type of Useful_rooms) {
            if (type.id) {
                 await db.Useful_room.update(type,{where:{id:type.id}})
            }else{
                await db.Useful_room.create({...type,room_id:Room_ID})
            }
            
            
        }
  
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onDelete_useful_room = async(req,res) => {
    let targetID = req.params.uid
    if (req.user.role === "leader" || req.user.role === "employee"){
        if(targetID ==='undefined') return res.status(203).send();
        await db.Useful_room.destroy({where:{id:targetID}})
        return res.status(200).send();
    }
    return res.status(403).send();
}
const filter_room = async(req,res) => {
    const {Floor,Condo_no,Price,Cus_No} = req.body
    if (req.user.role === "leader" || req.user.role === "employee"){
        //floor filter
        const room = await db.Room.findAll({where:{[Op.and]:[{Floor:Floor},{Condo_no:Condo_no}]},include:[{model:db.Useful_room,where:{Price:{[Op.eq]:Price}}},
                    {model:db.OwnerRoom,where:{Cus_No:{[Op.eq]:Cus_No}}}
        ]})
        res.status(200).send()

    }
    res.status(401).send()
}
const delete_room = async(req,res) =>{
    //test success
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Room.destroy({where:{Room_ID:req.params.r_id}})
        return res.status(204).send()
    }
   return res.status(403).send()
}
const fetchs_usefultyes = async(req,res)=> {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let targetCondo = req.params.condo_id;
        let usefultype = await db.Useful_room.findAll({include:{
            model:db.Room,
            where:{Condo_no:targetCondo}
        }});
        return res.status(200).send(usefultype)

    }
    return res.status(403).send();
}

//crud select  rows
const onEdit_rows_useful = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Useful_room.update(req.body,{where:{room_id:{[Op.in]:req.body.rooms}}})
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onDelete_rows = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Room.destroy({where:{Room_ID:{[Op.in]:req.body.rooms}}});
        res.status(204).send()
    }
    return res.status(403).send();
}
module.exports={
    delete_room,
    create_room,
    filter_room,
    edit_room,
    onDelete_useful_room,
    onEdit_rows_useful,
    onDelete_rows,
    fetchs_usefultyes
}