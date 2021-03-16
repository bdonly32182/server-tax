module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("District",{
        District_no:{
            type:DataTypes.INTEGER,
            primaryKey:true

        },
        District_name:{
            type:DataTypes.STRING(255)
        },
        Address_Tambol:{
            type:DataTypes.STRING(255)
        },
        Address_District:{
            type:DataTypes.STRING(255)
        },
        Address_Country:{
            type:DataTypes.STRING(255)
        },
        Address_PostNo:{
            type:DataTypes.STRING(255)
        },
        Tel:{
            type:DataTypes.STRING(20)
        }
    },{
        tableName:"district",
        timestamps:false
    });
    model.associate = models =>{
        model.hasMany(models.Employee,{foreignKey:"distict_id"})
        model.hasMany(models.Land,{foreignKey:"distict_id"})
        // model.hasMany(models.Tambol,{ForeignKey:"distict_id"})
        model.hasMany(models.Customer,{foreignKey:'isDistrict_id'});

        model.hasMany(models.MemberList,{foreignKey:"distict_member_id"})
        model.hasMany(models.Condo,{foreignKey:"distict_id"})
        model.hasMany(models.Tax_Group,{foreignKey:"Tax_in_district"})
        model.hasMany(models.Building,{foreignKey:'Build_in_district'})

    }
    return model
}