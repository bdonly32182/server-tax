module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OwnerBuilding",{
       
    },{
        tableName:"ownerBuilding",
        timestamps:false
    });
    return model
}