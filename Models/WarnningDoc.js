module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("WarningDoc",{
        IdWarning:{
            type:DataTypes.STRING(255),
            primaryKey:true,
        },
        NameWarning:{
            type:DataTypes.STRING(250)
        },
        FinishDate:{
            type:DataTypes.DATEONLY  
        },
        DateWarnning:{
            type:DataTypes.DATEONLY
        },
        DateAdd:{
            type:DataTypes.DATEONLY
        },
        DateRate:{//วันที่ลงประเมิน
            type:DataTypes.DATEONLY
        },
        interestString:{
            type:DataTypes.STRING(250)
        },
        interestTotal:{
            type:DataTypes.DOUBLE
        },
        interestAdd:{
            type:DataTypes.DOUBLE
        },
        interestMost:{
            type:DataTypes.BOOLEAN
        },
        totalPricePay:{
            type:DataTypes.DOUBLE
        },
        Round:{
            type:DataTypes.INTEGER
        },
        DocRef:{//เลขที่หนังสืออ้างอิง
            type:DataTypes.STRING(250)
        },
        Year:{
            type:DataTypes.STRING(250)
        }
    },{
        tableName:"warning_doc"
    }
    );
    model.associate = models =>{
     model.belongsTo(models.CostBook,{foreignKey:'CostInWarning'});
     model.hasOne(models.PaymentDoc,{foreignKey:'WarningInPayID'});
     model.belongsTo(models.Employee,{foreignKey:'EmployeeWarningID'});
     model.belongsTo(models.District,{foreignKey:'WarningDistrict'});;

    }
    return model
}