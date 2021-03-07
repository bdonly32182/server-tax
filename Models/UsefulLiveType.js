module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_live',{
       BalanceDiscount:{
           type:DataTypes.INTEGER
       }
    },{
        tableName:'live_on_useful'
    })
    return model
}