module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Building",{
        Build_Id:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        No_House:{
            type:DataTypes.STRING(255)
        },
        Category:{
            type:DataTypes.STRING(100)
        },
        Width:{
            type:DataTypes.DOUBLE
        },
        Length:{
            type:DataTypes.DOUBLE
        },
        Amount_Room:{
            type:DataTypes.INTEGER
        },
        Amount_Floor:{
            type:DataTypes.DOUBLE
        },
        Build_Total_Place:{
            type:DataTypes.DOUBLE
        }
        ,
        Rate_Price_Build:{
            type:DataTypes.DOUBLE
        },
        Cus_Payment:{
            type:DataTypes.STRING(13)
        },
        Land_main:{
            type:DataTypes.STRING(13)
        },
        Age_Build:{
            type:DataTypes.INTEGER
        },
        Mark:{
            type:DataTypes.STRING(255)

        }
    },{
        tableName:"building"
    }
    );
    model.associate = models =>{
        model.belongsToMany(models.BuildingDepreciation,{through:models.BuildAndDepreciation,foreignKey:"Build_Id"})
        model.belongsTo(models.RateOfBuilding,{foreignKey:"rating_id"})
        // model.hasOne(models.UsefulType,{foreignKey:"building_id",onDelete:'CASCADE', hooks:true})
        // model.belongsTo(models.UsefulLand,{foreignKey:"useful_land_id"})
        model.hasMany(models.TypeOnBuild,{foreignKey:"Build_on_ID"})
        model.hasMany(models.BuildOnUsefulLand,{foreignKey:"Build_id_in_Useful"})
        // model.belongsToMany(models.Land,{through:models.BuidOnLand})
        // model.belongsToMany(models.Customer,{through:models.OwnerBuilding,foreignKey:"Build_Id"})
        model.belongsTo(models.Tax_Group,{foreignKey:"Build_Tax_ID"})
    }
    return model
}