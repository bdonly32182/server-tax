const db = require('../Models');
const readXlsxFile = require('read-excel-file/node');
let poolWorker = require('workerpool');
let pool = poolWorker.pool();
const Op = db.Sequelize.Op
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
//upload land
const uploadLand = async ( req,res) => {
  //จากกรมธนารักษ์
    if (req.user.role === "leader" ) {
        try { 
            if (req.file == undefined) {
              return res.status(200).send({
                message: "Please Upload excel file: " + req.file.originalname,
              })
            }
            let path =
              __basedir + "/resource/upload/" + req.file.filename;
            readXlsxFile(path).then(async(rows) => {
                  //skip header
                  const {count,row} = await db.Land.findAndCountAll({where:{distict_id:req.user.distict_id}})
                  rows.shift();
                  rows.forEach(async(row,index) => {
                    let splitPlace = row[8].toString().split("-");
                    let land = {
                      Serial_code_land: count+index+1,
                      code_land: `${req.user.District.Abbreviations}${row[6]}-${row[5]}-${row[7]}`,
                      Tambol_name: row[1],
                      UTM_Code: row[2],
                      UTM_No:row[3],
                      UTM_Map: row[4],
                      Land_No: row[5],
                      Parcel_No: row[6],
                      Survey_No: row[7],
                      RAI:splitPlace[0],
                      GNAN:splitPlace[1],
                      WA:splitPlace[2],
                      Price:row[9],
                      Category_doc:"โฉนด",
                      distict_id:req.user.distict_id,
                      totalPlace:0,
                      Rate_Price_land:0
                    };
              
                 const [isLand,created] = await db.Land.findOrCreate({where:{code_land:land.code_land},defaults:land});
                 await db.RateLand.create({Price_thanaruk:row[9],land_id:isLand.code_land});
                 if (!created) {
                   await db.Land.update(land,{where:{code_land:land.code_land}})
                 }
                });
            });
              await unlinkAsync(path);
              return res.status(200).send({
                message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
            });
          } catch (error) {
          console.log('error');
          }
    }
};
const uploadLandPriceZero = async(req,res)=> {
  if (req.user.role === "leader" ) {
    try { 
        if (req.file == undefined) {
          return res.status(200).send({
            message: "Please Upload excel file: " + req.file.originalname,
          })
        }
        let path =
          __basedir + "/resource/upload/" + req.file.filename;
        readXlsxFile(path).then(async(rows) => {
          const {count,row} = await db.Land.findAndCountAll({where:{distict_id:req.user.distict_id}})
            rows.shift();
            rows.forEach(async(row,index) => {
              let splitPlace = row[8].toString().split("-");
              let land = {
                Serial_code_land: count+index+1,
                code_land: `${req.user.District.Abbreviations}${row[1]}-${row[3]}-${row[2]}`,
                Tambol_name: row[0],
                UTM_Code: row[4],
                UTM_No:row[5],
                UTM_Map: row[6],
                Land_No: row[3],
                Parcel_No: row[1],
                Survey_No: row[2],
                RAI:row[7],
                GNAN:row[8],
                WA:+row[9]+ +row[10],
                Price:0,
                Category_doc:"โฉนด",
                distict_id:req.user.distict_id,
                totalPlace:0,
                Rate_Price_land:0
              };
        
          const [isLand,created] = await db.Land.findOrCreate({where:{code_land:land.code_land},defaults:land});
          await db.RateLand.create({Price_thanaruk:0,land_id:isLand.code_land});
          if (!created) {
            await db.Land.update(land,{where:{code_land:land.code_land}})
          }
          });
        });
          await unlinkAsync(path);
          return res.status(200).send({
            message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
        });
      } catch (error) {
      console.log('error');
      }
}
};
const uploadCustomers = async(req,res)=>{
  if (req.user.role === "leader" ) {
    const {District:{Abbreviations},distict_id} = req.user
    try { 
      if (req.file == undefined) {
        return res.status(200).send({
          message: "Please Upload excel file: " + req.file.originalname,
        })
      }
      let path =
        __basedir + "/resource/upload/" + req.file.filename;
      readXlsxFile(path).then(async(rows) => {
          rows.shift();
          rows.forEach(async(row,index) => {
            let customer = {
              id_customer:row[0]?`${distict_id}_${row[0]}`:`Guest${index+1}`,
              Cus_No:row[0]?`${row[0]}`:`Guest${index+1}`,
              title:row[1],
              Cus_Fname:row[2],
              Cus_Lname:row[3],
              Tambol:row[4],
              district_name:row[5],
              Changwat:row[6],
              isDistrict_id:distict_id
            }
           
          const [isCustomer,createdCustomer] = await db.Customer.findOrCreate({where:{id_customer:customer.id_customer},defaults:customer});
          if (createdCustomer) {
            await db.Tax_Group.create({uid_tax:customer.id_customer,
                                      Tax_in_district:distict_id});
            await db.Customer_has_tax.create({Cus_No:customer.id_customer,
                                      Customer_Tax_ID:customer.id_customer});
            await db.Address.create({Tambol:customer.Tambol,
              district_name:customer.district_name,Changwat:customer.Changwat,
              Address_Tax_ID:customer.id_customer
            });
          }
        
        });
      });
        await unlinkAsync(path);
        return res.status(200).send({
          message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
      });
    } catch (error) {
    console.log('error');
    }

  }
};
const uploadRelationLand = async(req,res)=> {
  if (req.user.role === "leader" ) {
    const {District:{Abbreviations},distict_id} = req.user

    try { 
        if (req.file == undefined) {
          return res.status(200).send({
            message: "Please Upload excel file: " + req.file.originalname,
          })
        }
        let path =
          __basedir + "/resource/upload/" + req.file.filename;
        readXlsxFile(path).then((rows) => {
            rows.shift();
            rows.forEach(async(row,index) => {
              let ownerland = {
                Customer_own_id:row[3]?`${distict_id}_${row[3]}`:`Guest${index+1}`,
                Land_own_id:`${Abbreviations}${row[0]}-${row[2]}-${row[1]}`
              }
              let land = await db.Land.findOne({where:{code_land:ownerland.Land_own_id}});
              let customer = await db.Customer.findOne({where:{id_customer:ownerland.Customer_own_id}});
              if (land && customer) {
                await db.OwnerLand.create(ownerland)
              }
            });
        });
          await unlinkAsync(path);
          return res.status(200).send({
            message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
          })
      } catch (error) {
      console.log('error');
      }
  }
};
//upload condo
const uploadCondo = async(req,res)=>{
  if (req.user.role === "leader" ) {
    const {distict_id} = req.user

    try{
      if (req.file === undefined) {
        return res.status(200).send({
          message: "Please Upload excel file: " + req.file.originalname,
        })
      }
      let path = __basedir + "/resource/upload/" + req.file.filename;
      readXlsxFile(path).then((rows) => {
        rows.shift();
        rows.forEach(async(row)=>{
          let condo = {
            Register_no:`${row[1]}`,
            Condo_name:row[2],
            Build_Name:row[3],
            Country:row[0],
            distict_id
          }
        const [isCondo,created] =  await db.Condo.findOrCreate({where:{[Op.and]:[{Register_no:`${row[1]}`},{Condo_name:`${row[2]}`},{Build_Name:`${row[3]}`}]},defaults:condo})
        });
      });
       await unlinkAsync(path);
       return res.status(200).send({
            message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
        })
    }catch (err){
      console.log(err);
    }
  }
}
const uploadRoom = async(req,res)=> {
  if (req.user.role === "leader" ) {
    const {District:{Abbreviations},distict_id} = req.user

      try {
        if (req.file === undefined ) {
          return res.status(200).send({
            message: "Please Upload excel file: " + req.file.originalname,
          })
        }
        let path =
          __basedir + "/resource/upload/" + req.file.filename;
          readXlsxFile(path).then((rows) => {
            rows.shift();
            rows.forEach(async(row)=>{
              
               
                let room = {
                  Floor:row[4],
                  Room_no:row[5]
                }
                const tax = await db.Tax_Group.findOne({where:{uid_tax:`${distict_id}_${row[7]}`}})
             
                if (tax) {
                  
                    const isCondo = await db.Condo.findOne({where:{[Op.and]:[{Register_no:`${row[1]}`},{Condo_name:`${row[2]}`},{Build_Name:`${row[3]}`}]}});
                    const [isRoom,createdRoom] = await db.Room.findOrCreate({where:{Room_no:room.Room_no},defaults:{...room,
                                              Condo_no:isCondo.id,Room_Tax_ID:tax.uid_tax}})
                    const [isType,createType] = await db.Useful_room.findOrCreate({where:{room_id:isRoom.id},defaults:{
                    Amount_Place:row[6],room_id:isRoom.id
                  }})
                }
               
            });
          });
          await unlinkAsync(path);
          return res.status(200).send({
            message: "อัพโหลดไฟล์: " + req.file.originalname +" เสร็จเรียบร้อยแล้ว",
          })
      } catch (err) {
        console.log(err);
      }
    
  }
}
//upload district
const uploadDistrict = async(req,res)=>{
  if (req.user.role === "admin" ) {
    try {
      if (req.file === undefined) {
        return res.status(200).send({
          message: "Please Upload excel file: " + req.file.originalname,
        })
      }
      let path =
      __basedir + "/resource/upload/" + req.file.filename;
      readXlsxFile(path).then(async(rows) => {
        rows.shift();
        let districts = [];
        rows.forEach(row=>{
          let district_no =row[0].toString().slice(2,4)
          let district = {
            District_no: district_no,
            District_name:row[1],
            Address_Tambol:row[2],
            Address_District:row[1],
            Address_Country:"กรุงเทพมหานคร",
            Tel:row[4],
            Address_PostNo:row[5],
            Abbreviations:row[3],
          }
          districts.push(district)
        })
        await db.District.bulkCreate(districts);
      })
        await unlinkAsync(path);
        return res.status(200).send({message:"สร้างข้อมูลเขตทั้งหมดเรียบร้อยแล้ว"})
    } catch (error) {
      console.log('error');
    }
    
  }
  // return res.status(403).send();
};
//upload rate building
const uploadRateBuilding = async(req,res)=>{
  if (req.user.role === "admin" ) {
    try {
      if (req.file === undefined) {
        return res.status(200).send({
          message: "Please Upload excel file: " + req.file.originalname,
        })
      }
      let path =
      __basedir + "/resource/upload/" + req.file.filename;
      readXlsxFile(path).then(async(rows) => {
        rows.shift();
        let rates = [];
        rows.forEach(row=>{
          let rate = {
            Code: row[0],
            Category_build:row[1],
            Rate_Price:row[2],
            
          }
          rates.push(rate)
        })
        await db.RateOfBuilding.bulkCreate(rates);
      })
        await unlinkAsync(path);
        return res.status(200).send({message:"สร้างข้อมูลราคาประเมินสิ่งปลูกสร้างเรียบร้อยแล้ว"})
    } catch (error) {
      console.log('error');
    }
    
  }
}

module.exports={
    uploadLand,
    uploadDistrict,
    uploadLandPriceZero,
    uploadRelationLand,
    uploadCustomers,
    uploadCondo,
    uploadRoom,
    uploadRateBuilding
}