const db  = require('../Models')
const Op = db.Sequelize.Op
const createLand = async(req,res)=>{
    const {code_land,DistrictDistrictNo} = req.body
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee") {
         await db.Land.create({
        code_land,
        DistrictDistrictNo
        })
        res.status(200).send({msg:"คุณสร้างรหัสแปลงที่ดินเรียบร้อยแล้ว"})
    }        
    res.status(401).send()
    
   
}

const getAllLand = async(req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const allLand = await db.Land.findAll({where:{DistrictDistrictNo:req.user.DistrictDistrictNo}})
            res.status(201).send(allLand)
    }
   
    
}

const fetch_land =async(req,res)=>{
 let targetId = req.params.L_id
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const fetchLand =   await db.Land.findOne({where:{[Op.and]:[{code_land:targetId},{DistrictDistrictNo:req.user.DistrictDistrictNo}]},include:[db.Building,db.UsefulLand,{
            model:db.Customer,include:[db.Tax_Group]
        }]})
        if(fetchLand === null) res.status(400).send()
        res.status(200).send(fetchLand);
    }
    res.status(401).send();
}
const editLand = async(req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
            await db.Land.update(req.body,{
            where:{code_land:req.land.code_land}
        })
        res.status(201).send({msg:"คุณแก้ไข้ข้อมูลที่ดินเรียบร้อยแล้ว"}) 
    }
    res.status(401).send()
   
}
const deleteLand = async(req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
       await req.land.destroy() ;
       res.status(204).send({msg:"คุณลบที่ดินแปลงนี้เรียบร้อยแล้ว"})
    }
    res.status(401).send()
}
const search_parcel = async(req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

        const parcel = req.params.parcel
        const land = await db.Land.findAll({
            where:{Parcel_No:parcel}
        })
      return  res.status(201).send(land)
    }
    return res.status(401).send()
}
const LandById = async(req,res,next,id) =>{
  const fetchLand =   await db.Land.findOne({where:{code_land:id}}) 
  req.land = fetchLand;
  next();
}
module.exports ={
    createLand,
    LandById,
    getAllLand,
    editLand,
    deleteLand,
    fetch_land,
    search_parcel
}