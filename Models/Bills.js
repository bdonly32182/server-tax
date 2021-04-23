module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Bills",{
        BillsId:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        NameCustomer:{
            type:DataTypes.STRING(250)
        },
        Amount:{
            type:DataTypes.DOUBLE
        },
        DayPay:{
            type:DataTypes.DATEONLY
        },
        Ref1:{
            type:DataTypes.STRING(250)
        },
        Ref2:{
            type:DataTypes.STRING(250)
        }
        

    },{
        tableName:"bills"
    }
    );
    model.associate = models =>{
     model.belongsTo(models.CostBook,{foreignKey:'CostInBillsID'});

    }
    return model
}