const db = require('../Models');
const Op = db.Sequelize.Op;

const create_owner_build = async(req,res)=>{
    const {Build_Id,Cus_No} = req.body
    console.log(Cus_No);
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){

        const customer = await db.Customer.findOne({where:{Cus_No:Cus_No}})
        console.log(customer);
        const build = await db.Building.findOne({where:{Build_Id:Build_Id}})
        if (build.Cus_Payment === null && customer != null) {
            build.Cus_Payment = customer.Cus_No
             await  build.save()
            return res.status(200).send()

        }
        if (build.Cus_Payment === null && customer === null) {
             build.Cus_Payment = Cus_No
            await  build.save()
            const newCustomer = await db.Customer.create(req.body)
            const tax = await db.Tax_Group.create({Tax_ID:newCustomer.Cus_No})
             await db.Customer_has_tax.create({Tax_ID:tax.Tax_ID,Cus_No:newCustomer.Cus_No})
            await db.OwnerBuilding.create({Cus_No:newCustomer.Cus_No,Build_Id:Build_Id})
            
            return res.status(200).send()

        }
        if (customer === null) {
            //เลือกจากในระบบ
            const newCustomer = await db.Customer.create(req.body)
            const tax = await db.Tax_Group.create({Tax_ID:newCustomer.Cus_No})
             await db.Customer_has_tax.create({Tax_ID:tax.Tax_ID,Cus_No:newCustomer.Cus_No})
            await db.OwnerBuilding.create({Cus_No:newCustomer.Cus_No,Build_Id:Build_Id})
            return res.status(200).send()

        } else {
            //มี ข้อมูลลูกค้าอยู่ในระบบแล้ว แต่ก็สร้างลูกค้าใหม่โดยที่บัตรประชาชนเหมือนกัน 
            await db.Customer.update(req.body,{where:{Cus_No:Cus_No}})
            await db.OwnerBuilding.create({Cus_No:Cus_No,Build_Id:Build_Id})
            return res.status(200).send()
        }
        
    }
    return res.status(400).send()
}

const cancel_owner_build = async(req,res)=> {
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const build = await db.Building.findOne({where:{Build_Id:req.params.id}})
        if (build&&build.Cus_Payment === req.query.customer) {
            build.Cus_Payment = null
            build.save()
        }
        const ownerbuild = await db.OwnerBuilding.findOne({where:{[Op.and]:[{Build_Id:build.Build_Id,Cus_No:req.query.customer}]}})
        await ownerbuild.destroy()
        res.status(204).send()
    }
    res.status(400).send()
}

module.exports={
    create_owner_build,
    cancel_owner_build
}