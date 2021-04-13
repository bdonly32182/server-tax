const db = require("../Models")
const Op = db.Sequelize.Op
const sequelize = db.sequelize
const {QueryTypes} = require('sequelize') 
// const redis = require('redis');
// const {promisify} = require('util')
// const redisClient = redis.createClient();
// const asyncGet = promisify(redisClient.get).bind(redisClient);
const exceptEmegency=async(req,res)=>{
  let {exceptEmegency} =req.body
  if (req.user.role === "leader" || req.user.role=== "employee"){

    await db.Tax_Group.update({exceptEmergency:exceptEmegency},{where:{Tax_in_district:req.user.distict_id}});
     return res.status(200).send()
  }
 return res.status(401).send()
}
const updateAddress =async(req,res)=>{
  if (req.user.role === "leader" || req.user.role=== "employee"){
    await  db.Address.update(req.body,{where:{Address_Tax_ID:req.body.Address_Tax_ID}});
    return res.status(200).send();
  }
  return res.status(403).send();
}
const generate_tax = async(req,res) => {
    const {uid_tax,land_id,customer_has_tax,customer,Category_Tax} = req.body
   
    if (req.user.role === "leader" || req.user.role=== "employee"){
      //tax owner one
      if (uid_tax && customer_has_tax) {           
            await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:uid_tax}});
            await db.Land.update({Land_Tax_ID:uid_tax},{where:{code_land:land_id}});
          Category_Tax !=="รัฐบาล"&&await db.UsefulLand.update({UsefulLand_Tax_ID:uid_tax},{where:{Land_id:land_id}});
          return res.status(200).send()
      }
      
       let CustomerIn = customer.map(customer=>customer.id_customer)
       let isTax = await db.Tax_Group.findAll({include:[{
                    model:db.Customer,
                    where:{id_customer:{[Op.in]:CustomerIn}},  
                  }],
                  group:["uid_tax"],
                  having: sequelize.where(sequelize.fn('count', sequelize.col('uid_tax')),CustomerIn.length)
                });
     //have uid_tax
     if (isTax.length>0) {
          await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:isTax[0].uid_tax}});
          await db.Land.update({Land_Tax_ID:isTax[0].uid_tax},{where:{code_land:land_id}});

          Category_Tax !=="รัฐบาล"&&await db.UsefulLand.update({UsefulLand_Tax_ID:isTax[0].uid_tax},{where:{Land_id:land_id}});      
       return res.status(200).send();
     }
     //don't have uid_tax
          let {count,row} = await db.Tax_Group.findAndCountAll({where:{Tax_in_district:req.user.distict_id}});
          let totalTax = `${count+1}`
          let sumZero = "";
          for (let index = 0; index <= 13 - totalTax.length - customer.length; index++) {
              sumZero += "0"
          }
          let Tax_ID = `${req.user.distict_id}_${customer.length}${sumZero}${count+1}` 

          await db.Tax_Group.create({uid_tax:Tax_ID,Tax_in_district:req.user.distict_id,Category_Tax:Category_Tax});
          await db.Land.update({Land_Tax_ID:Tax_ID},{where:{code_land:land_id}});
          for (const values of customer) {
            await db.Customer_has_tax.create({Cus_No:values.id_customer,Customer_Tax_ID:Tax_ID})
          }
          await db.Address.create({...customer[0],Address_Tax_ID:Tax_ID})
       return res.status(200).send()
    }
   return res.status(401).send()
}
const build_generate_tax = async(req,res) => {

  const {uid_tax,land_id,customer_has_tax,customer,Category_Tax,Build_Id} = req.body
  if (req.user.role === "leader" || req.user.role === "employee"){
    if (uid_tax && customer_has_tax) {          
            await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:uid_tax}});
            await db.Building.update({Build_Tax_ID:uid_tax},{where:{Build_Id:Build_Id}})
           
          return res.status(200).send()
      }
      
       let CustomerIn = customer.map(customer=>customer.id_customer)
       let isTax = await db.Tax_Group.findAll({include:[{
                    model:db.Customer,
                    where:{id_customer:{[Op.in]:CustomerIn}},  
                  }],
                  group:["uid_tax"],
                  having: sequelize.where(sequelize.fn('count', sequelize.col('uid_tax')),CustomerIn.length)
                });
     //have uid_tax owner join
     if (isTax.length>0) {
  
          await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:isTax[0].uid_tax}});
          await db.Building.update({Build_Tax_ID:isTax[0].uid_tax},{where:{Build_Id:Build_Id}})
         return res.status(200).send();
     }
     //don't have uid_tax owner join
          let {count,row} = await db.Tax_Group.findAndCountAll({where:{Tax_in_district:req.user.distict_id}});
          let totalTax = `${count+1}`
          let sumZero = "";
          for (let index = 0; index <= 13 - totalTax.length - customer.length; index++) {
              sumZero += "0"
          }
          let Tax_ID = `${req.user.distict_id}_${customer.length}${sumZero}${count+1}` 

          await db.Tax_Group.create({uid_tax:Tax_ID,Tax_in_district:req.user.distict_id,Category_Tax:Category_Tax});
          await db.Building.update({Build_Tax_ID:Tax_ID},{where:{Build_Id:Build_Id}})
          for (const values of customer) {
            await db.Customer_has_tax.create({Cus_No:values.id_customer,Customer_Tax_ID:Tax_ID})
          }
          await db.Address.create({...customer[0],Address_Tax_ID:Tax_ID})
       return res.status(200).send()
   
  }
  return res.status(401).send()

}
const room_generate_tax = async(req,res) => {
  const {uid_tax,customer_has_tax,customer,Category_Tax,Room_ID} = req.body
  if (req.user.role === "leader" || req.user.role === "employee"){
    const [tax,created] = await db.Tax_Group.findOrCreate({defaults:{uid_tax:uid_tax,Tax_in_district:req.user.distict_id,Category_Tax:Category_Tax},where:{uid_tax:uid_tax}})
    await db.Tax_Group.update({Category_Tax:Category_Tax},{where:{uid_tax:uid_tax}})
    await db.Room.update({Room_Tax_ID:tax.uid_tax},{where:{id:Room_ID}})
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
      const tax = await db.Tax_Group.findOne({where:{uid_tax:targetId},include:[db.Land,db.Customer,db.Address,
        {
          model:db.Room,
          include:[db.Condo,db.Useful_room]
        },
        {model:db.Building,include:[
        db.LiveType, db.FarmType,db.EmptyType,db.OtherType,
                                    db.RateOfBuilding, 
                                    
                                    {
                                        // ผู้เสียภาษี
                                        model:db.Tax_Group,
                                        include:[db.Customer]
                                    },
                                    {//คร่อมแปลง เพื่อเอาไปเซ็ทรหัสการใช้ประโยชน์
                                        model:db.BuildOnUsefulLand,
                                        include:[db.UsefulLand]
                                    }
      ]}]})
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
const fetch_pds6_byIdTax = async(req,res)=>{
  const Tax_ID = req.params.id_tax;
  if (req.user.role  === "leader" || req.user.role=== "employee") {
      let leader = await db.Employee.findOne({where:{[Op.and]:[{distict_id:req.user.distict_id},{role:"leader"}]}});
      let Land = await sequelize.query(`
                    select count(L.code_land) as totalLand from land L left join usefulLand UL on L.code_land = UL.Land_id
                    where UL.UsefulLand_Tax_ID = "${Tax_ID}"
                    group by UL.useful_id
                    having count(UL.useful_id) >= 1
                    
      `,{type:QueryTypes.SELECT});
      let Building = await sequelize.query(`
              select count(Build_Id)as totalBuild from building where Build_Tax_ID ="${Tax_ID}"
      `,{type:QueryTypes.SELECT});
      let Room = await sequelize.query(`
        select count(*) as totalRoom from room where Room_Tax_ID ="${Tax_ID}"
      `,{type:QueryTypes.SELECT})
      console.log(Room);
      return res.status(200).send({leader,Land,Building,Room})
  }
  return res.status(403).send();
}
const fetch_pds7_byIdTax = async(req,res)=> {
  const Tax_ID = req.params.id_tax;
  if (req.user.role === "leader" || req.user.role === "employee"){
    // let newPDS7 = [];
    
    let pds7 = await db.UsefulLand.findAll({where:{[Op.or]:[{UsefulLand_Tax_ID:Tax_ID},{"$BuildOnUsefulLands.Building.Build_Tax_ID$":Tax_ID}]},
    include:[
      {
        model:db.UsefulLand,
        as:'Useful', //as ต้องตรงกับใน model
        include:[db.LiveType,db.FarmType,db.EmptyType,db.OtherType,{
          model:db.BuildOnUsefulLand,
          include:{
              model:db.Building,
              include:[db.RateOfBuilding,db.LiveType,db.FarmType,db.EmptyType,db.OtherType],
              where:{Build_Tax_ID:Tax_ID},//เอาแค่สิ่งปลูกสร้างที่ไอดีแท็กนี้เท่านั้น
            }
        }]
      },
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
    attributes:['useful_id','Useful_RAI','Useful_GNAN','Useful_WA','PriceUseful','Place',
    'TypeName','UsefulLand_Tax_ID','Percent','Special_Useful','isNexto','marks','StartYears','EmptyAbsolutes']
    
  });

     return res.status(200).send(pds7);
  }
 return res.status(401).send();
}

const fetch_pds4_byIdTax = async(req,res)=>{
  const targetId = req.params.id_tax
  if (req.user.role === "leader" || req.user.role === "employee"){
    const rooms = await db.Condo.findAll({include:[
      {
        model:db.Room,
        where:{Room_Tax_ID:targetId},
        include:[db.Useful_room]
      }
    ]});
    return res.status(200).send(rooms)

  }
  return res.status(403).send();
}

const fetch_pds8_byIdTax = async(req,res) => {
  if (req.user.role === "leader" || req.user.role === "employee") {
    let targetId = req.params.id_tax
    const usefultype = await db.Useful_room.findAll({include:{
      model:db.Room,
      where:{Room_Tax_ID:targetId},
      include:[db.Condo]

    }});
    return res.status(200).send(usefultype);
  }
  return res.status(403).send();
}
const testGenerateTax = async(req,res)=>{
 //test tax having
  // let customer = await sequelize.query(`select  TG.uid_tax,C.id_customer from customer_has_tax CHT  join tax_group TG on TG.uid_tax = CHT.Customer_Tax_ID  join customer C on C.id_customer = CHT.Cus_No
  // where C.id_customer in (${arrCustomer})
  // group by TG.uid_tax
  // having count(TG.uid_tax) =${arrCustomer.length}`,
  // {type:QueryTypes.SELECT})

  //test condo min floor
//  let  roomFloorOne = await sequelize.query(`select * from condo C left join room R on C.id = R.Condo_no
//     where R.Floor in (select min(Floor) as minFloor from room where Condo_no = "37")
   
//  `,{type:QueryTypes.SELECT});
//  const condo = await db.Condo.findOne({where:{[Op.and]:[{distict_id:36},{id:37}]},
//   include:{model:db.Room ,
//       where:{Floor:{[Op.in]:[sequelize.literal(`(select min(Floor) as minFloor from room where Condo_no = "37")`)]}}
//     ,include:[{model:db.Tax_Group,include:[db.Customer]},db.Useful_room]} 
//   })

//test Seach Room in condo 
let floor = req.query.floor
let ratePriceQuery =  req.query.rate
let roomFloor = await db.Condo.findOne({where:{[Op.and]:[{distict_id:36},{id:37}]},
    include:{model:db.Room ,
        where:{Floor:floor},include:[{model:db.Tax_Group,include:[db.Customer]},db.Useful_room]} 
    })
 //test ratePrice Room
 let price = 0;
 let hasTax = 0;//0 ===ไม่มีรหัสผู้เสียภาษี
 let ratePrice = await db.Condo.findOne({where:{[Op.and]:[{distict_id:36},{id:37}]},
  include:{model:db.Room 
    ,include:[{model:db.Tax_Group,include:[db.Customer]},
    {
      model:db.Useful_room,
      where:{Price_Room:{[Op.eq]:0}}
    }]} 
  })
  //test floor 
  //hastax >0 คือเลือกทั้งหมด
  let groupFloor = await db.Room.findAll({where:{[Op.and]:[{Condo_no:37},{Floor:3},hasTax>0?hasTax===1?{Room_Tax_ID:{[Op.not]:null}}:{Room_Tax_ID:{[Op.is]:null}}:null]},
    include:[{model:db.Tax_Group,include:[db.Customer]},
    {
      model:db.Useful_room,
      where:{Price_Room:price===0?{[Op.eq]:price}:{[Op.gt]:price}}
    }],
    
  } );
  
  res.send(groupFloor);
}
module.exports={
    generate_tax,
    build_generate_tax,
    fetch_tax_id,
    list_tax_id,
    fetch_pds3_byIdTax,
    fetch_pds7_byIdTax,
    exceptEmegency,
    room_generate_tax,
    fetch_pds4_byIdTax,
    fetch_pds8_byIdTax,
    testGenerateTax,
    fetch_pds6_byIdTax,
    updateAddress
  }