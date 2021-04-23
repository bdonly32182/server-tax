module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("PaymentDoc",{
        PaymentID:{
            type:DataTypes.STRING(255),
            primaryKey:true,
        },
        NamePayment:{
            type:DataTypes.STRING(250)
        },
        FinishDate:{
            type:DataTypes.DATEONLY  
        },
        PaymentAddress:{
            type:DataTypes.STRING(250)
        },
        DayPay:{//วันรับคำร้อง
            type:DataTypes.DATEONLY
        },
        DateRate:{//วันที่ลงประเมิน
            type:DataTypes.DATEONLY
        },
        fineString:{//ปรับร้อยละ
            type:DataTypes.STRING(250)
        },
        FineTotal:{//ค่าปรับทั้งหมด
            type:DataTypes.DOUBLE
        },
        FineAdd:{//ค่าปรับเพิ่ม
            type:DataTypes.DOUBLE
        },
        totalPay:{
            type:DataTypes.DOUBLE
        },
        amountMonth:{
            type:DataTypes.STRING(10)
        },
        MarkPay:{
            type:DataTypes.STRING(250)
        },
        Year:{
            type:DataTypes.STRING(10)
        }
    },{
        tableName:"payment_doc"
    }
    );
    model.associate = models =>{
     model.belongsTo(models.CostBook,{foreignKey:'CostInPayID'});
     model.belongsTo(models.WarningDoc,{foreignKey:'WarningInPayID'});
     model.belongsTo(models.Employee,{foreignKey:'EmployeePaymentID'});
     model.belongsTo(models.District,{foreignKey:'PaymentDistrict'});;

    }
    return model
}