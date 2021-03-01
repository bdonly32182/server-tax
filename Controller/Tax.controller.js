const db = require("../Models")
const Op = db.Sequelize.Op
const sequelize = db.sequelize
const {QueryTypes} = require('sequelize') 
const { Sequelize } = require("../Models")
const exceptEmegency=async(req,res)=>{
  let {exceptEmegency} =req.body
  if (req.user.role === "leader" || req.user.role=== "employee"){

    await db.Tax_Group.update({exceptEmergency:exceptEmegency},{where:{Tax_in_district:req.user.distict_id}});
     return res.status(200).send()
  }
 return res.status(401).send()
}
const generate_tax = async(req,res) => {
    const {uid_tax,land_id,customer_has_tax,customer,Category_Tax} = req.body
    if (req.user.role === "leader" || req.user.role=== "employee"){
      console.log(uid_tax);
        const [tax,created] = await db.Tax_Group.findOrCreate({defaults:{uid_tax:uid_tax,Tax_in_district:req.user.distict_id,Category_Tax:Category_Tax},where:{uid_tax:uid_tax}})
          await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:uid_tax}});
          await db.Land.update({Land_Tax_ID:tax.uid_tax},{where:{code_land:land_id}});

         Category_Tax !=="รัฐบาล"&&await db.UsefulLand.update({UsefulLand_Tax_ID:tax.uid_tax},{where:{Land_id:land_id}});
        // create true === uid_tax นี้ยังไม่มีในระบบ
        if(created) { 
          await db.Customer_has_tax.bulkCreate(customer_has_tax)
          await db.Address.create({...customer,Address_Tax_ID:tax.uid_tax})
        }
       return res.status(200).send()
    }
   return res.status(401).send()
}
const build_generate_tax = async(req,res) => {
  const {uid_tax,land_id,customer_has_tax,customer,Category_Tax,Build_Id} = req.body
  if (req.user.role === "leader" || req.user.role === "employee"){
    console.log(req.body);
    const [tax,created] = await db.Tax_Group.findOrCreate({defaults:{uid_tax:uid_tax,Tax_in_district:req.user.distict_id,Category_Tax:Category_Tax},where:{uid_tax:uid_tax}})
    await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:uid_tax}})
    await db.Building.update({Build_Tax_ID:tax.uid_tax},{where:{Build_Id:Build_Id}})
  // create true === uid_tax นี้ยังไม่มีในระบบ
      if(created) { 
        await db.Customer_has_tax.bulkCreate(customer_has_tax)
        await db.Address.create({...customer,Address_Tax_ID:uid_tax})
      }
      return res.status(200).send()     
  }
  return res.status(401).send()

}
const fetch_tax_id = async(req,res) => {
  const targetId = req.params.tax
  if (req.user.role === "leader" || req.user.role === "employee"){
      const tax = await db.Tax_Group.findOne({where:{uid_tax:targetId},include:[db.Land,db.Customer,db.Room,db.Address,{model:db.Building,include:db.RateOfBuilding}]})
     return res.status(200).send(tax)
  }
  return res.status(401).send()
}
const list_tax_id = async(req,res) => {
  let {size,page} = req.query
  if (req.user.role === "leader" || req.user.role === "employee"){
    const taxs = await sequelize.query(`select  *,(select count(*) from customer C inner join customer_has_tax CT on C.id_customer= CT.Cus_No where CT.Customer_Tax_ID = T.uid_tax) as countCustomer 
    ,(select count(*) from land L where L.Land_Tax_ID = T.uid_tax ) as countLand,
    (select count(*) from building B where B.Build_Tax_ID = T.uid_tax) as countBuild ,
    (select count(*) from room R where R.Room_Tax_ID = T.uid_tax)  as countRoom
    from tax_group T 
    where T.Tax_in_district = ${req.user.distict_id}
    ; `,{type:QueryTypes.SELECT})
    // const taxs = await db.Tax_Group.findAndCountAll({where:{Tax_in_district:req.user.distict_id},limit:10})
   return res.status(200).send(taxs)
  }
  return  res.status(402).send()
}
const fetch_pds3_byIdTax = async(req,res) =>{
  const Tax_ID = req.params.id_tax
  if (req.user.role === "leader" || req.user.role === "employee"){
  // $BuildOnUsefulLands.Building.Build_Tax_ID$ เอาตามรูปแบบของ json
  // or Build_tax_ID เพราะว่า จะทำให้มันคิวรี่ได้มาทั้ง สิ่งปลูกสร้าง และ การใช้ประโยชน์ แล้วเราค่อยไป where สิ่งปลูกสร้างอีกที
    let pds3 = await db.UsefulLand.findAll({where:{[Op.or]:[{UsefulLand_Tax_ID:Tax_ID},{"$BuildOnUsefulLands.Building.Build_Tax_ID$":Tax_ID}]},
    include:[
      {
        model:db.BuildOnUsefulLand,
        include:{
          model:db.Building,
          include:[db.RateOfBuilding,db.LiveType,db.FarmType,db.EmptyType,db.OtherType],
          where:{Build_Tax_ID:Tax_ID}//เอาแค่สิ่งปลูกสร้างที่ไอดีแท็กนี้เท่านั้น
        }
      },
      db.Land
    ]});
     return res.status(200).send(pds3);
  }
  
 return res.status(403).send();
} 
const fetch_pds7_byIdTax = async(req,res)=> {
  const Tax_ID = req.params.id_tax;
  if (req.user.role === "leader" || req.user.role === "employee"){
    let newPDS7 = [];
    let pds7 = await db.UsefulLand.findAll({where:{[Op.or]:[{UsefulLand_Tax_ID:Tax_ID},{"$BuildOnUsefulLands.Building.Build_Tax_ID$":Tax_ID}]},
    include:[
      {
        model:db.BuildOnUsefulLand,
        include:{
          model:db.Building,
          include:[db.RateOfBuilding,db.LiveType,db.FarmType,db.EmptyType,db.OtherType],
          where:{Build_Tax_ID:Tax_ID},//เอาแค่สิ่งปลูกสร้างที่ไอดีแท็กนี้เท่านั้น
          // attributes:[ 'AfterPriceDepreciate',[Sequelize.fn('SUM',Sequelize.col('BuildOnUsefulLands.Building.AfterPriceDepreciate')),'totalBuildPrice']],
        }
      },
      db.Land,
        {model:db.LiveType,//เอาไปทำสัดส่วน
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id','Build_Tax_ID'],             
          }]
      },
      {model:db.FarmType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      },
      {model:db.EmptyType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      },
      {model:db.OtherType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      }
    ],
    attributes:['useful_id','Useful_RAI','Useful_GNAN','Useful_WA','PriceUseful','Place','TypeName','UsefulLand_Tax_ID','Percent','Special_Useful']
    
  });
  for (let useful of pds7) {
    let total = useful.BuildOnUsefulLands.reduce((pre,{Building:{AfterPriceDepreciate}}) =>pre+AfterPriceDepreciate,0);
     // useful.totalPriceBuild = total;
     if (useful.UsefulLand_Tax_ID === Tax_ID) {
       let newUseful = {useful,PriceBuildAnduseful:useful.PriceUseful +total}
        newPDS7.push(newUseful)
     }else{
      let newUseful = {useful,PriceBuildAnduseful:total}
      newPDS7.push(newUseful)
     }
     
 }
     return res.status(200).send(newPDS7);
  }
 return res.status(401).send();
}
const test= async(req,res)=>{
  const Tax_ID = req.params.id_tax;
   db.UsefulLand.findAll({where:{[Op.or]:[{UsefulLand_Tax_ID:Tax_ID},{"$BuildOnUsefulLands.Building.Build_Tax_ID$":Tax_ID}]},
    include:[
      {
        model:db.BuildOnUsefulLand,
        include:{
          model:db.Building,
          include:[db.RateOfBuilding,db.LiveType,db.FarmType,db.EmptyType,db.OtherType],
          where:{Build_Tax_ID:Tax_ID},//เอาแค่สิ่งปลูกสร้างที่ไอดีแท็กนี้เท่านั้น
          // attributes:[ 'AfterPriceDepreciate',[Sequelize.fn('SUM',Sequelize.col('BuildOnUsefulLands.Building.AfterPriceDepreciate')),'totalBuildPrice']],
        }
      },
      db.Land,
        {model:db.LiveType,//เอาไปทำสัดส่วน
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id'],             
          }]
      },
      {model:db.FarmType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      },
      {model:db.EmptyType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      },
      {model:db.OtherType,
          include:[{
              model:db.Building,
              attributes:['No_House','Build_Id']
          }]
      }
    ],
    attributes:['useful_id','Useful_RAI','Useful_GNAN','Useful_WA','PriceUseful','Place','TypeName','UsefulLand_Tax_ID','Percent']
  
  }).then(async(result)=>{
    let arr = [];
    
    for (let useful of result) {
       let total = useful.BuildOnUsefulLands.reduce((pre,{Building:{AfterPriceDepreciate}}) =>pre+AfterPriceDepreciate,0);
       if (useful.UsefulLand_Tax_ID === Tax_ID) {
         //ที่ดินและสิ่งปลูกสร้างคนเดียวกัน
        let newUseful = {useful,PriceBuildAnduseful:useful.PriceUseful +total}
        let testPro = proportionType(useful,useful.PriceUseful +total)
        arr.push(testPro)
        //  newPDS7.push(newUseful)
      }else{
        //สิ่งปลูกสร้างอย่าวเดียว
       let newUseful = {useful,PriceBuildAnduseful:total}
       let testPro = proportionType(useful,total)

       arr.push(testPro)

      //  newPDS7.push(newUseful)
      }
    }
     return res.status(200).send(
       arr
     );
  });

    
  
}
const proportionType = (record =[],totalBuildAndUseful=0) => {
  let totalPercent = record.BuildOnUsefulLands.length * 100||100 //ให้ แบ็คเอน ทำให้
  /*totalPercent === 0 || 100 คือ กรณีไม่มีสิ่งปลูกสร้างบนการใช้ประโยชน์ เช่น การใช้ประโยชน์เกษตร ที่ไม่มีสิ่งปลูกสร้าง 
  กรณี เป็นแปลงที่ถูกคร่อมมา  หรือ สิ่งปลูกสร้างคนละเจ้าของ จะมีสัดส่วนบนแปลงที่ดิน ทุกประเภทจะมีแค่อน่างละ อันเท่านั้น
  กรณีที่การใช้ประโยชน์หลายประเภทจะต้องมีสิ่งปลูกสร้างด้วย 
  ทุกกรณีนี้จะถูกเซ็ตเปอร์เซ็นให้เป็นหนึ่งร้อย
  */
 if (record.BuildOnUsefulLands.length >0) {//กรณีมีสิ่งปลุกสร้าง
     return record.BuildOnUsefulLands.map((build,i)=>{
         return (
           build.Building.LiveType?{...build.Building.LiveType.dataValues,price:(build.Building.LiveType.Percent_Live * Number(totalBuildAndUseful)) / totalPercent}:null,             
          build.Building.OtherType?{...build.Building.OtherType.dataValues,price:(build.Building.OtherType.Percent_Other * Number(totalBuildAndUseful)) / totalPercent}:null   ,        
          build.Building.FarmType?{...build.Building.FarmType.dataValues,price:(build.Building.FarmType.Percent_Farm * Number(totalBuildAndUseful)) / totalPercent}:null,                  
          build.Building.EmptyType?{...build.Building.EmptyType.dataValues,price:(build.Building.EmptyType.Percent_Empty * Number(totalBuildAndUseful)) / totalPercent} :null 
                  )
                  

                     
     })
     
 }
  if (record.LiveTypes.length === 0 &&record.OtherTypes.length === 0&& record.FarmTypes.length === 0&& record.EmptyTypes.length === 0) {
         //ไม่มีอะไรเลยทั้งสิ่งปลูกสร้าง บนแปลง และ คร่อมแปลง
         return {none :totalBuildAndUseful}
              
  }else{
      //กรณีที่ไม่มีสิ่งปลูกสร้าง แต่มีสัดส่วน ก็คือมีสิ่งปลูกสร้างคร่อมแปลงมา
      return (
                 
                 record.LiveTypes.length>0?{...record.LiveTypes[0].dataValues,price:(record.LiveTypes[0].Percent_Live * Number(totalBuildAndUseful)) / totalPercent}:null,
                  
                 record.OtherTypes.length>0?{...record.OtherTypes[0].dataValues,price:(record.OtherTypes[0].Percent_Other * Number(totalBuildAndUseful)) / totalPercent}:null ,           
                  
                 record.FarmTypes.length>0?{...record.FarmTypes[0].dataValues,price:(record.FarmTypes[0].Percent_Farm * Number(totalBuildAndUseful)) / totalPercent}:null,
                 
                 record.EmptyTypes.length>0?{...record.EmptyTypes[0].dataValues,price:(record.EmptyTypes[0].Percent_Empty * Number(totalBuildAndUseful)) / totalPercent}:null  
              )
      
  }
  
 
  
}
module.exports={
    generate_tax,
    build_generate_tax,
    fetch_tax_id,
    list_tax_id,
    fetch_pds3_byIdTax,
    fetch_pds7_byIdTax,
    test,
    exceptEmegency
}