module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Nexto_Land",{

    },{
        tableName:"Nexto_Land"
    });
    
    return model
}