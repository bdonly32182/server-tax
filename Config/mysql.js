const db = require('../Models')

module.exports =()=>{
    const sequelize = db.sequelize.sync({alter:true}).then(()=>{
         console.log('sync database success');
     });
     return sequelize
}