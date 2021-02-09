const db = require("../Models");
const Op =db.Sequelize.Op
const edit_farm = async (req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.f_id;
        await db.FarmType.update(req.body,{where:{id:target}});
        return res.status(203).send();

    }
    return res.status(403).send();
}
const delete_farm = async (req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.f_id;
        let Useful = req.query.useful
        await db.Useful_farm.destroy({where:{[Op.and]:[{Farm_ID:target},{Useful_farm_ID:Useful}]}})
        return res.status(203).send();

    }
    return res.status(403).send();
}

const edit_live = async (req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.l_id;
        await db.LiveType.update(req.body,{where:{id:target}});
        return res.status(203).send();
    }
    return res.status(403).send();
}
const delete_live = async (req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let TypeTarget = req.params.l_id;
        let Useful = req.query.useful
        await db.Useful_live.destroy({where:{[Op.and]:[{Live_ID:TypeTarget},{Useful_live_ID:Useful}]}})
        return res.status(203).send();

    }
    return res.status(403).send();
}

const edit_empty = async (req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.e_id;
        await db.EmptyType.update(req.body,{where:{id:target}});
        return res.status(203).send();

    }
    return res.status(403).send();
}
const delete_empty = async (req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.e_id;
        let Useful = req.query.useful
        console.log(target,Useful);
        await db.Useful_empty.destroy({where:{[Op.and]:[{Empty_ID:target},{Useful_empty_ID:Useful}]}})
        return res.status(203).send();

    }
    return res.status(403).send();
}

const edit_other = async (req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.o_id;
        await db.OtherType.update(req.body,{where:{id:target}});
        return res.status(203).send();

    }
    return res.status(403).send();
}
const delete_other = async (req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let TypeTarget = req.params.o_id;
        let Useful = req.query.useful
        await db.Useful_other.destroy({where:{[Op.and]:[{Other_ID:TypeTarget},{Useful_other_ID:Useful}]}});
        return res.status(203).send();

    }
    return res.status(403).send();
}
module.exports = {
 edit_farm,
 delete_farm,
 edit_live,
 delete_empty,
 edit_empty,
 delete_live,
 edit_other,
 delete_other
}