module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("BuildingDepreciation",{
        Category:{
            type:DataTypes.STRING(100)
        },Age_Build:{
            type:DataTypes.INTEGER
        },Percent:{
            type:DataTypes.INTEGER
        }
    },{
        tableName:"building_depreciations",
        timestamps:false
    });
    model.associate = models =>{
        model.belongsToMany(models.Building,{through:models.BuildAndDepreciation,foreignKey:"Depreciate_ID"})
        // model.hasMany(models.Build_And_Depreciation,{foreignKey:"Depreciate_ID"})

    }
    return model

}