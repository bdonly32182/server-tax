const { sequelize } = require('../Models')
const db  = require('../Models')
const Op = db.Sequelize.Op
const createLand = async(req,res)=>{
    const {code_land} = req.body
    if (req.user.role === "leader" || req.user.role === "employee") {
         await db.Land.create({
        code_land,
        distict_id:req.user.distict_id
        })
        await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'สร้างรหัสแปลงที่ดิน',Category:4})
      return  res.status(200).send({msg:"คุณสร้างรหัสแปลงที่ดินเรียบร้อยแล้ว"})
    }        
   return res.status(402).send()
    
   
}

const getAllLand = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const lands = await db.Land.findAll({where:{distict_id:req.user.distict_id}})
           return res.status(201).send(lands)
    }
  return res.status(402).send()
    
}

const fetch_land =async(req,res)=>{
 let targetId = req.params.L_id
    if (req.user.role === "leader" || req.user.role === "employee"){
        const land =   await db.Land.findOne({where:{[Op.and]:[{code_land:targetId},{distict_id:req.user.distict_id}]},include:[db.UsefulLand,
            {
            model:db.Tax_Group,
            include:[db.Customer]
            },
            {
                model:db.RateLand,
                attributes:['Price_thanaruk']
            }
        ]})
        if(land === null)return res.status(400).send()
       return res.status(200).send(land);
    }
    return  res.status(402).send();
}
const editLand = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
            await db.Land.update(req.body,{
            where:{code_land:req.land.code_land}
        })
        await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'แก้ไข้ข้อมูลแปลงที่ดิน',Category:5})
      return  res.status(201).send({msg:"คุณแก้ไข้ข้อมูลที่ดินเรียบร้อยแล้ว"}) 
    }
   return res.status(401).send()
   
}
const deleteLand = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role=== "employee"){
      let targetLand = req.params.id
      await sequelize.query(`delete from building B where B.Build_Id in( 
        select UB.Build_id_in_Useful from build_on_useful_land UB where UB.Useful_land_id in(select U.useful_id from usefulLand U where U.Land_id ="${targetLand}"))`);
       await req.land.destroy() ;
       await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'แก้ไข้ข้อมูลแปลงที่ดิน',Category:6});

       res.status(204).send(test)
    }
    res.status(401).send()
}
const search_parcel = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){

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