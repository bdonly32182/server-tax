module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("EmptyType",{
        
        Empty_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'ว่างเปล่า'
        },
        Empty_size:{
            type:DataTypes.DOUBLE
        },
        Percent_Empty:{
            type:DataTypes.DOUBLE
            
        }
    },{
        tableName:"empty_type"
    });
    model.associate = models =>{
        model.belongsTo(models.Building,{foreignKey:"Build_empty_ID"})
    }
    return model
}