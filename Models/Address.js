module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Address",{
        Num_House:{
            type:DataTypes.STRING(255),
            
        },
        Moo:{
            type:DataTypes.STRING(255)
        },
        Road_Name:{
            type:DataTypes.STRING(255)
        },
        Soi:{
            type:DataTypes.STRING(255)
        },
        Tambol:{
            type:DataTypes.STRING(255)
        },
        district_name:{
            type:DataTypes.STRING(255)
        },
        Changwat:{
            type:DataTypes.STRING(255)
        },
        Post_No:{
            type:DataTypes.STRING(255)
        },
        Phone_no:{
            type:DataTypes.STRING(10)
        },
        ReceiveName:{
            type:DataTypes.STRING(255)
        }
    },{
        tableName:"address"
    });
    model.associate = models =>{
        model.belongsTo(models.Tax_Group,{foreignKey:"Address_Tax_ID"})
    }
    return model
}