module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("UsefulType",{
        
        Name_Type:{
            type:DataTypes.STRING(255)
        },
        Farm_Size:{
            type:DataTypes.DOUBLE
        },
        Live_Size:{
            type:DataTypes.DOUBLE
        },
        For_Rent_Size:{
            type:DataTypes.DOUBLE
        },
        Empy_size:{
            type:DataTypes.DOUBLE
        },
        Other_Size:{
            type:DataTypes.DOUBLE
        },
        Live_YourSelf:{
            type:DataTypes.BOOLEAN
        },
        Percent_FARM:{
            type:DataTypes.DOUBLE
        },
        Percent_FORRENT:{
            type:DataTypes.DOUBLE
        },
        Percent_EMPTY:{
            type:DataTypes.DOUBLE
        },
        Percent_OTHER:{
            type:DataTypes.DOUBLE
        },
        Percent_LIVE:{
            type:DataTypes.DOUBLE
            
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