module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("RateOfBuilding",{
        Code :{
            type:DataTypes.STRING(255),
            primaryKey:true
        },Category_build:{
            type:DataTypes.STRING(255)
        },Rate_Price:{
            type:DataTypes.DOUBLE
        }
    },{
        tableName:"rate_of_building",
        timestamps:false
    });
    model.associate = models =>{
        model.hasOne(models.Building,{foreignKey:"rating_id"})
    }
    return model

}