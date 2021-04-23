
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Employee",{
        Pers_no:{
            type:DataTypes.STRING(13),
            primaryKey:true
        },
        TitleEmp:{
            type:DataTypes.STRING(30)
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
        picture:{
            type:DataTypes.STRING(255),
            defaultValue:null
        },
        TableNo:{
            type:DataTypes.STRING(10)
        }
    },{
        tableName:"employee"
    })
    model.associate=models=>{
        model.hasOne(models.Employee_Login,{foreignKey:"employee_no"})
        model.belongsTo(models.District,{foreignKey:"distict_id"})
        model.hasMany(models.Working,{foreignKey:'Emp_ID'})
        model.hasMany(models.Land,{foreignKey:'employee_land'});
        model.hasMany(models.Building,{foreignKey:'employee_build'});
        model.hasMany(models.CheckBook,{foreignKey:'Employee_No'});
        model.hasMany(models.CostBook,{foreignKey:'Employee_No'});
        model.hasMany(models.Condo,{foreignKey:'employee_condo'})
        model.hasMany(models.WarningDoc,{foreignKey:'EmployeeWarningID'});
        model.hasMany(models.PaymentDoc,{foreignKey:'EmployeePaymentID'});
    }
    return model

}