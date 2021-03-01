module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Nexto_Useful",{

    },{
        tableName:"Nexto_Useful"
    });
    
    return model
}