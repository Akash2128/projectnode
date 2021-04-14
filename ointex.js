var express=require('express');
var mysql=require('mysql');
var bodyParser=require('body-parser');
var app=express();
//var multer=require("multer");
var util=require('util');
var path=require('path');
var fileupload=require('express-fileupload');
const fileUpload = require('express-fileupload');
//const fileUpload = require('express-fileupload');


var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"pharma"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static("./public"))
app.put("/upload",async(req,res)=>{
    try{
        var file=req.files.file;
        var fileName=file.name;
        var size=file.data.length;
        var extension=path.extname(fileName);
        var allowedExtensions=/png|jpeg|jpg|gif/;
        if(!allowedExtensions.test(extension)) throw "Unsupported extension";
        if(size>5000000) throw "File must be less than 5MB";

        var md5=file.md5;
        var URL="/uploads"+md5+extension;

        await util.promisify(file.mv)("./public"+URL);
       // var post_data = req.body;
       con.query('UPDATE `registration` SET `productName`=?,`address`=? WHERE `id` =?',[req.body.productName,URL,req.body.id],function(err,result,fields){
        if(err) throw err;
               // res.json("succesful");
               // res.end(JSON.stringify(result));
             //  res.json("Successfull");
             res.json({
                message:"File success upload",
                url:URL,
        
            }); 
        }) 
       /* res.json({
            message:"File success upload",
            url:URL,
        })*/
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:err,
        })
    }
   
})

app.get("/",(req,res,next)=>{
    con.query("SELECT * FROM registration",function(err,result,field){
      if(err) throw err;
      res.end(JSON.stringify(result));
    });
});

app.post("/",(req,res,next)=>{
    var post_data = req.body;
    con.query(`INSERT INTO registration SET?`,post_data,function(err,result,field){
            if(err) throw err;
           // res.json("succesful");
           // res.end(JSON.stringify(result));
           res.json("Successfull");
    
        });  
   
});

app.put("/",(req,res,next)=>{
    con.query('UPDATE `registration` SET `productName`=?,`address`=? WHERE `id` =?',[req.body.productName,req.body.address,req.body.id],function(err,result,fields){
        if(err) throw err;
        res.json("update");
    })
})
app.delete("/",(req,res,next)=>{
    con.query('DELETE FROM `registration` WHERE `id` =?',[req.body.id],function(err,result,fields){
        if(err) throw err;
        res.json("delete success");
    })
})

    


/*app.get("/",(req,res,next)=>{
    res.end("GET REQUEST");
});

app.post("/",(req,res,next)=>{
    res.end("post REQUEST");
});

app.put("/",(req,res,next)=>{
    res.end("put REQUEST");
});

app.delete("/",(req,res,next)=>{
    res.end("delete REQUEST");
});*/


//start webservise
app.listen(3000,()=>{
    console.log("Web Service running on port 3000");
})