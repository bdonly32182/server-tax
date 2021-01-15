
module.exports=(sequelize,DataTypes) => {
    const model = sequelize.define('Room',{
        Room_ID:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        Room_no:{
            type:DataTypes.STRING(255)
        },
        Floor:{
            type:DataTypes.STRING(255),
        },
        mark:{
            type:DataTypes.STRING(255),
        }
    },{tableName:"room"})
    model.associate = models =>{
        model.hasMany(models.Useful_room,{foreigkey:"room_id"})
        model.belongsToMany(models.Customer,{through:models.OwnerRoom,forignKey:"Condo_no"})
        model.belongsTo(models.Condo,{foreignKey:"Condo_no"})
        model.belongsTo(models.Tax_Group,{foreignKey:"Room_Tax_ID"})
    }
    return model
}