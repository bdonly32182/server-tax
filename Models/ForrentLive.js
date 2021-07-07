module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('ForrentLive',{
         
        Forrent_Type:{
            type:DataTypes.STRING(255),
            defaultValue:'อยู่อาศัย'
        },
        Forrent_Size:{
            type:DataTypes.DOUBLE
        },
        Percent_Forrent:{
            type:DataTypes.DOUBLE
            
        },

    },{
        tableName:"forrent_type"
    });
    model.associate = models =>{
        model.belongsTo(models.Building,{foreignKey:"Build_forrent_ID"});
        model.belongsToMany(models.Land,{through:models.Useful_forrent,foreignKey:"Forrrent_ID"});

    }
    return model
}