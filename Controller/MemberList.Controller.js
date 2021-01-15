const db = require('../Models')
const Op = db.Sequelize.Op
exports.registMember=(async(req,res)=>{
    let {Pers_no} = req.body
    let [newMember,created] = await db.MemberList.findOrCreate({where:{Pers_no:Pers_no},defaults:{...req.body}})
   if(created) return res.status(200).send({msg:"สมัครเรียบร้อยแล้ว กรุณารอการอนุมัติ"})
     return res.status(202).send({msg:"รหัสบัตรประชาชนถูกใช้งานแล้ว กรุณารอการอนุมัติ"})
})

exports.memberList=(async(req,res)=>{
    console.log(req.user.DistrictDistrictNo);
    const emp_list = await db.MemberList.findAll({where:{[Op.and]:
        [
            {DistrictDistrictNo:req.user.DistrictDistrictNo},
            {role_name:"employee"}
        ]
    }})
    console.log(emp_list);
     res.status(200).send(emp_list)
})

exports.leaderList =(async(req,res)=>{
    if (req.user.DistrictDistrictNo !== 0) {
        res.status(400).send({msg:"Not Your Role "})
    }
    const leader = await db.MemberList.findAll({where:{[Op.and]:[
        {role_name:"leader"}
    ]}})
    res.status(201).send(leader)
})


exports.deleteMember =(async(req,res)=>{
    const targetId = req.params.id
    await db.MemberList.destroy({where:{id:targetId}})
 
    res.status(204).send({msg:`delete member id ${targetId} success`})
})

exports.getDistrictById = (async(req,res,next,D_Id)=>{
    //get District and Memberlist role general
        const Id_District = await db.MemberList.findAll({where:{[Op.and]:
            [
                {DistrictDistrictNo:D_Id},
                {role_name:"employee"}
            ]}})
        req.MemberInDistrict = Id_District
        next()
})