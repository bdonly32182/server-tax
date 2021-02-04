module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("OwnerLand",{
        //จะเก็บไอดีเเลน และ ประชาชน ที่นำเข้าจาก เอ็กเซล
        Line_No:{
            type:DataTypes.INTEGER
        },
 
    },{
        tableName:"ownerLand"
    });
    model.associate = models => {
        model.belongsTo(models.Land,{foreignKey:"Land_own_id"})
        model.belongsTo(models.Customer,{foreignKey:"Customer_own_id"})
    }
    return model
}