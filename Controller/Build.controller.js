const db  = require('../Models');
const Op = db.Sequelize.Op
// const createBuild = async(req,res) => {
//     const {Age_Build,Category,LandCodeLand,Build_Id,rating_id,Build_Total_Place} =req.body
//     let bulkdata=[]
//     console.log(Build_Id);
//     await req.body.customer.map(cus=> bulkdata.push({Cus_No:cus.Cus_No,Build_Id}))
//     if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
//         const rate_price = await db.RateOfBuilding.findOne({where:{Code:rating_id}})
//         if (Age_Build >19 &&Category==="ไม้") {
//             const [building,created] =await db.Building.findOrCreate({where:{Build_Id:Build_Id},defaults:{...req.body,Rate_Price_Build:Build_Total_Place*rate_price.Rate_Price,Cus_Payment:req.body.customer[0].Cus_No,Land_main:LandCodeLand}});
//                 const depreciation = await db.BuildingDepreciation.findOne({where:{id:57}})    
//             console.log(building);
//             if (!created) return res.status(400).send() 
//             await db.Build_And_Depreciation.create({Build_ID:building.Build_Id,Depreciate_ID:57,Price_depreciate:(building.Rate_Price_Build * depreciation.Percent)/100,  PriceAfterDepreciation:building.Rate_Price_Build})
//             await db.UsefulType.create({building_id:building.Build_Id,...req.body})
//             await db.OwnerBuilding.bulkCreate(bulkdata)
//             await db.BuidOnLand.create({BuildingBuildId:building.Build_Id,LandCodeLand:LandCodeLand})
//            return res.status(200).send({msg:`สร้างสิ่งปลูกสร้างเรียบร้อยแล้ว`})

//         }
//         if (Age_Build >21 && Category==="ครึ่งตึกครึ่งไม้") {
//             const [building,created] =await db.Building.findOrCreate({where:{Build_Id:Build_Id},defaults:{...req.body,Rate_Price_Build:Build_Total_Place*rate_price.Rate_Price,Cus_Payment:req.body.customer[0].Cus_No,Land_main:LandCodeLand}});
//             const depreciation = await db.BuildingDepreciation.findOne({where:{id:63}})    

//             if (!created) return res.status(400).send()
//             await db.Build_And_Depreciation.create({Build_ID:building.Build_Id,Depreciate_ID:63,Price_depreciate:(building.Rate_Price_Build * depreciation.Percent)/100,  PriceAfterDepreciation:building.Rate_Price_Build})

//             await db.UsefulType.create({building_id:building.Build_Id,...req.body})
//             await db.OwnerBuilding.bulkCreate(bulkdata)
//             await db.BuidOnLand.create({BuildingBuildId:building.Build_Id,LandCodeLand:LandCodeLand})
//            return res.status(200).send({msg:`สร้างสิ่งปลูกสร้างเรียบร้อยแล้ว`})

//         }
//         if (Age_Build >42 && Category==="ตึก") {
//             const [building,created] =await db.Building.findOrCreate({where:{Build_Id:Build_Id},defaults:{...req.body,Rate_Price_Build:Build_Total_Place*rate_price.Rate_Price,Cus_Payment:req.body.customer[0].Cus_No,Land_main:LandCodeLand}});
//             const depreciation = await db.BuildingDepreciation.findOne({where:{id:84}})    
//             if (!created) return res.status(400).send()
//             await db.Build_And_Depreciation.create({Build_ID:building.Build_Id,Depreciate_ID:84,Price_depreciate:(building.Rate_Price_Build * depreciation.Percent)/100,  PriceAfterDepreciation:building.Rate_Price_Build})
//             await db.UsefulType.create({building_id:building.Build_Id,...req.body})
//             await db.OwnerBuilding.bulkCreate(bulkdata)
//             await db.BuidOnLand.create({BuildingBuildId:building.Build_Id,LandCodeLand:LandCodeLand})
//            return res.status(200).send({msg:`สร้างสิ่งปลูกสร้างเรียบร้อยแล้ว`})

