const { Sequelize } = require('../Models')
const db = require('../Models')
const Op = db.Sequelize.Op
const sequelize = db.sequelize

const {QueryTypes} = require('sequelize') 

const create_condo =async(req,res)=> {
    if (req.user.role === "leader" || req.user.role === "employee"){

        await db.Condo.create({...req.body,distict_id:req.user.distict_id})
       return res.status(200).send()
    }
   return res.status(401).send()
}

const edit_condo = async(req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee"){

        await db.Condo.update(req.body,{where:{id:req.params.con_id}})
       return res.status(202).send()
    }
   return res.status(401).send()
}
const  fetchs_all_condo = async(req,res)=> {
    if (req.user.role === "leader" || req.user.role === "employee"){
        const condo = await db.Condo.findAll({where:{distict_id:req.user.distict_id},include:[db.Room],
                attributes:['id','Register_no','Condo_name','Parcel_no','Survey_no','Tambol','District_name',[Sequelize.fn('count',Sequelize.col('Room_no')),'amount']],
                group:['id'],
                raw:true
        })
       
       return res.status(200).send(condo)
    }
   return res.status(401).send()
}
const fetch_condo = async(req,res) => {
 
    if (req.user.role === "leader" || req.user.role === "employee"){
        const rooms = await db.Room.findAll({where:{[Op.and]:[{Condo_no:req.params.con_id},{Floor:1}]}});
        if (rooms.length >0) {
         const roomFloorOne = await db.Condo.findOne({where:{[Op.and]:[{distict_id:req.user.distict_id},{id:req.params.con_id}]},
            include:{model:db.Room ,where:{Floor:1},
                    include:[{model:db.Tax_Group,include:[db.Customer]},db.Useful_room]
                    }
            
            })   
         return  res.status(200).send(roomFloorOne)
        }
        const condo = await db.Condo.findOne({where:{[Op.and]:[{distict_id:req.user.distict_id},{id:req.params.con_id}]},
            include:{model:db.Room ,include:[{model:db.Tax_Group,include:[db.Customer]},db.Useful_room]} 
            })
        return res.status(200).send(condo)
        
      
    }
  return  res.status(401).send()
}
const delete_condo = async(req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Condo.destroy({where:{id:req.params.con_id}})
       return res.status(204).send()
    }
    return res.status(401).send()
}

module.exports={
    fetch_condo,
    fetchs_all_condo,
    edit_condo,
    create_condo,
    delete_condo
}