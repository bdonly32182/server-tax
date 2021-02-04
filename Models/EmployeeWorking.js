
module.exports=(sequelize,DataTypes)=>{
    //แบ่งเป้นชุดๆ 1 customer 2 land 3 building
    let model = sequelize.define('Working',{
        Category:{
            type:DataTypes.INTEGER
        },
        List_working:{
            type:DataTypes.STRING(255)
        }
    })
    model.associate = models => {
        model.belongsTo(models.Employee,{foreignKey:'Emp_ID'})
    }
    return model
}