//         }
//         const depreciation = await db.BuildingDepreciation.findOne({where:{[Op.and]:[{Category:Category},{Age_Build:Age_Build}]}})    
//         const [building,created] =await db.Building.findOrCreate({where:{Build_Id:Build_Id},defaults:{...req.body,Rate_Price_Build:Build_Total_Place*rate_price.Rate_Price,Cus_Payment:req.body.customer[0].Cus_No,Land_main:LandCodeLand}}); 
//         if (!created) return res.status(400).send()
//         await db.Build_And_Depreciation.create({Build_ID:building.Build_Id,Depreciate_ID:depreciation.id,Price_depreciate:(building.Rate_Price_Build * depreciation.Percent)/100,  PriceAfterDepreciation:building.Rate_Price_Build})
//             await db.UsefulType.create({building_id:building.Build_Id,...req.body})
//              await db.BuidOnLand.create({BuildingBuildId:building.Build_Id,LandCodeLand:LandCodeLand})
//             await db.OwnerBuilding.bulkCreate(bulkdata)
//            return res.status(200).send({msg:`สร้างสิ่งปลูกสร้างเรียบร้อยแล้ว`})

//     }
//    res.status(401).send()
// }
const createBuild = async(req,res) => {
    const {Build_Id,Build_Total_Place,rating_id,usefulTypeAll,Percent_Age,useful_id} = req.body
    if (req.user.role === "leader" || req.user.role === "employee") {
            const rate = await db.RateOfBuilding.findOne({where:{Code:rating_id}});
            const [building,created] = await db.Building.findOrCreate({where:{Build_Id:Build_Id},
                defaults:{...req.body,Rate_Price_Build:Build_Total_Place*rate.Rate_Price,
                    Build_in_district:req.user.distict_id,
                    PriceDepreciation:0,
                    AfterPriceDepreciate:0
                }});
            if (created) {
                await db.BuildOnUsefulLand.create({
                    Build_id_in_Useful:building.Build_Id,
                    Useful_land_id:useful_id
                });
                await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'สร้างสิ่งปลูกสร้าง',Category:7})
                for (const useful of usefulTypeAll) {
                    if (useful.Farm_Size) {
                        await db.FarmType.create(useful)
                    }
                    if (useful.Live_Size) {
                        await db.LiveType.create(useful)
                    }
                    if (useful.Other_Size) {
                        await db.OtherType.create(useful)
                    }
                    if (useful.Empty_Size) {
                        await db.EmptyType.create(useful)
                    }
                }
            }
            return res.status(200).send()
    }
    return res.status(403).send()
}
const updateBuild = async(req,res) => {
         const {Age_Build,Category,rating_id,Build_Total_Place,usefulTypeAll} =req.body
    if (req.user.role === "leader" || req.user.role=== "employee"){
        const rate_price = await db.RateOfBuilding.findOne({where:{Code:rating_id}})
         await db.Building.update({
             ...req.body,Rate_Price_Build:Build_Total_Place*rate_price.Rate_Price,
             PriceDepreciation:0,
            AfterPriceDepreciate:0},
            {where:{Build_Id:req.building.Build_Id}});
            await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'แก้ไขสิ่งปลูกสร้าง',Category:8})
            for (const useful of usefulTypeAll) {
                if (useful.Farm_Size) {
                    await db.FarmType.update(useful,{where:{id:useful.id}})
                }
                if (useful.Live_Size) {
                    await db.LiveType.update(useful,{where:{id:useful.id}})
                }
                if (useful.Other_Size) {
                    await db.OtherType.update(useful,{where:{id:useful.id}})
                }
                if (useful.Empty_Size) {
                    await db.EmptyType.update(useful,{where:{id:useful.id}})
                }
            }
        return res.status(202).send({msg:`has been update building success`});

    }
   return res.status(401).send()
}
const deleteBuild = async(req,res) => {
    if (req.user.role=== "leader" || req.user.role === "employee"){
       await req.building.destroy();
       await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'ลบสิ่งปลูกสร้าง',Category:9});

    }
   return res.status(403).send()
}
const build_across_land =async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
    await db.BuidOnLand.create(req.body)
    return res.status(200).send()
    }
    return res.status(401).send()
}
const cancle_build_across = async (req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.BuidOnLand.destroy({where:{[Op.and]:[{BuildingBuildId},{LandCodeLand}]}})
        return res.status(204).send()
    }
    return res.status(401).send()
}
const BuildById = async(req,res,next,b_id) =>{
    const build = await db.Building.findOne({where:{Build_Id:b_id}});
    req.building = build;
    next()
}


module.exports = {
    BuildById,
    createBuild,
    updateBuild,
    deleteBuild,
    build_across_land,
    cancle_build_across
}