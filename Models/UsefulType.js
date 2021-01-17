module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("UsefulType",{
        
        Name_Type:{
            type:DataTypes.STRING(255)
        }
        
    },{
        tableName:"usefulType"
    });
    model.associate = models =>{
        model.hasMany(models.TypeOnBuild,{foreignKey:"Type_on_ID"})
        model.belongsTo(models.UsefulLand,{foreignKey:"useful_ID"})
    }
    return model
}