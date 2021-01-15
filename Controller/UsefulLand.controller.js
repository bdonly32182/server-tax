const db = require('../Models')
const Op = db.Sequelize.Op
const createUsefulland = async(req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

      await  db.UsefulLand.create(req.body)
    res.status(200).send({msg:"สร้างการใช้ประโยชน์เรียบร้อยแล้ว"})
    }
    res.status(401).send()
}
const updateUseful = async(req,res) => {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await db.UsefulLand.update(req.body,{where:{id:req.useful.id}});
        res.status(201).send({msg:`Useful land id: ${req.useful.id} has been update`});
    }
    res.status(401).send()
}
const fecthUseful = async(req,res) => {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        res.status(200).send(req.useful);
    }
    res.status(401).send()
}
const AllUseful = async(req,res) => {
    const targetIdLand = req.params.idLand;
    const usefulAll = await db.UsefulLand.findAll({where:{LandCodeLand:targetIdLand}});
    res.status(200).send(usefulAll);
}
const deleteUseful = async(req,res) => {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await db.Building.destroy({where:{useful_land_id:req.useful.id}});
        await req.useful.destroy();
        res.status(204).send({msg:`delete useful success`});
    }
    
}
const UsefulById = async(req,res,next,u_id) =>{
    const useful =  await db.UsefulLand.findOne({where:{id:u_id},include:[{model:db.Building,include:[{model:db.UsefulType,
        attributes:['Percent_FARM','Percent_LIVE','Percent_FORRENT','Percent_OTHER','Percent_EMPTY','Name_Type','Farm_Size','Live_Size','For_Rent_Size','Empy_size','Other_Size','Live_YourSelf',
                    [db.sequelize.literal('Percent_FARM+Percent_LIVE+Percent_FORRENT+Percent_OTHER+Percent_EMPTY'),'totalAVG']]},
        db.BuildingDepreciation,db.Customer,db.RateOfBuilding,db.Land]}]});
    req.useful = useful;
    next();
}
module.exports ={
    createUsefulland,
    updateUseful,
    deleteUseful,
    UsefulById,
    AllUseful,
    fecthUseful
}