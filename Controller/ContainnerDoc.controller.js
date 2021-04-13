const db = require('../Models')
const Op = db.Sequelize.Op
const fs = require('fs')
const generatePdfCostDoc = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let {TaxCostBook,Year,districtNo,buildUpdate} = req.body
        
        // if (buildUpdate.length > 0) {
        //     console.log('buildupdate lenfth',buildUpdate.length );
        //     for (const data of buildUpdate) {
        //         console.log('inside builkd',data);
        //         await db.Building.update(data,{where:{Build_Id:data.Build_Id}})
        //     }
        // }
        let [doc,created] = await db.CostBook.findOrCreate({where:{[Op.and]:[{TaxCostBook:TaxCostBook},{Year:Year},{districtNo:districtNo}]},defaults:req.body});
        if (!created) {//have doc
            await db.CostBook.update({...req.body,
                CostBookNo:doc.CostBookNo
            },{where:{[Op.and]:[{TaxCostBook:TaxCostBook},{Year:Year},{districtNo:districtNo}]}});
        }
        return res.status(200).send(); 
    }
   return res.status(403).send();
}
const generateCheckDoc = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let {TaxCheckBook,Year,districtNo} = req.body
        let [ doc , created] = await db.CheckBook.findOrCreate({where:{[Op.and]:[{TaxCheckBook:TaxCheckBook},{Year:Year},{districtNo:districtNo}]},defaults:req.body});
        if (!created) {
            await db.CheckBook.update({...req.body,
                CheckBookNo:doc.CheckBookNo
            },{where:{[Op.and]:[{TaxCheckBook:TaxCheckBook},{Year:Year},{districtNo:districtNo}]}})
        }
        return res.status(200).send();     
    }
   return res.status(403).send();

}
const listCostBookOfEmployee = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let year  = req.query.year;
        let employeeNo = req.user.Pers_no;
        let districtNo = req.user.distict_id
        let documentEmployee = await db.CostBook.findAll({where:{[Op.and]:[
            {districtNo:districtNo},
            {Employee_No:employeeNo},
            {Year:year}
        ]}});
        return res.status(200).send(documentEmployee)
    }
    return res.status(403).send();
}
const listCostBookOfDistrict = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let year  = req.query.year;
        let districtNo = req.user.distict_id
        let documentDistrict = await db.CostBook.findAll({where:{[Op.and]:[
            {districtNo:districtNo},
            {Year:year}
        ]}});
        return res.status(200).send(documentDistrict)
    }
    return res.status(403).send();

}
const listCheckBookOfEmployee = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let year  = req.query.year;
        let employeeNo = req.user.Pers_no;
        let districtNo = req.user.distict_id
        let checkbookOfEmployee = await db.CheckBook.findAll({where:{[Op.and]:[
            {districtNo:districtNo},
            {Employee_No:employeeNo},
            {Year:year}
        ]},
        include:[
            {
                model:db.Tax_Group,
                include:[db.Land,db.Building,db.Room]
            }
        ]
    });
        return res.status(200).send(checkbookOfEmployee);
    }
    return res.status(403).send();
}
const listCheckbookOfDistrict = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let year  = req.query.year;
        let districtNo = req.user.distict_id
        let documentDistrict = await db.CheckBook.findAll({where:{[Op.and]:[
            {districtNo:districtNo},
            {Year:year}
        ]},
        include:[
            {
                model:db.Tax_Group,
                include:[db.Land,db.Building,db.Room]
            }
        ]
    });
        return res.status(200).send(documentDistrict);
    }
    return res.status(403).send();
}
const FetchCostBook = async(req,res)=> {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let districtNo = req.user.distict_id
        let target = req.params.costbookID
        let costbook = await db.CostBook.findOne({where:{[Op.and]:[
            {districtNo:districtNo},
            {CostBookNo:target}
        ]},
        include:[db.Employee,{
            model:db.Tax_Group,
            include:[db.Customer]
        }]
    });
        return res.status(200).send(costbook);
    }
    return res.status(403).send();

}
const FetchCheckBook = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let districtNo = req.user.distict_id
        let target = req.params.checkbookID
        let checkbook = await db.CheckBook.findOne({where:{[Op.and]:[
            {districtNo:districtNo},
            {CheckBookNo:target}
        ]},
        include:[db.Employee,{
            model:db.Tax_Group,
            include:[db.Customer]
        }]
    });
        return res.status(200).send(checkbook);
    }
    return res.status(403).send();
}
const OpenPDF = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let path = req.query.path
        fs.readFile( __basedir + "/public"+path,function(err,data){
            res.set({ 'Content-Type': 'application/pdf'})
            return res.status(200).send(data)
        })
    }
}

module.exports = {
    generatePdfCostDoc,
    generateCheckDoc,
    listCheckBookOfEmployee,
    listCheckbookOfDistrict,
    listCostBookOfDistrict,
    listCostBookOfEmployee,
    FetchCheckBook,
    FetchCostBook,
    OpenPDF
}