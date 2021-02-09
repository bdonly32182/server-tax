module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OtherType",{
        
        Other_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'อื่นๆ'
        },
        Other_Size:{
            type:DataTypes.DOUBLE
        },
        Percent_Other:{
            type:DataTypes.DOUBLE
            
        }
    },{
        tableName:"other_type"
    });
    model.associate = models =>{
        model.belongsTo(models.Building,{foreignKey:"Build_other_ID"})
        model.belongsToMany(models.UsefulLand,{through:models.Useful_other,foreignKey:"Other_ID"});

    }
    return model
}