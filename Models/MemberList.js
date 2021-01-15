module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("MemberList",{
        Pers_no:{
            type:DataTypes.STRING(13)
        },
        password:{
            type:DataTypes.STRING(13)
        },
        Fname:{
            type:DataTypes.STRING(255)
        },
        Lname:{
            type:DataTypes.STRING(255)
        },
        role_name:{
            type:DataTypes.STRING(100)
        },
        picture:{
            type:DataTypes.BLOB(),
            defaultValue:"no picture"
        }
    },{
        tableName:"memberlist"
    });
    model.associate = models =>{
        model.belongsTo(models.District,{foreignKey:"distict_member_id"})
    }
    return model
}