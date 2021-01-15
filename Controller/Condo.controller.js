const db = require('../Models')
const Op = db.Sequelize.Op
const create_condo =async(req,res)=> {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

        await db.Condo.create(req.body)
        res.status(200).send()
    }
    res.status(401).send()
}

const edit_condo = async(req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

        await db.Condo.update(req.body,{where:{Register_no:req.params.con_id}})
        res.status(202).send()
    }
    res.status(401).send()
}
const  fetchs_all_condo = async(req,res)=> {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const condo = await db.Condo.findAll({where:{DistrictDistrictNo:req.user.DistrictDistrictNo}})
        res.status(200).send(condo)
    }
    res.status(401).send()
}
const fetch_condo = async(req,res) => {
    //fetch condo first
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const condo = await db.Condo.findOne({where:{[Op.and]:[{DistrictDistrictNo:req.user.DistrictDistrictNo},{Register_no:req.params.con_id}]},include:{model:db.Room,where:{Floor:1}}})
        res.status(200).send(condo)
    }
    res.status(401).send()
}
const delete_condo = async(req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await db.Condo.destroy({where:{Register_no:req.params.con_id}})
        res.status(204).send()
    }
    res.status(401).send()
}

module.exports={
    fetch_condo,
    fetchs_all_condo,
    edit_condo,
    create_condo,
    delete_condo
}