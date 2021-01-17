
module.exports=(sequelize,DataTypes) => {
    const model = sequelize.define("Tax_Group",{
        uid_tax:{
            type:DataTypes.STRING(34),
            primaryKey:true
        },
        Tax_ID:{
            type:DataTypes.STRING(255),
            // primaryKey:true
        },
        Category_Tax:{
            type:DataTypes.STRING(100)
        }
    },{
        tableName:"tax_group"
    })
    model.associate = models =>{
        model.belongsTo(models.District,{foreignKey:"Tax_in_district"})
        
        model.belongsToMany(models.Customer,{through:models.Customer_has_tax,foreignKey:"Customer_Tax_ID"})
        model.hasMany(models.Land,{foreignKey:"Land_Tax_ID"})
        model.hasMany(models.Building,{foreignKey:"Build_Tax_ID"})
        model.hasMany(models.Room,{foreignKey:"Room_Tax_ID"})
        model.hasOne(models.Address,{foreignKey:"Address_Tax_ID"})
        model.hasMany(models.UsefulLand,{foreignKey:'UsefulLand_Tax_ID'})
    }
    return model
}