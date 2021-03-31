const express = require('express');
const cors = require('cors');
module.exports=()=>{
    const app = express();
    global.__basedir = __dirname + "/..";
    require('../Middleware/Passport')
    app.use(cors());
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.use(express.static('public'))
    require('../Router/MemberList.router')(app);
    require('../Router/Disctict.router')(app);
    require('../Router/Employee.router')(app);
    require('../Router/Land.router')(app);
    require('../Router/Customer.router')(app);
    require('../Router/OwnerLand.route')(app);
    require('../Router/UsefulLand.router')(app);
    require('../Router/Build.router')(app);
    require('../Router/NextToLand.router')(app);
    require('../Router/OwnerBuilding.route')(app);
    require('../Router/Condo.router')(app);
    require('../Router/Room.router')(app);
    require('../Router/Tax.router')(app);
    require('../Router/PDS3.router')(app);
    require('../Router/PDS6.router')(app);
    require('../Router/PDS7.router')(app);
    require('../Router/PDS8.router')(app);
    require('../Router/Type.router')(app);
    require('../Router/File.router')(app);
    require('../Router/Puppetteer.router')(app);
    return app;
}