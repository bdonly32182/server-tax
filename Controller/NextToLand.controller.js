const db  = require('../Models')
const Op = db.Sequelize.Op
const ListNextLand =async(req,res)=> {
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        let nexttoland = await db.Land.findAll({where:{[Op.and]:[{Tax_ID:req.params.tax_id},{code_land:{[Op.ne]:req.query.codeland}}]}})
     res.send(nexttoland)
    }
    res.status(401).send()

}
const save_next_land = async(req,res)=>{
    const {Next_Land,LandCodeLand} = req.body
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        let havenextland = await db.NextTo.findOne({where:{[Op.and]:[{Next_Land:Next_Land},{LandCodeLand:LandCodeLand}]}})
        if (havenextland === null) {
          await db.NextTo.create(req.body)
            await db.NextTo.create({
                Next_Land:LandCodeLand,
                LandCodeLand:Next_Land
            })
           return  res.status(200).send("Save success")
        }     
       return res.status(400).send()
    }
    res.status(401).send()
}
const fetchs_next_land =async(req,res) => {
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
         let land = await db.Land.findAll({include:{model:db.NextTo,where:{Next_Land:req.params.nid}}})
        res.send(land)
    }
    res.status(401).send()
    
}
const remove_next_land = async(req,res)=>{
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const {Next_Land,LandCodeLand} = req.body
         await db.NextTo.destroy({where:{[Op.and]:[{Next_Land:Next_Land},{LandCodeLand:LandCodeLand}]}})
         await db.NextTo.destroy({where:{[Op.and]:[{Next_Land:LandCodeLand},{LandCodeLand:Next_Land}]}})

        res.status(204).send({msg:"ลบที่ดินแปลงติดกันเรียบร้อย"})
    }
}
module.exports={
    ListNextLand,
    fetchs_next_land,
    save_next_land,
    remove_next_land
}