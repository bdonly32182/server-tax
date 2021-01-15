module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OwnerLand",{
        Tax_ID:{
            type:DataTypes.STRING(255)

        },
        Line_No:{
            type:DataTypes.INTEGER
        },
 
    },{
        tableName:"ownerLand"
    });
    model.associate = models => {
        model.belongsTo(models.Land,{foreignKey:"Land_own_id"})
        model.belongsTo(models.Customer,{foreignKey:"Customer_own_id"})
    }
    return model
}