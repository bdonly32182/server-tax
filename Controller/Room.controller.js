const db = require('../Models');
const Op = db.Sequelize.Op
const { sequelize } = require('../Models')
const create_room = async(req,res)=>{
    //test success
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {Useful_rooms,Room_no,Condo_no} = req.body;
        const [room,created] = await db.Room.findOrCreate({where:{[Op.and]:[{Room_no:Room_no},{Condo_no:Condo_no}]},defaults:req.body});
        let mapRoomID = Useful_rooms.map(type=>({...type,room_id :room.id}));
        if(created) {
                await db.Useful_room.bulkCreate(mapRoomID);
                return res.status(200).send();
        }
      return res.status(400).send();
    }
   return res.status(401).send();
}
const edit_room =async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {Useful_rooms,id} = req.body;
        console.log(req.body);
        await db.Room.update(req.body,{where:{id:id}});
        for (const type of Useful_rooms) {
            if (type.id) {
                 await db.Useful_room.update(type,{where:{id:type.id}})
            }else{
                await db.Useful_room.create({...type,room_id:id})
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
    const {Floor,Condo_no,Price,Useful} = req.query
    if (req.user.role === "leader" || req.user.role === "employee"){
        let groupFloor = await db.Room.findAll({where:{[Op.and]:[{Condo_no:Condo_no},{Floor:Floor},
             Useful !=="2"?
                    Useful==="1"?{Room_Tax_ID:{[Op.not]:null}}:{Room_Tax_ID:{[Op.is]:null}}
                   
            :null]},
            include:[{model:db.Tax_Group,include:[db.Customer]},
            {
              model:db.Useful_room,
              where:Price !=="2"?{Price_Room: Price==="0"?{[Op.eq]:0}:{[Op.gt]:0}}:null
            }],
            
          } )
        
      return  res.status(200).send(groupFloor);
    }
    return res.status(403).send()
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
const fetchs_room = async(req,res)=>{
    let targetCondo = req.params.condo_id;
    if (req.user.role === "leader" || req.user.role === "employee") {
        let Room = await db.Room.findAll({where:{[Op.and]:[{Condo_no:targetCondo},{Floor:{[Op.in]:[sequelize.literal(`(select min(Floor) as minFloor from room where Condo_no = "37")`)]}}]}
        ,include:[{model:db.Tax_Group,include:[db.Customer]},db.Useful_room]});
        return res.status(200).send(Room)
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
        await db.Room.destroy({where:{id:{[Op.in]:req.body.rooms}}});
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
    fetchs_usefultyes,
    fetchs_room
}