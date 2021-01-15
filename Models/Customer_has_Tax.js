
module.exports = (sequelize,DataTypes) =>{
    const model = sequelize.define('Customer_has_tax',{

    },{
        tableName:"customer_has_tax"
    })
    return model
}