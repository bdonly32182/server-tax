module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OwnerLand",{
        
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