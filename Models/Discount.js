module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Discount",{
        
    },{
        tableName:"discount"
    });
    return model

}