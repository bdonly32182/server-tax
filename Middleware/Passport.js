const passport = require('passport');
const {Strategy,ExtractJwt} = require('passport-jwt');
const db = require('../Models');
const config = require('../Config/config.json')
const option = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config["jwtSecret"]
}
const JWTStrategy = new Strategy(option,async (payload,done)=> {
    const targetEmp = await db.Employee.findOne({where:{Pers_no:payload.Pers_no},include:[db.Employee_Login,db.District]})
    if (targetEmp) {
        done(null,targetEmp);
    }else{
        done(null,false)
    }
})
passport.use("jwt",JWTStrategy)