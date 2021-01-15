
module.exports=(sequelize,DataTypes) => {
    const model = sequelize.define('Condo',{
        Condo_name:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        Register_no:{
            type:DataTypes.STRING(255)
        },
        Parcel_no:{
            type:DataTypes.STRING(255),
        },
        Survey_no:{
            type:DataTypes.STRING(255),
        },
        Condo_no:{
            type:DataTypes.STRING(255),
        },
        village:{
            type:DataTypes.STRING(255),
        },
        Soi:{
            type:DataTypes.STRING(255),
        },
        Road:{
            type:DataTypes.STRING(255),
        },
        Country:{
            type:DataTypes.STRING(255),
        },
        
        Tambol:{
            type:DataTypes.STRING(255),
        },
        Post_no:{
            type:DataTypes.STRING(255),
        },
        Mark:{
            type:DataTypes.STRING(255),
        }
    },{tableName:"condo"})

    model.associate = models =>{
        model.belongsTo(models.District,{ForeignKey:"distict_id"})
        model.hasMany(models.Room,{foreignKey:"Condo_no"})
    }
    return model
}