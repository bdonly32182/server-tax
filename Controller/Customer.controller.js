const db = require('../Models');
const createCustomer = async(req,res)=>{
    // const {Num_House,Moo,Road_Name,Soi,Tambol,district_name,Changwat,Post_No} =req.body;
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
            // const address = await db.Address.create({
            // Num_House,Moo,Road_Name,Soi,Tambol,district_name,Changwat,Post_No
            // })
            // if(address === null) return res.status(400).send() 
           
            const customer = await db.Customer.create(req.body)
             const tax = await db.Tax_Group.create({Tax_ID:customer.Cus_No})
             await db.Customer_has_tax.create({Tax_ID:tax.Tax_ID,Cus_No:customer.Cus_No})
            res.status(200).send({msg:"สร้างเจ้าของทรัพย์สินเรียบร้อยแล้ว"})
    }
    res.status(401).send()
    
};
const editCus = async ( req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await db.Customer.update(req.body,{where:{Cus_No:req.customer.Cus_No}})
         res.status(202).send({msg:"แก้ไขเจ้าของทรัพย์สินเรียบร้อยแล้ว"})
    }
    res.status(401).send()
    
}
const fetchCustomer = (req,res)=>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        if (req.customer === null) return res.status(400).send({msg:"ไม่มีเจ้าของทรัพย์สินรายนี้"})
        res.send(req.customer)
    }
    res.status(401).send()
   
}
const fetchAll = async(req,res) =>{
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee") {
        const customers = await db.Customer.findAll({include:[db.Land,db.Building]})
        if(customers === null)return res.status(400).send()
        res.status(200).send(customers)
    }
    res.status(401).send()
}
const SearchName = async(req,res)=>{
    console.log(req.body);
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee") {
        const customer = await db.Customer.findAll({where:{Cus_Fname:req.params.name}})
        if(customer === null) return res.status(400).send() 
       return res.status(200).send(customer)
    }
    res.status(401).send()

}
const address_send = async(req,res)=>{
    if(req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee") {
       const [address,created]= await db.Address.findOrCreate({where:{Cus_No:req.body.Cus_No},defaults:req.body})
       if (created) await db.Address.update(req.body,{where:{id:address.id}})
       return res.status(200).send()
    }
    res.status(401).send()

}
const deleteCus = async(req,res) =>{
    if (req.user.Role.Role_name === "leader" || req.user.Role.Role_name === "employee"){
        await req.customer.destroy()
        res.status(204).send({msg:"ลบเจ้าของทรัพย์สินเรียบร้อยแล้ว"})
    }
    res.status(400).send()
    
}
const cusById = async(req,res,next,c_id)=>{
    console.log("idddddddddd  ",c_id);
        const result = await db.Customer.findOne({where:{Cus_No:c_id}})
    //    const result = await db.Customer.findOne({where:{Cus_No:c_id},include:[db.Land,db.Room,{model:db.Tax_Group,include:{model:db.Customer}},{model:db.Building,include:[db.RateOfBuilding]}]})
            req.customer = result
            next()
        
}
module.exports={
    createCustomer,
    cusById,
    fetchCustomer,
    editCus,
    deleteCus,
    fetchAll,
    SearchName,
    address_send

};