const { sequelize } = require('../Models')
const db  = require('../Models')
const Op = db.Sequelize.Op
const {QueryTypes} = require('sequelize') 
const createLand = async(req,res)=>{
    const {code_land} = req.body
    if (req.user.role === "leader" || req.user.role === "employee") {
      const {count,row} = await db.Land.findAndCountAll({where:{distict_id:req.user.distict_id}})
         await db.Land.create({
        Serial_code_land:count +1,
        code_land,
        distict_id:req.user.distict_id
        })
        await db.RateLand.create({Price_thanaruk:0,land_id:code_land});

        await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'สร้างรหัสแปลงที่ดิน',Category:4})
      return  res.status(200).send({msg:"คุณสร้างรหัสแปลงที่ดินเรียบร้อยแล้ว"})
    }        
   return res.status(402).send()
}

const getAllLand = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const lands = await db.Land.findAll({where:{distict_id:req.user.distict_id},order:[['Serial_code_land',"ASC"]]})
           return res.status(201).send(lands)
    }
  return res.status(402).send()
    
}

const fetch_land =async(req,res)=>{
 let targetId = req.params.L_id
    if (req.user.role === "leader" || req.user.role === "employee"){
        const land =   await db.Land.findOne({where:{[Op.and]:[{code_land:targetId},{distict_id:req.user.distict_id}]},
          include:[db.UsefulLand,db.Employee,
            {
            model:db.Tax_Group,
            include:[db.Customer]
            },
            {
                model:db.RateLand,
                attributes:['Price_thanaruk','createdAt']
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
        if (req.land.Price !== req.body.Price) {
          let usefulLand =await db.UsefulLand.findAll({where:{Land_id:req.body.code_land}})
          for (const useful of usefulLand) {
            await db.UsefulLand.update({Place:useful.Place,PriceUseful:req.body.Price},{where:{useful_id:useful.useful_id}});
          }
        }
        if (req.land.employee_land !== req.body.employee_land) {
          await sequelize.query(`update  building B SET employee_build ="${req.body.employee_land}" where B.Build_Id in( 
            select UB.Build_id_in_Useful from build_on_useful_land UB where UB.Useful_land_id in(select U.useful_id from usefulLand U where U.Land_id ="${req.land.code_land}"))`);
        }
       
      return  res.status(201).send({msg:"คุณแก้ไข้ข้อมูลที่ดินเรียบร้อยแล้ว"}) ;
    }
   return res.status(401).send()
   
}
const deleteLand = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role=== "employee"){
      let targetLand = req.params.id
      await sequelize.query(`delete from building B where B.Build_Id in( 
        select UB.Build_id_in_Useful from build_on_useful_land UB where UB.Useful_land_id in(select U.useful_id from usefulLand U where U.Land_id ="${targetLand}"))`);

      await sequelize.query(`delete from build_on_useful_land BL where BL.Useful_land_id in(select   U.useful_id from usefulLand U where U.Land_id ="${targetLand}")`);
       await req.land.destroy() ;
       await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'แก้ไข้ข้อมูลแปลงที่ดิน',Category:6});

      return res.status(204).send({msg:'delete success'})
    }
   return res.status(401).send()
}
const search_parcel = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){

        const parcel = req.params.parcel
        const land = await db.Land.findAll({
            where:{[Op.and]:[{Parcel_No:parcel},{distict_id:req.user.distict_id}]},
            include:[db.UsefulLand,db.Tax_Group]
        })
      return  res.status(200).send(land)
    }
    return res.status(403).send()
}
const search_filter_land = async(req,res)=>{
  if (req.user.role === "leader" || req.user.role === "employee"){
    let ParcelNo = req.query.ParcelNo;
    let LandNo = req.query.LandNo;
    let SurveyNo = req.query.SurveyNo;
    let CodeLand = req.query.CodeLand;
    let TaxId = req.query.TaxId;
    let Operator = req.query.Operator
    let special = req.query.special
    if (!special) {
        let land = await sequelize.query(`select * from land where code_land = "${CodeLand}" ${Operator} Parcel_No="${ParcelNo}" 
        ${Operator} Land_No="${LandNo}" ${Operator} Survey_No="${SurveyNo}" ${Operator} Land_Tax_ID="${TaxId}"`,{type:QueryTypes.SELECT});
      return res.status(200).send(land)
    }
    let specilQuery = await sequelize.query(`select * from land ${special}`,{type:QueryTypes.SELECT})
    return res.status(200).send(specilQuery)
    
  }
 return res.status(403).send();
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
    search_parcel,
    search_filter_land
}