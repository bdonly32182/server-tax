const db = require("../Models")
const Op = db.Sequelize.Op
const sequelize = db.sequelize
const generate_tax = async(req,res) => {
    const {Tax_ID,land_id,payment} = req.body
    console.log(req.body.customer);
    console.log(Tax_ID);
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
      const customer = await db.Customer.findOne({where:{Cus_No : payment}})
      console.log(customer);
        const [tax,created] = await db.Tax_Group.findOrCreate({defaults:{Tax_ID:Tax_ID},where:{Tax_ID:Tax_ID}})
          await db.Land.update({Tax_ID:tax.Tax_ID},{where:{code_land:land_id}})
          await db.Address.findOrCreate({where:{Tax_ID:tax.Tax_ID},defaults:{
            Num_House:customer.Num_House,Moo:customer.Moo,Road_Name:customer.Road_Name,Soi:customer.Soi,Tambol:customer.Tambol
            ,district_name:customer.district_name,Changwat:customer.Changwat,Post_No:customer.Post_No,Phone_no:customer.Phone_no
            ,Tax_ID:tax.Tax_ID}})
        if(created) { 
          await db.Customer_has_tax.bulkCreate(req.body.customer)
          await db.District_has_Tax.create({District_ID:req.user.DistrictDistrictNo,Tax_ID:tax.Tax_ID})
         
        }
       return res.status(200).send()
    }
   return res.status(401).send()
}
const build_generate_tax = async(req,res) => {
  const {Tax_ID,customer,payment,id} = req.body
  console.log(Tax_ID);
  if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
    const customers = await db.Customer.findOne({where:{Cus_No : payment}})
    const [tax,created] = await db.Tax_Group.findOrCreate({defaults:{Tax_ID:Tax_ID},where:{Tax_ID:Tax_ID}})
  
                          await db.Building.update({Tax_ID:Tax_ID},{where:{Build_Id:id}})
                          await db.Address.findOrCreate({where:{Tax_ID:tax.Tax_ID},defaults:{
                            Num_House:customer.Num_House,Moo:customer.Moo,Road_Name:customer.Road_Name,Soi:customer.Soi,Tambol:customer.Tambol
                            ,district_name:customer.district_name,Changwat:customer.Changwat,Post_No:customer.Post_No,Phone_no:customer.Phone_no
                            ,Tax_ID:tax.Tax_ID}})
      if(created)  {
        await db.Building.update({Tax_ID:tax.Tax_ID},{where:{Build_Id:id}})
        await db.Customer_has_tax.bulkCreate(customer)
        await db.District_has_Tax.create({District_ID:req.user.DistrictDistrictNo,Tax_ID:tax.Tax_ID})
        await db.Address.findOrCreate({where:{Tax_ID:tax.Tax_ID},defaults:{
          Num_House:customer.Num_House,Moo:customer.Moo,Road_Name:customer.Road_Name,Soi:customer.Soi,Tambol:customer.Tambol
          ,district_name:customer.district_name,Changwat:customer.Changwat,Post_No:customer.Post_No,Phone_no:customer.Phone_no
          ,Tax_ID:tax.Tax_ID}})
      }
      return res.status(200).send()     
  }
  return res.status(401).send()

}
const fetch_tax_id = async(req,res) => {
  const targetId = req.params.tax
  if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
      const tax = await db.Tax_Group.findOne({where:{Tax_ID:targetId},include:[db.Land,db.Customer,db.Room,db.Address,{model:db.Building,include:db.RateOfBuilding}]})
     return res.status(200).send(tax)
  }
  return res.status(401).send()
}
const list_tax_id = async(req,res) => {
  if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
    const taxs = await db.Tax_Group.findAll({include:{model:db.District,where:{District_no:req.user.DistrictDistrictNo}}})
    res.status(200).send(taxs)
  }
  res.status(401).send()
}
const fetch_pds3_byIdTax = async(req,res) =>{
  const Tax_ID = req.params.id_tax
  if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

      let pds3 = await db.Tax_Group.findOne({where:{Tax_ID:Tax_ID},include:[
          {
              model:db.Land,
              include:{model:db.UsefulLand,include:[{model:db.Building,include:[{model:db.UsefulType},db.RateOfBuilding],
              attributes:['No_House','Category','Age_Build','Mark','Build_Total_Place']
          }]}
          },
          {
              model:db.Customer
          }
      ]})
      res.send(pds3)
  }
  res.status(401).send()
} 
const fetch_pds7_byIdTax = async(req,res)=> {
  const Tax_ID = req.params.id_tax
  if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
     
      const pds7 = await db.Tax_Group.findOne({where:{Tax_ID:Tax_ID},
        // require:true,
        include:
        [{model:db.Land,attributes:['Category_doc','Parcel_No','RAI','GNAN','WA','Price','totalPlace','Rate_Price_land','Serial_code_land'],
                include:{model:db.UsefulLand,
                  // require:true,
                  include:{
                    model:db.Building,
                    // require:true,
                    where:{Tax_ID:Tax_ID},
                    
                    attributes:['No_House','Category','Rate_Price_Build','Build_Total_Place','Age_Build'],
                    include:[db.RateOfBuilding,db.BuildingDepreciation,db.UsefulType,db.Land]

                  }
                }
        },
        {
          model:db.Building,
          attributes:['No_House','Category','Rate_Price_Build','Build_Total_Place','Age_Build'],
          include:[db.RateOfBuilding,db.BuildingDepreciation,db.UsefulType,{model:db.UsefulLand,include:[
              {
              model:db.Land,
              attributes:['Category_doc','Parcel_No']
              }
          ]}]

        },
      ]
      })
      // let pds7 = await sequelize.query(`SELECT   B.Build_Id ,U.Useful_RAI,U.Useful_GNAN,U.Useful_WA,L.code_Land,L.Category_doc,L.Parcel_No,B.No_House,B.Category,B.Width,B.Length,B.Rate_Price_Build,B.Build_Total_Place,L.Serial_code_land,
      //                       U.LandCodeLand,LB.BuildingBuildId ,LB.LandCodeLand,L.Tax_ID AS Land_Tax , B.Tax_ID AS Building_Tax,BD.Build_Id AS DepreBuild_ID,BD.Price_depreciate,BD.PriceAfterDepreciation,BD.Depreciate_ID,U.id,L.Rate_Price_land
      //                       FROM Land L 
      //                       LEFT JOIN build_on_land LB ON L.code_land = LB.LandCodeLand LEFT JOIN Building B ON B.Build_Id = LB.BuildingBuildId 
      //                       LEFT JOIN build_own_depreciation BD ON BD.Build_Id = B.Build_Id
      //                       LEFT JOIN UsefulLand U ON L.code_land = U.LandCodeLand AND B.useful_land_id = U.id
      //                       WHERE L.Tax_ID =${Tax_ID} OR B.Tax_ID =${Tax_ID}
                           
      //                       ` )
      
      res.status(200).send(pds7)
  }
  res.status(401).send()
}
const text_tax = async(req,res) => {
  const Tax_ID = req.params.t_id
  
// let test2 = await db.Tax_Group.findAll({where:{Tax_ID:req.params.t_id},
//             attributes:['Tax_ID'],
//             include:
//             {
//               model:db.Land,
//               attributes:['code_land','Category_doc','Parcel_No','Price','Rate_Price_land','Payment_Cus'],
//               include:[{
//                 model:db.UsefulLand,
//                 attributes:['Useful_RAI','Useful_GNAN','Useful_WA','Place','id'],
//                 include:[{
//                     model:db.Building,
//                     attributes:['Build_Id',[sequelize.fn('sum',sequelize.col('PriceAfterDepreciation')),'Total_Price_Build_In_Land']],
//                     include:[
//                         {
//                             model:db.BuildingDepreciation
//                         },
//                         {
//                           model:db.UsefulType
//                         }
//                       ]
//                 }]
                
//               },
//               {
//                 model:db.NextTo
//               }]
//             },
//             group:['Lands.UsefulLands.id'],
//             raw:true,

//     })
let test = await db.UsefulLand.findAll({where:{Tax:Tax_ID},
  attributes:['id',[sequelize.fn('sum',sequelize.col('PriceAfterDepreciation')),'TotalPriceOFbuild']],

include:[
      {
        model:db.Building,
        attributes:['Build_Id','useful_land_id','Tax_ID'],
        // where:{Tax_ID:Tax_ID},
        include:{
       
        model:db.BuildingDepreciation
      },
    
    }
    ],
    group:['id'],
    raw:true,
    separate:true
   
  })
    let selft = await db.UsefulLand.findAll({where:{Tax:Tax_ID},include:{
      model :db.UsefulLand,
      as :'nexto'
    }})
res.send(selft)
}
const convertPDS =(useful,build)=>{

}
module.exports={
    generate_tax,
    build_generate_tax,
    fetch_tax_id,
    list_tax_id,
    text_tax,
    fetch_pds3_byIdTax,
    fetch_pds7_byIdTax
}