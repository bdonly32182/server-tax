
module.exports =(sequelize,DataTypes) => {
    const model = sequelize.define("Useful_room",{
        Category_use:{
            type:DataTypes.STRING(255),
        },
        Category_place:{
            type:DataTypes.STRING(255),
        },
        Price_Room:{
            type:DataTypes.DOUBLE
        },
        Amount_Place:{
            type:DataTypes.DOUBLE
        }

    },{
        tableName:"useful_room"
    })
    model.associate = models =>{
        model.belongsTo(models.Room,{foreigkey:"room_id"})
    }
    return model
}