const db = require('../Models')
const Op = db.Sequelize.Op
exports.registMember=(async(req,res)=>{
    let {Pers_no} = req.body
    let employee = await db.Employee.findOne({where:{Pers_no:Pers_no}})
    if (employee===null ) {
        let [newMember,created] = await db.MemberList.findOrCreate({where:{Pers_no:Pers_no},defaults:{...req.body,picture:req.file?req.file.filename:null}})
            //ไม่มีสมาชิกในระบบ และ เมมเบอร์ลิส จึงสมัครได้
        if(created) return res.status(200).send({msg:"สมัครเรียบร้อยแล้ว กรุณารอการอนุมัติ"})
    }
     return res.status(202).send({msg:"รหัสบัตรประชาชนถูกใช้งานแล้ว "})
})

exports.employee_list=(async(req,res)=>{
    if (req.user.role === "leader"  ){
            const emp_list = await db.MemberList.findAll({where:{[Op.and]:
                [
                    {distict_member_id:req.user.distict_id},
                    {role_name:"employee"}
                ]
            }})
           return res.status(200).send(emp_list)
    }
    return res.status(403).send()
    
})

exports.leaderList =(async(req,res)=>{
    if (req.user.role === 'admin'){
        const leader = await db.MemberList.findAll({where:{role_name:"leader"}})
          return  res.status(200).send(leader)
    }
    return res.status(403).send()
   
})


exports.deleteMember =(async(req,res)=>{
    const targetId = req.params.id
    if (req.user.role === 'admin' ||req.user.role === "leader"){
         await db.MemberList.destroy({where:{id:targetId}})
        return res.status(204).send({msg:`delete member id ${targetId} success`})
    }
   return res.status(403).send()
})

