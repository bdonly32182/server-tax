
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("RateLand",{
        Serial_code_land:{
            type:DataTypes.STRING(255),
        },
        code_land:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        Category_doc:{
            type:DataTypes.STRING(255)
        },
        Tambol_name:{
            type:DataTypes.STRING(255)
        },
        UTM_Code:{
            type:DataTypes.STRING(255)
        },
        UTM_No:{
            type:DataTypes.STRING(255)
        },
        UTM_Map:{
            type:DataTypes.STRING(255)
        },
        Land_No:{
            type:DataTypes.INTEGER
        },
        Parcel_No:{
            type:DataTypes.STRING(255)
        },
        Survey_No:{
            type:DataTypes.INTEGER
        },
        Moo:{
            type:DataTypes.STRING(255)
        }
        ,
        RAI:{
            type:DataTypes.DOUBLE

        },
        GNAN:{
            type:DataTypes.DOUBLE

        },
        WA:{
            type:DataTypes.DOUBLE

        },
        Price_thanaruk:{
            type:DataTypes.DOUBLE
        }
        
    },{
        tableName:"rate_land_thanaruk"
    });
    model.associate = models =>{
       model.hasOne(models.Land,{foreignKey:"rate_land_id"})
        
    }
    return model

}