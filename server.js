const db = require('./Config/mysql')
const express = require('./Config/express');
db()
const app = express();

let port = process.env.PORT || 3001
 app.listen(port,()=>{
        console.log(`server running on port ${port}`);
    })