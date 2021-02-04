module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Depreciation",{
        
        age_build:{
            type:DataTypes.INTEGER
        },
        Category_build:{
            type:DataTypes.STRING(100)
        },
        Percenet:{
            type:DataTypes.INTEGER
        }
    },{
        tableName:"depreciate"
    });
   
    return model
}