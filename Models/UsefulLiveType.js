module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_live',{
       BalanceDiscount:{
           type:DataTypes.DOUBLE,
           defaultValue:0.0
       }
    },{
        tableName:'live_on_useful'
    })
    return model
}