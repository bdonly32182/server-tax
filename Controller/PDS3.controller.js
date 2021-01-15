const db = require("../Models")
const sequelize = db.sequelize
const fetch_pds3_byIdTax = async(req,res) =>{
    const Tax_ID = req.params.id_tax
    let pds3 = await db.Tax_Group.findOne({where:{Tax_ID:Tax_ID},include:[
        {
            model:db.Land,
            include:{model:db.UsefulLand,include:[{model:db.Building,include:[{model:db.UsefulType},db.RateOfBuilding],
            attributes:['No_House','Category','Age_Build','Mark','Build_Total_Place']
        }]}
        },
        {
            model:db.Customer
        }
    ]})
    res.send(pds3)
} 

module.exports={
    fetch_pds3_byIdTax
}