
module.exports=(sequelize,DataTypes) => {
    const model = sequelize.define("Tax_Group",{
        Tax_ID:{
            type:DataTypes.STRING(255),
            primaryKey:true
        }
    },{
        tableName:"tax_group"
    })
    model.associate = models =>{
        model.belongsToMany(models.District,{through:models.District_has_Tax,foreignKey:"District_Tax_ID"})
        model.belongsToMany(models.Customer,{through:models.Customer_has_tax,foreignKey:"Customer_Tax_ID"})
        model.hasMany(models.Land,{foreignKey:"Land_Tax_ID"})
        model.hasMany(models.Building,{foreignKey:"Build_Tax_ID"})
        model.hasMany(models.Room,{foreignKey:"Room_Tax_ID"})
        model.hasOne(models.Address,{foreignKey:"Address_Tax_ID"})
        model.hasMany(models.UsefulLand,{foreignKey:'UsefulLand_Tax_ID'})
    }
    return model
}