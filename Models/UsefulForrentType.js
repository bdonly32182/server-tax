module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_forrent',{
        Original_Forrent:{
            type:DataTypes.STRING(255)
        },
        ForrentIsNexto:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },{
        tableName:'forrent_on_useful'
    })
    return model
}