const express = require('express')

const app = express()

app.use('/',(req,res)=>{
    res.status(200).json({
        message:"hello world"
    })
})

app.listen(2000,()=>{
    console.log('server is running on http://localhost:2000')
})