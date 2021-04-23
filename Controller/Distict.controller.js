const db = require('../Models')
const Op = db.Sequelize.Op
exports.getAll = (async(req,res)=>{
    if(req.user.role === "admin"){
        const district =await db.District.findAll({where:{District_no:{[Op.gt]:0}}})
        return res.status(200).send(district)
    }
   return res.status(401).send()    
})
exports.getById =(async(req,res)=>{
    if(req.user.role === "admin"||req.user.role  === "leader") return res.status(200).send(req.distictId)
    return res.status(401).send()
})
exports.createDistict = (async(req,res)=>{
    if(req.user.role === "admin"){

            const {District_no,District_name} = req.body
            if(req.user.role === "admin") {
                const newDistict = await db.District.create({
                    District_no:District_no,
                    District_name
                }) 
            return res.status(201).send({msg:`คุณสร้างเขต ${District_name} เรียบร้อยแล้ว`})
            }
        return res.status(401).send()
    }
    
})

exports.editDistic =(async(req,res)=>{
    const {District_no,District_name} = req.body
    if(req.user.role === "admin" ||req.user.role  === "leader"){
            await db.District.update(req.body,{
            where:{District_no:req.distictId.District_no}
        })
        res.status(200).send({msg:`Distict Id : ${req.distictId.District_no} has been updated`})
    }
    
})
exports.deleteDisctrict = (async(req,res)=>{
    if(req.user.role === "admin") {
       await req.distictId.destroy()    
          return  res.status(204).send()
    }
   return res.status(401).send()
    
})
exports.findById = (async(req,res,next,id)=>{
    const distictById =await db.District.findOne({where:{District_no:id}})
    req.distictId = distictById
    
    next()
})