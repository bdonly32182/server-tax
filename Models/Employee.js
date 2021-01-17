
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Employee",{
        Pers_no:{
            type:DataTypes.STRING(13),
            primaryKey:true
        },
        Fname:{
            type:DataTypes.STRING(255)
        },
        Lname:{
            type:DataTypes.STRING(255)
        },
        role:{
            type:DataTypes.STRING(100)
        },
        pictur:{
            type:DataTypes.STRING(255),
            defaultValue:"no picture"
        }
    },{
        tableName:"employee"
    })
    model.associate=models=>{
        model.hasOne(models.Employee_Login,{foreignKey:"employee_no"})
        // model.hasOne(models.Role,{ForeignKey:"employee_no"})
        model.belongsTo(models.District,{foreignKey:"distict_id"})
    }
    return model

}