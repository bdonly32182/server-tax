
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OwnerRoom",{

    },{
        tableName:"owner_room"
    })
    return model
}