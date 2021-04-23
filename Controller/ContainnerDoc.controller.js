const db = require('../Models')
const Op = db.Sequelize.Op
const fs = require('fs')
const sequelize = db.sequelize
const {QueryTypes} = require('sequelize') 

const generatePdfCostDoc = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let {TaxCostBook,Year,districtNo,buildUpdateID,buildUpdateAge_Build,buildUpdatePercent_Age,employeeTable,Employee_No} = req.body
        if (Array.isArray(buildUpdateID)&&Array.isArray(buildUpdateAge_Build)&&Array.isArray(buildUpdatePercent_Age)&&buildUpdateID.length > 0) {
            for (const [index,build] of buildUpdateID.entries()) {
                await db.Building.update({
                    Age_Build:buildUpdateAge_Build[index],
                    Percent_Age:buildUpdatePercent_Age[index]
                },{where:{Build_Id:build}})
            }
        }else{
            await db.Building.update({
                Age_Build:buildUpdateAge_Build,
                Percent_Age:buildUpdatePercent_Age
            },{where:{Build_Id:buildUpdateID}})
        }
        const { count, rows } = await db.CostBook.findAndCountAll({where:{[Op.and]:[{Employee_No:Employee_No},{districtNo:req.user.distict_id}]}})
        let nextIdCostBook = count + 1
        let costId =`${req.user.distict_id}_${employeeTable}${nextIdCostBook.toString().padStart(6,0)}-${Year}`;
        let [doc,created] = await db.CostBook.findOrCreate({where:{[Op.and]:[{TaxCostBook:TaxCostBook},
                                                          {Year:Year},{districtNo:districtNo}]},
            defaults:{CostBookNo:costId,...req.body
            }});   
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
            include:[db.Customer,db.Address]
        },db.Bills,db.WarningDoc,db.PaymentDoc]
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
const onSaveWarning = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let maxWarningDoc = await sequelize.query(`
            select IdWarning from warning_doc
            where EmployeeWarningID ="${req.user.Pers_no}" and (createdAt = (select max(createdAt) from warning_doc ))
            `,{type:QueryTypes.SELECT});
        if (maxWarningDoc.length === 0) {
          await db.WarningDoc.create({...req.body,
            IdWarning:`${req.user.distict_id}_${req.user.TableNo}00001-${req.body.Year}`,
            WarningDistrict:req.user.distict_id
            });  
            return res.status(200).send()
        }
        let LastId = maxWarningDoc[0].IdWarning;
        let LastIdSplit =  LastId.split("-");
        let id = LastIdSplit[0].split("_");
        let nextId = parseInt(id[1]) + 1

        await db.WarningDoc.create({...req.body,
            IdWarning:`${req.user.distict_id}_${req.user.TableNo}${nextId.toString().padStart(5,0)}-${req.body.Year}`,
            WarningDistrict:req.user.distict_id
            });  
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onUpdateWarning = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.IdWarning
        await db.WarningDoc.update(req.body,{where:{IdWarning:target}});
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onDeleteWarning = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.IdWarning
        await db.WarningDoc.destroy({where:{IdWarning:target}});
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onSavePayment = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        // await db.PaymentDoc.create({...req.body});
        let maxPaymentDoc = await sequelize.query(`
            select PaymentID from payment_doc
            where EmployeePaymentID ="${req.user.Pers_no}" and (createdAt = (select max(createdAt) from payment_doc ))
            `,{type:QueryTypes.SELECT});
        if (maxPaymentDoc.length === 0) {
          await db.PaymentDoc.create({...req.body,
            PaymentID:`REQ_000001-${req.body.Year}`,
            PaymentDistrict:req.user.distict_id
            });  
            return res.status(200).send()
        }
        let LastId = maxPaymentDoc[0].PaymentID;
        let LastIdSplit =  LastId.split("-");
        let id = LastIdSplit[0].split("_");
        let nextId = parseInt(id[1]) + 1
        let generateId = nextId.toString().padStart(6,"0");
        await db.PaymentDoc.create({...req.body,
            PaymentID:`REQ_${generateId}-${req.body.Year}`,
            PaymentDistrict:req.user.distict_id
            }); 
        return res.status(200).send()

    }
    return res.status(403).send();

}
const onUpdatePayment = async(req,res) => {
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.PaymentID
        await db.PaymentDoc.update(req.body,{where:{PaymentID:target}});
        return res.status(200).send()
    }
    return res.status(403).send();
}
const onDeletePayment = async(req,res)=>{
    if (req.user.role === "leader" || req.user.role === "employee") {
        let target = req.params.PaymentID
        await db.PaymentDoc.destroy({where:{PaymentID:target}})
        return res.status(204).send();
    }
    return res.status(403).send()
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
    OpenPDF,
    onSavePayment,
    onSaveWarning,
    onUpdatePayment,
    onDeletePayment,
    onUpdateWarning,
    onDeleteWarning,
}