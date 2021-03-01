
module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_farm',{
        FarmisNexto:{
            //ถ้าเป็น ทรู ไม่ต้องออกค่าภาษีคงเหลือ ให้ไปรวมกับแปลงที่ติดกัน
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },{
        tableName:'farm_on_useful'
    })
    return model
}