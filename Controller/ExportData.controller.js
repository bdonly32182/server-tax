const db = require('../Models');
const excel = require("exceljs");
const { sequelize } = require('../Models');
const {QueryTypes} = require('sequelize') 
const downloadLand = (req, res) => {
    if (req.user.role === "leader" ) {
        db.Land.findAll({where:{distict_id:req.user.distict_id}}).then((result) => {
        let lands = [];
    
        result.forEach((obj) => {
            lands.push({
                Serial_code_land: obj.Serial_code_land,
                code_land: obj.code_land,
                Category_doc: obj.Category_doc,
                UTM_Code: obj.UTM_Code,
                UTM_No: obj.UTM_No,
                UTM_Map: obj.UTM_Map,
                Land_No: obj.Land_No,
                Parcel_No: obj.Parcel_No,
                Survey_No: obj.Survey_No,
                Moo: obj.Moo,
                Tambol_name: obj.Tambol_name,
                RAI: obj.RAI,
                GNAN: obj.GNAN,
                WA: obj.WA,
                Price: obj.Price,
                distict_id: obj.distict_id,
                Land_Tax_ID: obj.Land_Tax_ID,
                employee_land: obj.employee_land
            });
        });
    
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Land");
    
        worksheet.columns = [
            { header: "ลำดับแปลงที่ดิน", key: "Serial_code_land", width: 10 },
            { header: "รหัสแปลงที่ดิน", key: "code_land", width: 10 },
            { header: "ประเภทเอกสาร", key: "Category_doc", width: 10 },
            { header: "เลขระวาง 1", key: "UTM_Code", width: 10 },
            { header: "เลขระวาง 2", key: "UTM_No", width: 10 },
            { header: "เลขระวาง 3", key: "UTM_Map", width: 10 },
            { header: "เลขที่ดิน", key: "Land_No", width: 10 },
            { header: "เลขโฉนด", key: "Parcel_No", width: 10 },
            { header: "เลขหน้าสำรวจ", key: "Survey_No", width: 10 },
            { header: "หมู่", key: "Moo", width: 10 },
            { header: "ตำบล", key: "Tambol_name", width: 10 },
            { header: "ไร่", key: "RAI", width: 10 },
            { header: "งาน", key: "GNAN", width: 10 },
            { header: "วา", key: "WA", width: 10 },
            { header: "ราคา", key: "Price", width: 10 },
            { header: "รหัสประจำเขต", key: "distict_id", width: 10 },
            { header: "รหัสเจ้าของที่ดิน", key: "Land_Tax_ID", width: 10 },
            { header: "รหัสพนักงาน", key: "employee_land", width: 10 },
        ];
        // Add Array Rows
        worksheet.addRows(lands);
    
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
        }); 
    }
    
};
const downloadRateLand =async(req,res)=>{
    if (req.user.role === "leader" ) {
        let ratinglands = [];
        const RateLand = await db.RateLand.findAll({include:{
            model:db.Land,
            where:{distict_id:req.user.distict_id}
        }});
        RateLand.forEach(obj=>{
            ratinglands.push({
                id:obj.id,
                Price_thanaruk:obj.Price_thanaruk,
                land_id:obj.land_id
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("RatingLand");
        worksheet.columns=[
            { header: "รหัสราคาประเมิน", key: "id", width: 20 },
            { header: "ราคาประเมิน", key: "Price_thanaruk", width: 20 },
            { header: "รหัสที่ดิน", key: "land_id", width: 20 },
        ]
        worksheet.addRows(ratinglands);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadDistrict = async(req,res)=>{
    if (req.user.role === "leader" ) {
        let districts = []
        let DistrictAll = await db.District.findAll();
        DistrictAll.forEach(obj=>{
            districts.push({
                District_no:obj.District_no,
                District_name:obj.District_name,
                Address_Tambol:obj.Address_Tambol,
                Address_District:obj.Address_District,
                Address_Country:obj.Address_Country,
                Address_PostNo:obj.Address_PostNo,
                Tel:obj.Tel,
                Abbreviations:obj.Abbreviations
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("District");
        worksheet.columns=[
            { header: "รหัสประจำเขต", key: "District_no", width: 10 },
            { header: "ชื่อสำนักงานเขต", key: "District_name", width: 10 },
            { header: "เขตที่อยู่", key: "Address_District", width: 10 },
            { header: "เมืองที่อยู่", key: "Address_Country", width: 10 },
            { header: "รหัสไปรษณีย์", key: "Address_PostNo", width: 10 },
            { header: "เบอร์ติดต่อ", key: "Tel", width: 10 },
            { header: "ตัวอักษรย่อ", key: "Abbreviations", width: 10 },
        ]
        worksheet.addRows(districts);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
         
    }
}  
const downloadEmployee =async(req,res) => {
    if (req.user.role === "leader" ) {
        let employees = [];
        const EmployeeInDistrict = await db.Employee.findAll({where:{distict_id:req.user.distict_id}});
        EmployeeInDistrict.forEach(obj=>{
            employees.push({
                Pers_no:obj.Pers_no,
                TitleEmp:obj.TitleEmp,
                Fname:obj.Fname,
                Lname:obj.Lname,
                role:obj.role,
                TableNo:obj.TableNo
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Employee");
        worksheet.columns=[
            { header: "รหัสพนักงาน", key: "Pers_no", width: 10 },
            { header: "คำนำหน้า", key: "TitleEmp", width: 10 },
            { header: "ชื่อ", key: "Fname", width: 10 },
            { header: "นามสกุล", key: "Lname", width: 10 },
            { header: "ตำแหน่ง", key: "role", width: 10 },
            { header: "รหัสประจำตำแหน่ง", key: "TableNo", width: 10 },
        ]
        worksheet.addRows(employees);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadUsefulLand = async(req,res) => {
    if(req.user.role === "leader" ){
        const usefuls = [] ;
        const UsefulLand = await db.UsefulLand.findAll({include:[{
            model:db.Land,
            where:{distict_id:req.user.distict_id}
        }]});
        UsefulLand.forEach(obj=>{
            usefuls.push({
                useful_id:obj.useful_id,
                Useful_RAI:obj.Useful_RAI,
                Useful_GNAN:obj.Useful_GNAN,
                Useful_WA:obj.Useful_WA,
                PriceUseful:obj.PriceUseful,
                Place:obj.Place,
                Special_Useful:obj.Special_Useful,
                Usage:obj.Usage,
                TypeName:obj.TypeName,
                Percent:obj.Percent,
                isAccross:obj.isAccross,
                isNexto:obj.isNexto,
                EmptyAbsolutes:obj.EmptyAbsolutes,
                StartYears:obj.StartYears,
                Land_id:obj.Land_id,
                UsefulLand_Tax_ID:obj.UsefulLand_Tax_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("UsefulLand");
        worksheet.columns=[
            { header: "รหัสการใช้ประโยชน์", key: "useful_id", width: 20 },
            { header: "ไร่", key: "Useful_RAI", width: 10 },
            { header: "งาน", key: "Useful_GNAN", width: 10 },
            { header: "วา", key: "Useful_WA", width: 10 },
            { header: "ราคา", key: "PriceUseful", width: 10 },
            { header: "พื้นที่ทั้งหมด", key: "Place", width: 10 },
            { header: "ส่วนลดตามมาตราต่างๆ", key: "Special_Useful", width: 10 },
            { header: "การใช้", key: "Usage", width: 10 },
            { header: "ประเภท", key: "TypeName", width: 10 },
            { header: "เปอร์เซ็น", key: "Percent", width: 10 },
            { header: "เป็นแปลงที่ถูกคร่อม", key: "isAccross", width: 10 },
            { header: "เป็นแปลงติดกัน", key: "isNexto", width: 10 },
            { header: "ว่างเปล่าแท้จริง", key: "EmptyAbsolutes", width: 10 },
            { header: "ปีที่เริ่มว่างเปล่า", key: "StartYears", width: 10 },
            { header: "รหัสแปลงที่ดิน", key: "Land_id", width: 10 },
            { header: "รหัสเจ้าของทรัพย์สิน", key: "UsefulLand_Tax_ID", width: 10 },

        ]
        worksheet.addRows(usefuls);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadBuilding = async(req,res)=>{
    if(req.user.role === "leader" ){
        let buildings = []
        const BuildingAll = await db.Building.findAll({where:{Build_in_district:req.user.distict_id}});
        BuildingAll.forEach(obj=>{
            buildings.push({
                Build_Id:obj.Build_Id,
                No_House:obj.No_House,
                rating_id:obj.rating_id,
                Sub_Category:obj.Sub_Category,
                StyleBuilding:obj.StyleBuilding,
                Width:obj.Width,
                Length:obj.Length,
                Amount_Room:obj.Amount_Room,
                Amount_Floor:obj.Amount_Floor,
                Build_Total_Place:obj.Build_Total_Place,
                Age_Build:obj.Age_Build,
                Percent_Age:obj.Percent_Age,
                Build_Tax_ID:obj.Build_Tax_ID,
                Build_in_district:obj.Build_in_district,
                employee_build:obj.employee_build,
                YearBuild:obj.YearBuild
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Building");
        worksheet.columns=[
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_Id", width: 20 },
            { header: "บ้านเลขที่", key: "No_House", width: 10 },
            { header: "รหัสราคาประเมิน", key: "rating_id", width: 10 },
            { header: "ประเภทย่อย", key: "Sub_Category", width: 10 },
            { header: "ลักษณะสิ่งปลูกสร้าง", key: "StyleBuilding", width: 10 },
            { header: "ความกว้าง", key: "Width", width: 10 },
            { header: "ความยาว", key: "Length", width: 10 },
            { header: "จำนวนห้อง", key: "Amount_Room", width: 10 },
            { header: "จำนวนชั้น", key: "Amount_Floor", width: 10 },
            { header: "พื้นที่รวมทั้งหมด", key: "Build_Total_Place", width: 10 },
            { header: "อายุสิ่งปลูกสร้าง", key: "Age_Build", width: 10 },
            { header: "เปอร์เซ็น", key: "Percent_Age", width: 10 },
            { header: "รหัสเจ้าของทรัพย์สิน", key: "Build_Tax_ID", width: 10 },
            { header: "รหัสประจำเขต", key: "Build_in_district", width: 10 },
            { header: "รหัสพนักงานผู้รับผิดชอบ", key: "employee_build", width: 10 },
            { header: "ปีที่สร้าง", key: "YearBuild", width: 10 },
        ]
        worksheet.addRows(buildings);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadRateBuilding = async(req,res)=>{
    if(req.user.role === "leader" ){
        let ratings = [];
        const RateBuilding = await db.RateOfBuilding.findAll()
        RateBuilding.forEach(obj=>{
            ratings.push({
                Code:obj.Code,
                Category_build:obj.Category_build,
                Rate_Price:obj.Rate_Price
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Rating");
        worksheet.columns=[
            { header: "รหัสราคาประเมิน", key: "Code", width: 20 },
            { header: "ประเภทสิ่งปลูกสร้าง", key: "Category_build", width: 10 },
            { header: "ราคาประเมิน", key: "Rate_Price", width: 10 },
           
        ]
        worksheet.addRows(ratings);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadOtherType = async(req,res)=>{
    if(req.user.role === "leader" ){
        let others = [];
        const OtherType = await db.OtherType.findAll({include:{
            model:db.Building,
            where:{Build_in_district:req.user.distict_id}
        }});
        OtherType.forEach(obj=>{
            others.push({
                id:obj.id,
                Other_Type:obj.Other_Type,
                Other_Size:obj.Other_Size,
                Percent_Other:obj.Percent_Other,
                Build_other_ID:obj.Build_other_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("OtherType");
        worksheet.columns=[
            { header: "รหัสประเภทอื่นๆ", key: "id", width: 20 },
            { header: "ชื่อประเภท", key: "Other_Type", width: 10 },
            { header: "ขนาดของประเภทอื่นๆ", key: "Other_Size", width: 20 },
            { header: "เปอร์เซ็น", key: "Percent_Other", width: 10 },
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_other_ID", width: 10 },
        ]
        worksheet.addRows(others);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadLiveType = async(req,res)=>{
    if(req.user.role === "leader" ){
        let lives = [];
        const LiveType = await db.LiveType.findAll({include:{
            model:db.Building,
            where:{Build_in_district:req.user.distict_id}
        }});
        LiveType.forEach(obj=>{
            lives.push({
                id:obj.id,
                Live_Type:obj.Live_Type,
                Live_Size:obj.Live_Size,
                Percent_Live:obj.Percent_Live,
                Live_Status:obj.Live_Status,
                Build_live_ID:obj.Build_live_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("LiveType");
        worksheet.columns=[
            { header: "รหัสประเภท", key: "id", width: 20 },
            { header: "ชื่อประเภท", key: "Live_Type", width: 10 },
            { header: "ขนาด", key: "Live_Size", width: 20 },
            { header: "เปอร์เซ็น", key: "Percent_Live", width: 10 },
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_live_ID", width: 10 },
        ]
        worksheet.addRows(lives);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadEmptyType = async(req,res)=>{
    if(req.user.role === "leader" ){
        let emptys = [];
        const EmptyType = await db.EmptyType.findAll({include:{
            model:db.Building,
            where:{Build_in_district:req.user.distict_id}
        }});
        EmptyType.forEach(obj=>{
            emptys.push({
                id:obj.id,
                Empty_Type:obj.Empty_Type,
                Empty_Size:obj.Empty_Size,
                Percent_Empty:obj.Percent_Empty,
                EmptyAbsolute:obj.EmptyAbsolute,
                StartYear:obj.StartYear,
                Build_empty_ID:obj.Build_empty_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("EmptyType");
        worksheet.columns=[
            { header: "รหัสประเภท", key: "id", width: 20 },
            { header: "ชื่อประเภท", key: "Empty_Type", width: 10 },
            { header: "ขนาด", key: "Empty_Size", width: 20 },
            { header: "เปอร์เซ็น", key: "Percent_Empty", width: 10 },
            { header: "ว่างเปล่าแท้จริง", key: "EmptyAbsolute", width: 10 },
            { header: "ปีที่เริ่มว่างเปล่า", key: "StartYear", width: 10 },
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_empty_ID", width: 10 },
        ]
        worksheet.addRows(emptys);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadFarmType = async(req,res)=>{
    if(req.user.role === "leader" ){
        let farms = [];
        const FarmType = await db.FarmType.findAll({include:{
            model:db.Building,
            where:{Build_in_district:req.user.distict_id}
        }});
        FarmType.forEach(obj=>{
            farms.push({
                id:obj.id,
                Farm_Type:obj.Farm_Type,
                Farm_Size:obj.Farm_Size,
                Percent_Farm:obj.Percent_Farm,
                Build_farm_ID:obj.Build_farm_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("FarmType");
        worksheet.columns=[
            { header: "รหัสประเภทอื่นๆ", key: "id", width: 20 },
            { header: "ชื่อประเภท", key: "Farm_Type", width: 10 },
            { header: "ขนาดของประเภทอื่นๆ", key: "Farm_Size", width: 20 },
            { header: "เปอร์เซ็น", key: "Percent_Farm", width: 10 },
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_farm_ID", width: 10 },
        ]
        worksheet.addRows(farms);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadTaxGroup = async(req,res)=>{
    if(req.user.role === "leader" ){
        let taxs = [];
        const TaxGroup = await db.Tax_Group.findAll({where:{Tax_in_district:req.user.distict_id}});
        TaxGroup.forEach(obj=>{
            taxs.push({
                uid_tax:obj.uid_tax,
                Category_Tax:obj.Category_Tax,
                Tax_in_district:obj.Tax_in_district
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("TaxGroup");
        worksheet.columns=[
            { header: "รหัสกลุ่มผู้เสียภาษี", key: "uid_tax", width: 20 },
            { header: "ประเภทผู้เสียภาษี", key: "Category_Tax", width: 10 },
            { header: "รหัสประจำเขต", key: "Tax_in_district", width: 20 },
        ]
        worksheet.addRows(taxs);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadCustomerHasTax = async(req,res)=>{
    if(req.user.role === "leader" ){
        let customersHasTaxs = [];
        const customerHasTax = await sequelize.query(`
        select * from customer_has_tax CT inner join tax_group TG on CT.Customer_Tax_ID = TG.uid_tax
        where TG.Tax_in_district = "${req.user.distict_id}"
        `,{type:QueryTypes.SELECT});
        customerHasTax.forEach(obj=>{
            customersHasTaxs.push({
                Cus_No:obj.Cus_No,
                Customer_Tax_ID:obj.Customer_Tax_ID,
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("CustomerHasTaxGroup");
        worksheet.columns=[
            { header: "รหัสประชาชนประจำเขต", key: "Cus_No", width: 20 },
            { header: "รหัสผู้เสียภาษี", key: "Customer_Tax_ID", width: 20 },
        ]
        worksheet.addRows(customersHasTaxs);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadCustomer = async(req,res)=>{
    if(req.user.role === "leader" ){
        let customers = [];
        const customer = await db.Customer.findAll({where:{isDistrict_id:req.user.distict_id}});
        customer.forEach(obj=>{
            customers.push({
                id_customer:obj.id_customer,
                Cus_No:obj.Cus_No,
                title:obj.title,
                category_Cus:obj.category_Cus,
                Cus_Fname:obj.Cus_Fname,
                Cus_Lname:obj.Cus_Lname,
                Num_House:obj.Num_House,
                Moo:obj.Moo,
                Road_Name:obj.Road_Name,
                Soi:obj.Soi,
                Tambol:obj.Tambol,
                district_name:obj.district_name,
                Changwat:obj.Changwat,
                Post_No:obj.Post_No,
                Phone_no:obj.Phone_no,
                Land_years:obj.Land_years,
                Build_years:obj.Build_years,
                isDistrict_id:obj.isDistrict_id
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Customer");
        worksheet.columns=[
            { header: "รหัสประชาชนประจำเขต", key: "id_customer", width: 20 },
            { header: "รหัสบัตรประชาชน", key: "Cus_No", width: 20 },
            { header: "คำนำหน้า", key: "title", width: 20 },
            { header: "ประเภท", key: "category_Cus", width: 20 },
            { header: "ชื่อ", key: "Cus_Fname", width: 20 },
            { header: "นามสกุล", key: "Cus_Lname", width: 20 },
            { header: "บ้านเลขที่", key: "Num_House", width: 20 },
            { header: "หมู่", key: "Moo", width: 20 },
            { header: "ถนน", key: "Road_Name", width: 20 },
            { header: "ซอย", key: "Soi", width: 20 },
            { header: "แขวง", key: "Tambol", width: 20 },
            { header: "เขต", key: "district_name", width: 20 },
            { header: "จังหวัด", key: "Changwat", width: 20 },
            { header: "รหัสไปรษณีย์", key: "Post_No", width: 20 },
            { header: "เบอร์ติดต่อ", key: "Phone_no", width: 20 },
            { header: "พรบ.เดิมที่ดิน", key: "Land_years", width: 20 },
            { header: "พรบ.เดิมสิ่งปลูกสร้าง", key: "Build_years", width: 20 },
            { header: "รหัสประจำเขต", key: "isDistrict_id", width: 20 },
        ]
        worksheet.addRows(customers);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadBuildOnUseful = async(req,res)=>{
    if(req.user.role === "leader" ){
        let BuildOnUsefuls = []
        const BuildOnUseful = await db.BuildOnUsefulLand.findAll({include:[
            {
                model:db.Building,
                where:{Build_in_district:req.user.distict_id}
            }
        ]});
        BuildOnUseful.forEach(obj=>{
            BuildOnUsefuls.push({
                Build_id_in_Useful:obj.Build_id_in_Useful,
                Useful_land_id:obj.Useful_land_id
            })
        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("BuildOnUseful");
        worksheet.columns=[
            { header: "รหัสสิ่งปลูกสร้าง", key: "Build_id_in_Useful", width: 20 },
            { header: "รหัสการใช้ประโยชน์ที่ดิน", key: "Useful_land_id", width: 20 },
        ]
        worksheet.addRows(BuildOnUsefuls);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadCondo = async(req,res)=>{
    if(req.user.role === "leader" ){
        let condos = [];
        const Condo = await db.Condo.findAll({where:{distict_id:req.user.distict_id}});
        Condo.forEach(obj=>{
            condos.push({
                id:obj.id,
                Condo_name:obj.Condo_name,
                Build_Name:obj.Build_Name,
                Register_no:obj.Register_no,
                Parcel_no:obj.Parcel_no,
                Survey_no:obj.Survey_no,
                Condo_no:obj.Condo_no,
                village:obj.village,
                Soi:obj.Soi,
                Road:obj.Road,
                Country:obj.Country,
                District_name:obj.District_name,
                Tambol:obj.Tambol,
                Post_no:obj.Post_no,
                AgeCondo:obj.AgeCondo,
                distict_id:obj.distict_id,
                employee_condo:obj.employee_condo
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Condo");
        worksheet.columns=[
            { header: "รหัสอาคารชุด", key: "id", width: 20 },
            { header: "ชื่ออาคารชุด", key: "Condo_name", width: 20 },
            { header: "ชื่อตึก", key: "Build_Name", width: 20 },
            { header: "เลขใบอนุญาต", key: "Register_no", width: 20 },
            { header: "เลขโฉนด", key: "Parcel_no", width: 20 },
            { header: "เลขสำรวจ", key: "Survey_no", width: 20 },
            { header: "เลขที่ตั้งห้องชุด", key: "Condo_no", width: 20 },
            { header: "หมู่บ้าน", key: "village", width: 20 },
            { header: "ซอย", key: "Soi", width: 20 },
            { header: "ถนน", key: "Road", width: 20 },
            { header: "จังหวัด", key: "Country", width: 20 },
            { header: "เขต", key: "District_name", width: 20 },
            { header: "แขวง", key: "Tambol", width: 20 },
            { header: "รหัสไปรษณีย์", key: "Post_no", width: 20 },
            { header: "อายุ", key: "AgeCondo", width: 20 },
            { header: "รหัสประจำเขต", key: "distict_id", width: 20 },
            { header: "รหัสพนักงานที่รับผิดชอบ", key: "employee_condo", width: 20 }

        ]
        worksheet.addRows(condos);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadRoom = async(req,res)=>{
    if(req.user.role === "leader" ){
        let rooms = [];
        const Room = await db.Room.findAll({include:[
            {
                model:db.Condo,
                where:{distict_id:req.user.distict_id}
            }
        ]})
        Room.forEach(obj=>{
            rooms.push({
                id:obj.id,
                Room_no:obj.Room_no,
                Floor:obj.Floor,
                AgeRoom:obj.AgeRoom,
                UsageRoom:obj.UsageRoom,
                LiveStatus:obj.LiveStatus,
                Condo_no:obj.Condo_no,
                Room_Tax_ID:obj.Room_Tax_ID
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Room");
        worksheet.columns=[
            { header: "รหัสห้องชุด", key: "id", width: 20 },
            { header: "หมายเลขห้อง", key: "Room_no", width: 20 },
            { header: "ชั้น", key: "Floor", width: 20 },
            { header: "อายุ", key: "AgeRoom", width: 20 },
            { header: "การใช้ห้อง", key: "UsageRoom", width: 20 },
            { header: "สถานการอยู่อาศัย", key: "LiveStatus", width: 20 },
            { header: "รหัสอาคารชุด", key: "Condo_no", width: 20 },
            { header: "รหัสเจ้าของทรัพย์สิน", key: "Room_Tax_ID", width: 20 },

        ]
        worksheet.addRows(rooms);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
const downloadUsefulRoom = async(req,res)=>{
    if(req.user.role === "leader" ){
        let UsefulRooms = [];
        const UsefulRoom = await db.Useful_room.findAll({include:[
            {
                model:db.Room,
                include:[
                    {
                        model:db.Condo,
                        where:{distict_id:req.user.distict_id}
                    }
                ]
            }
        ]})
        UsefulRoom.forEach(obj=>{
            UsefulRooms.push({
                id:obj.id,
                Category_use:obj.Category_use,
                Category_place:obj.Category_place,
                Price_Room:obj.Price_Room,
                Amount_Place:obj.Amount_Place,
                StartYearEmpty:obj.StartYearEmpty,
                room_id:obj.room_id
            })
        })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("UsefulRoom");
        worksheet.columns=[
            { header: "รหัสการใช้ประโยชน์", key: "id", width: 20 },
            { header: "ประเภทการใช้ประโยชน์", key: "Category_use", width: 20 },
            { header: "ประเภทพื้นที่", key: "Category_place", width: 20 },
            { header: "ราคาประเมิน", key: "Price_Room", width: 20 },
            { header: "จำนวนพื้นที่", key: "Amount_Place", width: 20 },
            { header: "ปีที่เริ่มว่างเปล่า", key: "StartYearEmpty", width: 20 },
            { header: "รหัสห้องชุด", key: "room_id", width: 20 },

        ]
        worksheet.addRows(UsefulRooms);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}
  module.exports = {
    downloadLand,
    downloadDistrict,
    downloadEmployee,
    downloadUsefulLand,
    downloadBuilding,
    downloadRateBuilding,
    downloadOtherType,
    downloadLiveType,
    downloadEmptyType,
    downloadFarmType,
    downloadTaxGroup,
    downloadCustomerHasTax,
    downloadCustomer,
    downloadRateLand,
    downloadBuildOnUseful,
    downloadCondo,
    downloadRoom,
    downloadUsefulRoom
  };
  