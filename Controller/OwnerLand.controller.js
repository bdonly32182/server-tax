const db  = require('../Models')
const Op = db.Sequelize.Op
const relationLandAndCus = async(req,res)=>{
    const {LandCodeLand,Customer,Line_No} = req.body
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
            const customer = await db.Customer.findOne({where:{Cus_No:Customer.Cus_No}})
            console.log(customer);
           const land = await db.Land.findOne({where:{code_land:LandCodeLand}})
           if (land.Payment_Cus === null && customer) {
               land.Payment_Cus =Customer.Cus_No
              await land.save()
           }
        if (customer === null) {
        const newCus = await db.Customer.create(req.body.Customer)
        const tax = await db.Tax_Group.create({Tax_ID:newCus.Cus_No})
        await db.Customer_has_tax.create({Tax_ID:tax.Tax_ID,Cus_No:newCus.Cus_No})
                await db.OwnerLand.create({
                    CustomerCusNo:newCus.Cus_No,
                    LandCodeLand:LandCodeLand,
                    Line_No
                })
        }  
       if(customer) {
             await db.Customer.update(req.body.Customer,{where:{Cus_No:customer.Cus_No}})
             await db.OwnerLand.findOrCreate({where:{[Op.and]:[{CustomerCusNo:customer.Cus_No},{LandCodeLand:LandCodeLand}]},defaults:{
                CustomerCusNo:customer.Cus_No,
                LandCodeLand:LandCodeLand,
                Line_No:Line_No

             }})
        }
    
        res.status(200).send({msg:"เป็นเจ้าของที่ดินเรียบร้อยแล้ว"})
    }
    res.status(401).send()

}
const cancle_owner = async(req,res) => {
    const targetId = req.body.id
    const code_land = req.body.codeland
    // const customers = req.body.customer
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        const land = await db.Land.findOne({where:{Payment_Cus:targetId}})
        if(land &&land.Payment_Cus !== null) {
            land.Payment_Cus = null
            await land.save()
        }
        const owner= await db.OwnerLand.findOne({where:{[Op.and]:[{CustomerCusNo:targetId},{LandCodeLand:code_land}]}});
        await owner.destroy()
       
        res.status(204).send()
    }
    res.status(401).send()
    

}
module.exports ={
   
    relationLandAndCus,
    cancle_owner
}