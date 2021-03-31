
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("RateLand",{
      
        Price_thanaruk:{
            type:DataTypes.DOUBLE
        }
        
    },{
        tableName:"rate_land_thanaruk"
    });
    model.associate = models =>{
       model.belongsTo(models.Land,{foreignKey:"land_id"})
        
    }
    return model

}