module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("UsefulLand",{
        
        useful_id:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        Useful_RAI:{
            type:DataTypes.DOUBLE

        },
        Useful_GNAN:{
            type:DataTypes.DOUBLE

        },
        Useful_WA:{
            type:DataTypes.DOUBLE
        },
        PriceUseful:{
            type:DataTypes.DOUBLE,
            set(value){
                this.setDataValue('PriceUseful',value * this.Place)
            }
        },
        Place:{
            type:DataTypes.DOUBLE
        },    
        Mark:{
            type:DataTypes.STRING(255)
        },
        Special_Useful:{
            type:DataTypes.INTEGER
        },
        Usage:{
            type:DataTypes.BOOLEAN
        },
        TypeName:{
            type:DataTypes.STRING(100)
        },
        Percent:{
            type:DataTypes.INTEGER,
            defaultValue:100
        }
        
    },{
        tableName:"usefulLand"
    });
    model.associate = models =>{
        model.belongsTo(models.Land,{foreignKey:"Land_id"});
        model.hasMany(models.BuildOnUsefulLand,{foreignKey:"Useful_land_id"})
        // model.hasMany(models.UsefulType,{foreignKey:"useful_ID"})
        model.hasMany(models.UsefulLand,{as:'Children',foreignKey:'Nexto_Id'});
        model.belongsTo(models.Tax_Group,{foreignKey:'UsefulLand_Tax_ID'})
    }
    return model
}