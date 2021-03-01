module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define("Building",{
        Build_Id:{
            type:DataTypes.STRING(255),
            primaryKey:true
        },
        No_House:{
            type:DataTypes.STRING(255)
        },
        StyleBuilding:{
            type:DataTypes.STRING(100)
        },
        Width:{
            type:DataTypes.DOUBLE
        },
        Length:{
            type:DataTypes.DOUBLE
        },
        Amount_Room:{
            type:DataTypes.INTEGER
        },
        Amount_Floor:{
            type:DataTypes.DOUBLE
        },
        Build_Total_Place:{
            type:DataTypes.DOUBLE
        }
        ,
        Rate_Price_Build:{
            //ราคาประเมิณสิ่งปลูกสร้าง  พื้นที่ทั้งหมด คูณ ราคา
            type:DataTypes.DOUBLE
        },
        Age_Build:{
            type:DataTypes.INTEGER
        },
        Percent_Age:{
            //percent ค่าความเสื่อม
            type:DataTypes.INTEGER,
            set(value){
                //เมื่ออัตราเปอร์เซ็นความเสื่อมเป็น ตลอดอายุการใช้งานแล้ว font-end จะส่งค่าเป็น 0 มาให้
                if (value === 0&&this.StyleBuilding ==="ไม้" && this.Age_Build >18) {
                  return  this.setDataValue('Percent_Age',93)
                }
                if (value === 0&&this.StyleBuilding ==="ตึก" && this.Age_Build >42) {
                   return this.setDataValue('Percent_Age',76)
                }
                if (value === 0&&this.StyleBuilding ==="ครึ่งตึกครึ่งไม้" && this.Age_Build >21) {
                   return this.setDataValue('Percent_Age',85)
                }
                //เมื่อไม่เข้าเงื่อนไขทั้งหมดข้างบน ให้เซ็ทเปอร์เซ็นเท่ากับค่าที่ให้มา
                return this.setDataValue('Percent_Age',value)
            }
        },
        PriceDepreciation:{
            //Rate_Price_Build * Percent_Age /100;
            type:DataTypes.DOUBLE,
            set(value) {
                this.setDataValue('PriceDepreciation',(this.Rate_Price_Build * this.Percent_Age) / 100)
            }
        },
        AfterPriceDepreciate : {
            //Rate_Price_Build - PriceDepreciation ;
            type:DataTypes.DOUBLE,
            set(value) {
                this.setDataValue('AfterPriceDepreciate',this.Rate_Price_Build - this.PriceDepreciation)
            }
        },
        Mark:{
            type:DataTypes.STRING(255)

        },
        Sub_Category:{
            type:DataTypes.STRING(255)
        }

    },{
        tableName:"building"
    }
    );
    model.associate = models =>{
        model.belongsTo(models.RateOfBuilding,{foreignKey:"rating_id"})
        model.hasOne(models.LiveType,{foreignKey:"Build_live_ID",onDelete:'CASCADE'})
        model.hasOne(models.FarmType,{foreignKey:"Build_farm_ID",onDelete:'CASCADE'})
        model.hasOne(models.EmptyType,{foreignKey:"Build_empty_ID",onDelete:'CASCADE'})
        model.hasOne(models.OtherType,{foreignKey:"Build_other_ID",onDelete:'CASCADE'})
        model.hasMany(models.BuildOnUsefulLand,{foreignKey:"Build_id_in_Useful"})
        model.belongsTo(models.Tax_Group,{foreignKey:"Build_Tax_ID"})
        model.belongsTo(models.District,{foreignKey:'Build_in_district'})
    }
    return model
}