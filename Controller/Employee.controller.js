const db = require('../Models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../Config/config.json');
const Op = db.Sequelize.Op
const ConfirmMember = async(req,res)=>{
    if (req.user.role === "leader" ||req.user.role === 'admin'){
        let {Pers_no,password,Fname,Lname,role_name,picture,distict_member_id,TableNo} = req.body
        let checkUser = await db.Employee.findOne({where:{Pers_no:Pers_no}})
        //check ว่ามียูสเซอร์ในระบบรึยัง
        if(checkUser) return res.status(404).send();
        else{
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) throw err
            bcrypt.hash(password,salt,async(err,hash)=>{
                if(err) throw err
                const newEmp =await db.Employee.create({
                    Pers_no,
                    Fname,
                    Lname,
                    picture,
                    TableNo,
                    distict_id: distict_member_id,
                    role:role_name
                })
                await db.Employee_Login.create({
                    password:hash,
                    employee_no:newEmp.Pers_no
                })    
                await db.MemberList.destroy({where:{Pers_no:Pers_no}})
               
            })
        }) 
        return res.status(200).send({msg:"ยืนยันการสมัครเรียบร้อยแล้ว"})
        }
    }
    return res.status(403).send()
};
const Login = async(req,res) =>{
    const {Pers_no,password} = req.body
    const user = await db.Employee.findOne({where:{Pers_no:Pers_no},include:[db.Employee_Login,db.District]});
    // ถ้าไม่มีผู้ใช้งาน return 404
    if(!user) return res.status(404).send()
    bcrypt.compare(password,user.Employee_Login.password,(err,isMatch)=>{
        if(err) throw err
        else if(!isMatch)return res.status(404).send()//ถ้ารหัสไม่ตรง
        else {
            jwt.sign(
                {Pers_no:user.Pers_no,distict_id:user.distict_id,role:user.role,Fname:user.Fname,Lname:user.Lname,
                    picture:user.picture,Abbreviations:user.District.Abbreviations,District_name:user.District.District_name
                },config["jwtSecret"],{expiresIn:'1days'},
            (err,token)=>{
                if(err) throw err
                res.status(200).send({
                    token,
                    Pers_no:user.Pers_no,
                    Fname:user.Fname,
                    Lname:user.Lname,
                    Role:user.role
                })
            })
        }
    })
}
const change_profile = async(req,res) => {
    let {passwordold,password} = req.body
    if (req.user.role === "leader" || req.user.role === "employee" ||req.user.role === 'admin'){
       if (password) {//เปลี่ยน พาสเวิส
        let emp = await db.Employee_Login.findOne({where:{employee_no:req.user.Pers_no}}) //find เพื่อเอารหัสมาเปรียบเทียบ
        bcrypt.compare(passwordold,emp.password,(err,isMatch)=>{
            if(err) throw err;
            else if(!isMatch) return res.status(202).send({msg:'รหัสผ่านเดิมของคุณไม่ตรง กรุณากรอกใหม่'});
            else{
                    bcrypt.genSalt(10,(err,salt)=>{
                        if(err) throw err;
                        bcrypt.hash(password,salt,async(err,hash)=>{
                            if(err) throw err;
                            await db.Employee_Login.update({password:hash},{where:{employee_no:req.user.Pers_no}});
                            return res.status(200).send({msg:'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว'});

                        })
                    })
            }
            
        })
        return;
       }
        await db.Employee.update({...req.body},{where:{Pers_no:req.user.Pers_no}})
        return res.status(200).send({msg:'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว'})
         
    }
   return res.status(403).send()
}
const list_employee = async(req,res) => {
    if (req.user.role === "leader" ||req.user.role === "employee"){
        let employee = await db.Employee.findAll({where:{distict_id:req.user.distict_id}});
        return res.status(200).send(employee)
    }
    return res.status(403).send();
}

module.exports ={
    ConfirmMember,
    Login,
    change_profile,
    list_employee
}