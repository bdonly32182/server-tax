module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("BuildOnUsefulLand",{
        
    },{
        tableName:"build_on_useful_land"
    });
    model.associate = models => {
        model.belongsTo(models.Building,{foreignKey:"Build_id_in_Useful"})
        model.belongsTo(models.UsefulLand,{foreignKey:"Useful_land_id",onDelete:'CASCADE'})
    }
    return model

}