module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Employee_Login",{
        
        password:{
            type:DataTypes.STRING(255)
        }
    },{
        tableName:"emp_login"
    });

    model.associate = models =>{
        model.belongsTo(models.Employee,{foreignKey:"employee_no"})
    }
    return model
}