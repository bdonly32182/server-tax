
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("District_has_Tax",{

    },{
        tableName:"distric_has_tax"
    })
    return model
}