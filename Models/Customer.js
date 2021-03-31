module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Customer",{
        id_customer:{
            type:DataTypes.STRING(34),
            primaryKey:true,
        },
        Cus_No:{
            type:DataTypes.STRING(20),

        },
        title:{
            type:DataTypes.STRING(100)
        },
        category_Cus:{
            type:DataTypes.STRING(255)
        },
        Cus_Fname:{
            type:DataTypes.STRING(255)
        },
        Cus_Lname:{
            type:DataTypes.STRING(255)
        },
        Num_House:{
            type:DataTypes.STRING(255)
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
            type:DataTypes.STRING(255)
        },
       
        Land_years:{
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        Build_years:{
            type:DataTypes.DOUBLE,
            defaultValue:0
        },
        
        
    },{
        tableName:"customer"
    });
    model.associate = models =>{
        model.belongsTo(models.District,{foreignKey:'isDistrict_id'});
        model.hasMany(models.OwnerLand,{foreignKey:"Customer_own_id"})
        model.belongsToMany(models.Building,{through:models.OwnerBuilding,foreignKey:"Cus_No"});
        // model.belongsToMany(models.Room,{through:models.OwnerRoom,foreignKey:"Cus_No"})
        model.belongsToMany(models.Tax_Group,{through:models.Customer_has_tax,foreignKey:"Cus_No"})
    }
    return model
}