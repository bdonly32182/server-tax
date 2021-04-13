module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("CheckBook",{
       CheckBookNo:{
        type:DataTypes.STRING(255),
        primaryKey:true
       },
       Year:{
           type:DataTypes.STRING(25)
       },
       PathPDF:{
           type:DataTypes.STRING(255),
       }

    },{
        tableName:"check_book"
    }
    );
    model.associate = models =>{
        model.belongsTo(models.Employee,{foreignKey:'Employee_No'});
        model.belongsTo(models.District,{foreignKey:'districtNo'});
        model.belongsTo(models.Tax_Group,{foreignKey:'TaxCheckBook'});

    }
    return model
}