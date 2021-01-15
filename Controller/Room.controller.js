const db = require('../Models');
const Op = db.Sequelize.Op
const create_room = async(req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const created=   await db.Room.findOne({where:{Room_ID:req.body.Room_ID}})
        if(created) return res.status(400).send()
        const Room  = await db.Room.create(req.body)
        await db.Useful_room.bulkCreate(req.body.useful_room)
       return res.status(200).send()
    }
    res.status(401).send()
}
const fetch_room = async(req,res)=> {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

        const room = await db.Room.findOne({where:{Room_ID:req.params.r_id},include:[db.Useful_room]})
      return  res.status(200).send(room)
    }
    res.status(401).send()
}

const filter_room = async(req,res) => {
    const {Floor,Condo_no,Price,Cus_No} = req.body
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        //floor filter
        const room = await db.Room.findAll({where:{[Op.and]:[{Floor:Floor},{Condo_no:Condo_no}]},include:[{model:db.Useful_room,where:{Price:{[Op.eq]:Price}}},
                    {model:db.OwnerRoom,where:{Cus_No:{[Op.eq]:Cus_No}}}
        ]})
        res.status(200).send()

    }
    res.status(401).send()
}
const delete_room = async(req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await db.Room.destroy({where:{Room_ID:req.params.r_id}})
        return res.status(204).send()
    }
    res.status(401).send()
}
module.exports={
    delete_room,
    create_room,
    fetch_room,
    filter_room
}