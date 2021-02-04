const db = require('../Models');
const Op = db.Sequelize.Op;
const createCustomer = async(req,res)=>{
    const {category_Cus,Cus_No} =req.body;
    if (req.user.role === "leader" || req.user.role === "employee"){        
           //api นี้สำหรับการสร้างประชาชน และแท็กไอดีจะเป็นอันเดียวกับรหัสบัตรประชาชน
           const checkCus = await db.Customer.findOne({where:{id_customer:`${req.user.distict_id}_${Cus_No}`}})
            if(checkCus)  return res.status(202).send({msg:'เจ้าของทรัพย์สินรายนี้ถูกสร้างเรียบร้อยแล้ว'})
            const customer = await db.Customer.create({...req.body,id_customer:`${req.user.distict_id}_${Cus_No}`,isDistrict_id:req.user.distict_id})
             await db.Tax_Group.create({Category_Tax:category_Cus,Tax_in_district:req.user.distict_id,uid_tax:customer.id_customer})
             await db.Address.create({...req.body,Address_Tax_ID:customer.id_customer})
             await db.Customer_has_tax.create({Customer_Tax_ID:customer.id_customer,Cus_No:customer.id_customer})
             await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'สร้างข้อมูลประชาชน',Category:1})
           return res.status(200).send({msg:"สร้างเจ้าของทรัพย์สินเรียบร้อยแล้ว"})
    }
    res.status(403).send()
    
};
const editCus = async ( req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Customer.update(req.body,{where:{id_customer:req.params.c_id}})
        await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'แก้ไขข้อมูลประชาชน',Category:2})

        return res.status(202).send({msg:"แก้ไขข้อมูลประชาชนเรียบร้อยแล้ว"})
    }
    res.status(403).send()
    
}
const fetchCustomer = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee"){
        const result = await db.Customer.findOne({where:{id_customer:req.params.c_id,isDistrict_id:req.user.distict_id},
        include:[db.Tax_Group]})

        if (result === null) return res.status(400).send({msg:"ไม่มีเจ้าของทรัพย์สินรายนี้"})
        res.send(result)
    }
    res.status(403).send()
   
}
const fetchAll = async(req,res) =>{
    if(req.user.role === "leader" || req.user.role === "employee") {
        const customers = await db.Customer.findAndCountAll({where:{isDistrict_id:req.user.distict_id},
        // offset: 1,
        limit: 3
    })
        res.status(200).send(customers)
    }
    res.status(403).send()
}
const SearchName = async(req,res)=>{
    console.log(req.body);
    if(req.user.role === "leader" || req.user.role === "employee") {
        const customer = await db.Customer.findAll({where:{id_customer:{[Op.notIn]:req.body.cusId}},
                [Op.or]:[
                {Cus_Fname:{[Op.like]:`${req.body.name}%`}},{Cus_Lname:{[Op.like]:`${req.body.name}%`}}
            ]
        })
        if(customer === null) return res.status(400).send() 
       return res.status(200).send(customer)
    }
    res.status(403).send()

}
const pullCustomer = async(req,res)=>{
    if(req.user.role === "leader" || req.user.role === "employee") {
        console.log(req.body);
        let customer = await db.OwnerLand.findAll({where:{[Op.and]:[{Customer_own_id:{[Op.notIn]:req.body.cusId}},{Land_own_id:req.body.code_land}]},
            include:[db.Customer],
            attributes:['Customer.Cus_No']
        });
        return res.status(200).send(customer);
    }
    return res.status(403).send();
}
const deleteCus = async(req,res) =>{
    if (req.user.role === "leader" || req.user.role=== "employee"){
       await db.Customer.destroy({where:{id_customer:req.params.c_id}})
       await db.Tax_Group.destroy({where:{[Op.and]:[{uid_tax:req.params.c_id},{Tax_in_district:req.user.distict_id}]}})
       await db.Address.destroy({where:{Address_Tax_ID:req.params.c_id}})
       await db.Working.create({Emp_ID:req.user.Pers_no,List_working:'ลบข้อมูลประชาชน',Category:3})

      return  res.status(204).send({msg:"ลบเจ้าของทรัพย์สินเรียบร้อยแล้ว"})
    }
    res.status(403).send()
    
}

module.exports={
    createCustomer,
    fetchCustomer,
    editCus,
    deleteCus,
    fetchAll,
    SearchName,
    pullCustomer
};