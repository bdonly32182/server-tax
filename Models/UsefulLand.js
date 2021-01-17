module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("UsefulLand",{
        
        Style_Useful:{
            type:DataTypes.STRING(255)
        },
        Useful_RAI:{
            type:DataTypes.DOUBLE

        },
        Useful_GNAN:{
            type:DataTypes.DOUBLE

        },
        Useful_WA:{
            type:DataTypes.DOUBLE

        },
        Place:{
            type:DataTypes.DOUBLE
        },
        
        Mark:{
            type:DataTypes.STRING(255)
        },
        
    },{
        tableName:"usefulLand"
    });
    model.associate = models =>{
        model.belongsTo(models.Land,{foreignKey:"Land_id"});
        model.hasMany(models.BuildOnUsefulLand,{foreignKey:"Useful_land_id"})
        model.hasMany(models.UsefulType,{foreignKey:"useful_ID"})
        model.belongsTo(models.Tax_Group,{foreignKey:'UsefulLand_Tax_ID'})
    }
    return model
}