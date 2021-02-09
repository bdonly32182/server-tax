
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_farm',{

    },{
        tableName:'farm_on_useful'
    })
    return model
}