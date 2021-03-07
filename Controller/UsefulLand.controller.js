const db = require('../Models')
const Op = db.Sequelize.Op
const { sequelize, Sequelize } = require('../Models')

const createUsefulland = async(req,res) =>{
    if (req.user.role === "leader" || req.user.role === "employee"){

      await  db.UsefulLand.create(req.body)
      return res.status(200).send({msg:"สร้างการใช้ประโยชน์เรียบร้อยแล้ว"})
    }
    res.status(402).send()
}
const updateUseful = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        const targetUseful = req.params.u_id;
        await db.UsefulLand.update(req.body,{where:{useful_id:targetUseful}});
        return res.status(201).send();
    }
    res.status(402).send()
}
const fecthUseful = async(req,res) => {
    let useful_id = req.query.useful_id
    if (req.user.role === "leader" || req.user.role === "employee"){
        let useful = await db.UsefulLand.findOne({where:{useful_id:useful_id},
                include:[
                    {
                        model:db.UsefulLand,
                        as:'Useful',
                        include:{
                            model:db.Land,
                            // where:{code_land:{[Op.ne]:Sequelize.col('Land_id')}},
                            attributes:['Parcel_No','Land_No','Survey_No']
                        }
                    },
                    {
                        model:db.BuildOnUsefulLand,
                        include:{
                            model:db.Building,
                            include:[db.RateOfBuilding,                              
                                    db.LiveType, db.FarmType,db.EmptyType,db.OtherType,
                                    {
                                        // ผู้เสียภาษี
                                        model:db.Tax_Group,
                                        include:[db.Customer]
                                    },
                                    {//คร่อมแปลง เพื่อเอาไปเซ็ทรหัสการใช้ประโยชน์
                                        model:db.BuildOnUsefulLand,
                                        include:[db.UsefulLand]
                                    }
                                    ]
                        }
                    },{model:db.UsefulLand,as:'Useful'},
                    {model:db.LiveType,//เอาไปทำสัดส่วน
                        include:[{
                            model:db.Building,
                            attributes:['No_House']
                        }]
                    },
                    {model:db.FarmType,
                        include:[{
                            model:db.Building,
                            attributes:['No_House']
                        }]
                    },
                    {model:db.EmptyType,
                        include:[{
                            model:db.Building,
                            attributes:['No_House']
                        }]
                    },
                    {model:db.OtherType,
                        include:[{
                            model:db.Building,
                            attributes:['No_House']
                        }]
                    }
                ]
        });
       
       return res.status(200).send(useful);
    }
   return res.status(402).send()
}
const UsefulInLand = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        const targetIdLand = req.params.idLand;
        const usefulAll = await db.UsefulLand.findAll({where:{Land_id:targetIdLand}});
        return res.status(200).send(usefulAll);
    }
    res.status(402).send()

}
const deleteUseful = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee"){
        let targetUseful = req.params.u_id;
        await sequelize.query(`delete  from building B where B.Build_Id in( 
            select UB.Build_id_in_Useful from build_on_useful_land UB where UB.Useful_land_id = '${targetUseful}')`)
        await db.BuildOnUsefulLand.destroy({where:{Useful_land_id:targetUseful}});
        // await db.Building.destroy({where:{on_useful_id:targetUseful}});
        await db.UsefulLand.destroy({where:{useful_id:targetUseful}});
       return res.status(204).send({msg:`delete useful success`});
    }

    return res.status(403).send();
}
const SearchName = async(req,res) => {
    let name = req.query.name
    if (req.user.role === "leader" || req.user.role === "employee"){
        let customer = await db.Customer.findAll({where:{[Op.and]:[{Cus_Fname:{[Op.like]:`${name}%`}},{'$Tax_Groups.Category_Tax$':{[Op.ne]:"รัฐบาล"}}]},
            include:{
                model : db.Tax_Group,
                include:db.Customer
            },
            attributes:['id_customer']
    })
        // let tax = await db.Tax_Group.findAll({
        //     where:{'$Customers.Cus_Fname$':{[Op.like]:`${name}%`}},
        //     include:{
        //     model:db.Customer  
        // }})
        return res.status(200).send(customer)
    }
    return res.status(403).send();
}
const UsefulSameTax = async(req,res) => {
    let targetTax = req.params.taxID
    let useful_id = req.query.useful_id
    let TypeName = req.query.TypeName
    if (req.user.role === "leader" || req.user.role === "employee"){
        let useful = await db.UsefulLand.findAll({where:{[Op.and]:[{UsefulLand_Tax_ID:targetTax},{useful_id:{[Op.ne]:useful_id}},{TypeName:{[Op.eq]:TypeName}}]},
            include:{
            model:db.Land,
            // where:{code_land:{[Op.ne]:Sequelize.col('Land_id')}},
            attributes:['Parcel_No','Land_No','Survey_No']
        }});
        res.status(200).send(useful);
    }
    return res.status(403).send();
}
const selectNexto = async(req,res)=> {
    if (req.user.role === "leader" || req.user.role === "employee"){
        const {Useful_ID,UsefulUsefulId} = req.body
        let [nexto,created] = await db.Nexto_Useful.findOrCreate({defaults:req.body,where:{[Op.and]:[{Useful_ID},{UsefulUsefulId}]}})
        if (created) {
            await db.UsefulLand.update({isNexto:true,marks:`เป็นการใช้ประโยชน์ติดกันกับ ${Useful_ID}`},{where:{useful_id:UsefulUsefulId}});
        }
        return res.status(200).send();
    } 
    return res.status(402).send();
}
const onDeleteNexto =async(req,res)=>{
    let targetId = req.params.id
    let nexto_id = req.query.nexto_id
    if (req.user.role === "leader" || req.user.role === "employee"){
        await db.Nexto_Useful.destroy({where:{[Op.and]:[{Useful_ID:targetId},{UsefulUsefulId:nexto_id}]}});
        await db.UsefulLand.update({marks:''},{where:{useful_id:nexto_id}})
       return res.status(200).send();
    }
    return res.status(402).send();
}
const testUseful = async(req,res) => {
    let useful_id = req.params.id_useful
    let useful = await db.UsefulLand.findAll({where:{useful_id:useful_id},include:[
        {
            model:db.UsefulLand,
            as:'Useful'
        } //as ต้องตรงกับใน model
    ]})
    
    res.status(200).send(useful)
}
module.exports ={
    createUsefulland,
    updateUseful,
    deleteUseful,
    UsefulInLand,
    fecthUseful,
    SearchName,
    UsefulSameTax,
    testUseful,
    selectNexto,
    onDeleteNexto
}