module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("District",{
        District_no:{
            type:DataTypes.INTEGER,
            primaryKey:true

        },
        District_name:{
            type:DataTypes.STRING(255)
        }
    },{
        tableName:"district",
        timestamps:false
    });
    model.associate = models =>{
        model.hasMany(models.Employee,{foreignKey:"distict_id"})
        model.hasMany(models.Land,{foreignKey:"distict_id"})
        // model.hasMany(models.Tambol,{ForeignKey:"distict_id"})
        model.hasMany(models.MemberList,{foreignKey:"distict_member_id"})
        model.hasMany(models.Condo,{foreigkey:"district_id"})
        model.belongsToMany(models.Tax_Group,{through:models.District_has_Tax,foreignKey:"District_ID"})
    }
    return model
}