module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("EmptyType",{
        
        Empty_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'ว่างเปล่า'
        },
        Empty_Size:{
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
        model.belongsToMany(models.UsefulLand,{through:models.Useful_empty,foreignKey:"Empty_ID"});

    }
    return model
}