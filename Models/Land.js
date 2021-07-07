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
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        GNAN:{
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        WA:{
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        Mark:{
            type:DataTypes.STRING(255)
        },
        totalPlace:{
            type:DataTypes.DOUBLE,
            set(value){
                this.setDataValue('totalPlace',(this.RAI * 400) +(this.GNAN *100) + (this.WA*1))
            }
        }
        ,
        Price:{
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        Rate_Price_land:{
            type:DataTypes.DOUBLE,
            set(value) {
                this.setDataValue('Rate_Price_land',(this.Price * this.totalPlace).toFixed(2))
            }
        }
       
    },{
        tableName:"land"
    });
    model.associate = models =>{
        model.belongsTo(models.District,{foreignKey:"distict_id"})
        model.hasMany(models.UsefulLand,{foreignKey:"Land_id",onDelete:'CASCADE'})
        model.hasMany(models.OwnerLand,{foreignKey:"Land_own_id"})
        model.belongsTo(models.Tax_Group,{foreignKey:"Land_Tax_ID"})
        model.hasMany(models.RateLand,{foreignKey:"land_id"});
        model.belongsTo(models.Employee,{foreignKey:'employee_land'})
        model.belongsToMany(models.UsefulLand,{as:'Lands',through: 'Nexto_Land',foreignKey:'landID' });

    }
    return model

}