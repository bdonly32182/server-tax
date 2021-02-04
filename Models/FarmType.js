module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("FarmType",{
        
        Farm_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'การเกษตร'
        },
        Farm_Size:{
            type:DataTypes.DOUBLE
        },
        Percent_Farm:{
            type:DataTypes.DOUBLE
            
        }
    },{
        tableName:"farm_type"
    });
    model.associate = models =>{
        model.belongsTo(models.Building,{foreignKey:"Build_farm_ID"})
    }
    return model
}