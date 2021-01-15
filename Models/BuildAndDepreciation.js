
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('BuildAndDepreciation',{
        Price_depreciate:{
            type:DataTypes.DOUBLE
           
        },
        PriceAfterDepreciation :{
            type:DataTypes.INTEGER,
            set(value) {
                this.setDataValue('PriceAfterDepreciation',value - this.Price_depreciate)
            }
        }
        
    },{
        tableName:"build_own_depreciation"
    })
    // model.associate =models =>{
    //     // model.belongsTo(models.Building,{foreignKey:"Build_ID"})
    //     // model.belongsTo(models.BuildingDepreciation,{foreignKey:"Depreciate_ID"})
    // }
    return model
}