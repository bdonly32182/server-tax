module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("TypeOnBuild",{
        
        Name_Type:{
            type:DataTypes.STRING(255)
        },
        Size:{
            type:DataTypes.DOUBLE
        },
        Percent_Size:{
            type:DataTypes.INTEGER
            
        }
    },{
        tableName:"usefultype_and_building"
    });
    model.associate = models =>{
        model.belongsTo(models.UsefulType,{foreignKey:"Type_on_ID"})
        model.belongsTo(models.Building,{foreignKey:"Build_on_ID"})
    }
    return model
}