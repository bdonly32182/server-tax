module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("CostBook",{
        CostBookNo:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        SendTo:{
            type:DataTypes.STRING(255)
        },
        PriceEmptyRoom:{
            type:DataTypes.DOUBLE
        },
        PriceLiveRoom:{
            type:DataTypes.DOUBLE
        },
        PriceOtherRoom:{
            type:DataTypes.DOUBLE
        },
        PriceLiveUseful:{
            type:DataTypes.DOUBLE
        },
        PriceOtherUseful:{
            type:DataTypes.DOUBLE
        },
        PriceFarmUseful:{
            type:DataTypes.DOUBLE
        },
        PriceEmptyUseful:{
            type:DataTypes.DOUBLE
        },
        totalPricePds7:{
            type:DataTypes.DOUBLE
        },
        totalPricePds8:{
            type:DataTypes.DOUBLE
        },
        PriceExceptEmergency:{
            //ส่วนลด
            type:DataTypes.DOUBLE
        },
        valueDifference:{
            //ส่วนต่าง
            type:DataTypes.DOUBLE
        },
        Relive:{
            //บรรเทา
            type:DataTypes.DOUBLE
        },
        totalPriceOfTax:{
            //ส่วนยอดทั้งหมดก่อนหักลบทุกอย่าง
            type:DataTypes.DOUBLE
        },
        totalBuilaAndLandYear:{
            //พรบ.เดิมปี 62
            type:DataTypes.DOUBLE
        },
        BriefTotal:{
            type:DataTypes.DOUBLE
        },
        Year:{
            type:DataTypes.STRING(25)
        },
        FinishMonth:{
            type:DataTypes.DATEONLY
        },
        PathPDF:{
            type:DataTypes.STRING(255),
        }

    },{
        tableName:"cost_book"
    }
    );
    model.associate = models =>{
     model.belongsTo(models.Employee,{foreignKey:'Employee_No'});
     model.belongsTo(models.District,{foreignKey:'districtNo'});
     model.belongsTo(models.Tax_Group,{foreignKey:'TaxCostBook'});
     model.hasOne(models.Bills,{foreignKey:'CostInBillsID'});
     model.hasMany(models.WarningDoc,{foreignKey:'CostInWarning'});
     model.hasOne(models.PaymentDoc,{foreignKey:'CostInPayID'});

    }
    return model
}