module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("LiveType",{
        
        Live_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'อยู่อาศัย'
        },
        Live_Size:{
            type:DataTypes.DOUBLE
        },
        Percent_Live:{
            type:DataTypes.DOUBLE
            
        },
        Live_Status:{
            type:DataTypes.BOOLEAN
        }
    },{
        tableName:"live_type"
    });
    model.associate = models =>{
        model.belongsTo(models.Building,{foreignKey:"Build_live_ID"})
    }
    return model
}