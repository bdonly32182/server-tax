const db  = require('../Models');
const Op = db.Sequelize.Op
const { sequelize } = require('../Models')
const {QueryTypes} = require('sequelize') 

const createBuild = async(req,res) => {
    const {Build_Id,Build_Total_Place,rating_id,usefulTypeAll,useful_id} = req.body
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
                     let farm =  await db.FarmType.create(useful);
                     await db.Useful_farm.create({Farm_ID:farm.id,Useful_farm_ID:useful_id});
                    }
                    if (useful.Live_Size) {
                     let live =  await db.LiveType.create(useful);
                     await db.Useful_live.create({Live_ID:live.id,Useful_live_ID:useful_id});
                    }
                    if (useful.Other_Size) {
                      let other =  await db.OtherType.create(useful);
                      await db.Useful_other.create({Other_ID:other.id,Useful_other_ID:useful_id});
                    }
                    if (useful.Empty_Size) {
                      let empty =  await db.EmptyType.create(useful);
                      await db.Useful_empty.create({Empty_ID:empty.id,Useful_empty_ID:useful_id});
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
        let target = req.params.b_id;
        await db.BuildOnUsefulLand.destroy({where:{Build_id_in_Useful:target}})
       await req.building.destroy();
       await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'ลบสิ่งปลูกสร้าง',Category:9});
        return res.status(204).send();
    }
   return res.status(403).send();
}
const build_across_land =async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {obj_useful,ArrType} = req.body
     let land = await   sequelize.query(`select sum(U.Place) as usefulTotalPlace,L.totalPlace from land L left join usefulLand U on L.code_land = U.Land_id 
        where L.code_land ="${obj_useful.Land_id}"`,{type:QueryTypes.SELECT});
        let balancePlace = land[0].totalPlace - land[0].usefulTotalPlace; //พื้นที่ที่เหลือให้ใช้งาน
        console.log(req.body);

        if (obj_useful.Place <= balancePlace) { //เช็คก่อนว่าพื้นที่เหลือให้สร้างมั้ย
         let new_useful =   await db.UsefulLand.create({...obj_useful,isAccross:true})
            for (const useful of ArrType) {
                if (useful.Farm_Size) {
                    await db.Useful_farm.create({Farm_ID:useful.id,Useful_farm_ID:new_useful.useful_id});
                }
                if (useful.Live_Size) {
                    await db.Useful_live.create({Live_ID:useful.id,Useful_live_ID:new_useful.useful_id});
                }
                if (useful.Other_Size) {
                    await db.Useful_other.create({Other_ID:useful.id,Useful_other_ID:new_useful.useful_id});
                }
                if (useful.Empty_Size) {
                    await db.Useful_empty.create({Empty_ID:useful.id,Useful_empty_ID:new_useful.useful_id});
                }
            }
            return res.status(200).send({msg:'สร้างสัดส่วนสิ่งปลูกสร้างที่คร่อมแปลงเรียบร้อยแล้ว'})
        }
        return res.status(203).send({msg:`พื้นที่รหัสแปลงที่ดิน ${obj_useful.Land_id} ไม่เพียงพอ`})
    
    }
    return res.status(403).send()
}
const fetchs_building = async(req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        let buildings = await db.Building.findAll({where:{Build_in_district:req.user.distict_id},include:[
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
        ]})
        return res.status(200).send(buildings)
    }
    return res.status(403).send()
}
const fetch_building = async(req,res) => {
  
    let targetID = req.params.bid
    if (req.user.role === "leader" || req.user.role === "employee"){
        let building = await db.Building.findOne({where:{Build_Id:targetID},include:[
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
        ]}) 
        return res.status(200).send(building)
    }
    return res.status(403).send()
}
const rate_building = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        let rate  = await db.RateOfBuilding.findAll()
        return res.status(200).send(rate)
    }
    return res.status(403).send();
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
    fetch_building,
    fetchs_building,
    rate_building
}