module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_empty',{
        
    },{
        tableName:'empty_on_useful'
    })
    return model
}