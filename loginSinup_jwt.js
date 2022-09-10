const express = require('express');
const app = express();
const port = 4000;
const knex = require('../jwt/dbconnection/DB')
const {generateToken,verifyToken} = require('../jwt/middleware/jwt1')
const fs = require('fs');

app.use(express.json());

const storeUserid = function(ID){
    if(fs.existsSync('./jwt/userid.json')){
        const userinfo = fs.readFileSync('./jwt/userid.json','utf-8')
        const parse = JSON.parse(userinfo)
        if(parse != ''){
            delete parse['UserId']
            fs.writeFileSync('./jwt/userid.json',JSON.stringify({UserId:ID},null,4))
        }else{
            fs.writeFileSync('./jwt/userid.json',JSON.stringify({UserId:ID},null,4))

        }
    }else{
        fs.writeFileSync('./jwt/userid.json',JSON.stringify({UserId:ID},null,4))
        storeUserid(ID)
    }
}
app.post('/userPost',async(req,res)=>{
    try {
        await knex('userData').insert(req.body)
        console.log(req.body);
        res.send(req.body)
    } catch (error) {
        console.log(error);
        res.send('something error')
    }
})
app.get('/login',async(req,res)=>{
    try {
        const {email,password} = req.body
        const data = await knex('userData').where({email,password})
        if(data != 0){
            storeUserid(data[0].id)
            const token = generateToken(data[0].id)
            res.cookie('userToken',token)
            res.json({meg:'login successfull...'})
        }else{
            res.send('user data not found')
        }
    } catch (error) {
        console.log(error.messege);
    }
})
app.get('/read/:id',verifyToken,async(req,res)=>{
    try {
        const UserData = await knex('userData').where({id:req.params.id})
        if(UserData != 0){
            const dataUser = fs.readFileSync('./jwt/userid.json','utf-8')
            let parse1 = JSON.parse(dataUser)
            if(UserData[0].id == parse1['UserId']){
                res.send(UserData)
            }else{
                res.json({msg:'first login'})
            }
        }else{
            res.json({messege:'User Data Not Found'})
        }
    } catch (error) {
        error.messege
    }
})
app.put('/update/:id',async(req,res)=>{
    try {
        const DataUser = fs.readFileSync('./jwt/userid.json','utf-8')
        let parse2 = JSON.parse(DataUser)
        const datauser = await knex('userData').where({id:req.params.id})
        if(datauser != 0){
            if(req.params.id == parse2['UserId']){
                await knex('userData').where({id:req.params.id}).update(req.body)
                res.json({meg:'data updated successfully...'})
            }else{
                res.json({msg:'first login'})
            }
        }else{
            res.json({messg:'User Data Not Found'})
        }
    } catch (error) {
        console.log(error.messege);
    }
})
app.delete('/delete/:id',async(req,res)=>{
    try {
        const DataUser = fs.readFileSync('./jwt/userid.json','utf-8')
        let parse2 = JSON.parse(DataUser)
        const datauser = await knex('userData').where({id:req.params.id})
        if(datauser != 0){
            if(req.params.id == parse2['UserId']){
                await knex('userData').where({id:req.params.id}).del()
                res.json({meg:'data deleted successfully...'})
            }else{  
                res.json({msg:'first login'})
            }
        }else{
            res.json({messg:'User Data Not Found'})
        }
    } catch (error) {
        console.log(error.messege);
    }
})
app.listen(port,()=>{
    console.log(`my server running at this port http://localhost:${port}`);
})