const { Sequelize } = require('../Models')
const db = require('../Models')
const Op = db.Sequelize.Op
const { sequelize } = require('../Models')
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
        const condo = await db.Condo.findOne({where:{[Op.and]:[{distict_id:req.user.distict_id},{id:req.params.con_id}]}})
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
const SearchCondo = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        let search = req.query.search
        if (search === '') {
            const CondoAll = await db.Condo.findAll({where:{distict_id:req.user.distict_id},include:[db.Room],
                attributes:['id','Register_no','Condo_name','Parcel_no','Survey_no','Tambol','District_name',[Sequelize.fn('count',Sequelize.col('Room_no')),'amount']],
                group:['id'],
                raw:true
            });
            return res.status(200).send(CondoAll)
        }
        let condo = await sequelize.query(`select *,count(R.id) as amount from condo C left join room R on C.id = R.Condo_no 
        where (C.Condo_name ="${search}" and C.distict_id = "${req.user.distict_id}") or (C.Register_no ="${search}" and C.distict_id = "${req.user.distict_id}")`
        ,{type:QueryTypes.SELECT});
        return res.status(200).send(condo)
    }
    return res.status(403).send({message:'not role'});
}
const SelectFloor = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let groupFloor = await db.Room.findAll({where:{Condo_no:req.params.condoId},attributes:['Floor'],group:'Floor'})
        return res.status(200).send(groupFloor);
    }
    return res.status(403).send();
}
module.exports={
    fetch_condo,
    fetchs_all_condo,
    edit_condo,
    create_condo,
    delete_condo,
    SearchCondo,
    SelectFloor
}