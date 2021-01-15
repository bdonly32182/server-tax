module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Land",{
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
        Mark:{
            type:DataTypes.STRING(255)
        },
        totalPlace:{
            type:DataTypes.DOUBLE,
            set(value){
                this.setDataValue('totalPlace',(this.RAI * 400) +(this.GNAN *100) + this.WA)
            }
        }
        ,
        Price:{
            type:DataTypes.DOUBLE
        },
        Rate_Price_land:{
            type:DataTypes.DOUBLE,
            set(value) {
                this.setDataValue('Rate_Price_land',this.Price * this.totalPlace)
            }
        }
        ,
        Price_tanaruk:{
            type:DataTypes.DOUBLE,
            defaulValue:0
        },
        Payment_Cus:{
            type:DataTypes.STRING(13)
        }  
    },{
        tableName:"land"
    });
    model.associate = models =>{
        model.belongsTo(models.District,{ForeignKey:"distict_id"})
        model.hasMany(models.UsefulLand,{ForeignKey:"Land_id"})
        // model.belongsToMany(models.Building,{through:models.BuidOnLand})
        // model.belongsToMany(models.Customer,{through:})
        model.hasMany(models.OwnerLand,{foreignKey:"Land_own_id"})
        // model.hasMany(models.OwnerLand)
        model.belongsTo(models.Tax_Group,{foreignKey:"Land_Tax_ID"})
        // model.hasMany(models.NextTo)
        model.belongsTo(models.RateLand,{foreignKey:"rate_land_id"})
    }
    return model

}