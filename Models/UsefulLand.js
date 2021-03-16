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
        marks:{
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
        },
        isAccross:{
            //ถ้าเป็นทรู จะไม่สามารถสร้างสิ้งปลูกสร้างได้
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        isNexto:{
            //ถ้าเป็น ทรู ไม่ต้องออกค่าภาษีคงเหลือ ให้ไปรวมกับแปลงที่ติดกัน
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        EmptyAbsolutes:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        StartYears:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
        
    },{
        tableName:"usefulLand"
    });
    model.associate = models =>{
        model.belongsTo(models.Land,{foreignKey:"Land_id"});
        model.hasMany(models.BuildOnUsefulLand,{foreignKey:"Useful_land_id"});
        model.belongsToMany(models.LiveType,{through:models.Useful_live,foreignKey:"Useful_live_ID"});
        model.belongsToMany(models.FarmType,{through:models.Useful_farm,foreignKey:"Useful_farm_ID"});
        model.belongsToMany(models.EmptyType,{through:models.Useful_empty,foreignKey:"Useful_empty_ID"});
        model.belongsToMany(models.OtherType,{through:models.Useful_other,foreignKey:"Useful_other_ID"});
        model.belongsToMany(models.UsefulLand,{as:'Useful',through: 'Nexto_Useful',foreignKey:'Useful_ID' });
        model.belongsTo(models.Tax_Group,{foreignKey:'UsefulLand_Tax_ID'})

    }
    return model
}