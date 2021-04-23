module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("District",{
        District_no:{
            type:DataTypes.STRING(20),
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
        },
        Abbreviations:{
            type:DataTypes.STRING(20)
        },
        MonthPay:{
            type:DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        LeaderOfDistrict:{
         type:DataTypes.STRING(255),
         },
        ExportBookNo:{
            type:DataTypes.STRING(255),
        }
    },{
        tableName:"district",
        timestamps:false
    });
    model.associate = models =>{
        model.hasMany(models.Employee,{foreignKey:"distict_id"})
        model.hasMany(models.Land,{foreignKey:"distict_id"})
        model.hasMany(models.Customer,{foreignKey:'isDistrict_id'});
        model.hasMany(models.MemberList,{foreignKey:"distict_member_id"})
        model.hasMany(models.Condo,{foreignKey:"distict_id"})
        model.hasMany(models.Tax_Group,{foreignKey:"Tax_in_district"})
        model.hasMany(models.Building,{foreignKey:'Build_in_district'})
        model.hasMany(models.CheckBook,{foreignKey:'districtNo'});
        model.hasMany(models.CostBook,{foreignKey:'districtNo'});
        model.hasMany(models.WarningDoc,{foreignKey:'WarningDistrict'});
        model.hasOne(models.PaymentDoc,{foreignKey:'PaymentDistrict'});

    }
    return model
}