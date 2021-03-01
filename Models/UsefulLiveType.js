module.exports=(sequelize,DataTypes)=>{
    const model = sequelize.define('Useful_live',{
        LiveisNexto:{
            //ถ้าเป็น ทรู ไม่ต้องออกค่าภาษีคงเหลือ ให้ไปรวมกับแปลงที่ติดกัน
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },{
        tableName:'live_on_useful'
    })
    return model
}