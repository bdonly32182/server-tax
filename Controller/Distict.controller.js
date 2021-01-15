const db = require('../Models')
const Op = db.Sequelize.Op
exports.getAll = (async(req,res)=>{
    if(req.user.Role.Role_name === "admin"){
        const district =await db.District.findAll({where:{District_no:{[Op.gt]:0}}})
         res.status(200).send(district)
    }
    res.status(401).send()    
})
exports.getById =(async(req,res)=>{
    if(req.user.Role.Role_name === "admin")res.status(200).send(req.distictId)
    res.status(401).send()
})
exports.createDistict = (async(req,res)=>{
    const {District_no,District_name} = req.body
    if(req.user.Role.Role_name === "admin") {
        const newDistict = await db.District.create({
            District_no:District_no,
            District_name
        }) 
        res.status(201).send({msg:`คุณสร้างเขต ${District_name} เรียบร้อยแล้ว`})
    }
    res.status(401).send()

    
})

exports.editDistic =(async(req,res)=>{
    const {District_no,District_name} = req.body
    if(req.user.Role.Role_name === "admin"){
            await db.District.update({
            District_no:District_no,
            District_name:District_name
        },{
            where:{District_no:req.distictId.District_no}
        })
        res.status(200).send({msg:`Distict Id : ${req.distictId.District_no} has been updated`})
    }
    
})
exports.deleteDisctrict = (async(req,res)=>{
    if(req.user.Role.Role_name === "admin") {
       await req.distictId.destroy()    
            res.status(204).send()
    }
    res.status(401).send()
    
})
exports.findById = (async(req,res,next,id)=>{
    const distictById =await db.District.findOne({where:{District_no:id}})
    req.distictId = distictById
    
    next()
})