module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_live',{

    },{
        tableName:'live_on_useful'
    })
    return model
}