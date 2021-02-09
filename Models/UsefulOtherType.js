module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_other',{

    },{
        tableName:'other_on_useful'
    })
    return model
}