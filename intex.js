var crypto=require('crypto');
var uuid=require('uuid');
var express=require('express');
var mysql=require('mysql');
const bodyParser = require('body-parser');
const port=process.env.PORT || 8000;

//connect my sql
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
   // database:'demonodesjs'
   database:'usersone'
});

  //password util
  var genRandomString=function(length){
      return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') /*convert to hexa format*/
      .slice(0,length);/*return required number of characters*/

  };

  

  var sha512=function(password,salt){
      var hash=crypto.createHmac('sha512',salt);
      hash.update(password);
      var value=hash.digest('hex');
      return{
          salt:salt,
          passwordHash:value
      };
  };

  function saltHashPassword(userPassword){
      var salt=genRandomString(16);
      var passwordData=sha512(userPassword,salt);
      return passwordData;
  }

  function checkHashPassword(userPassword,salt){
      var passwordData=sha512(userPassword,salt);
      return passwordData;
  }



var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*app.get("/",(req,res,next)=>{
    console.log('password: 123456');
    var encrypt=saltHashPassword("123456");
    console.log('Encrypy:'+encrypt.passwordHash);
    console.log('salt:'+encrypt.salt);
})*/

app.post('/register/',(req,res,next)=>{
    var post_data=req.body;
    var uid=uuid.v4();
    var plaint_password=post_data.password;
    var hash_data=saltHashPassword(plaint_password);
    var password=hash_data.passwordHash;
    var salt=hash_data.salt;
    var name=post_data.name;
    var email=post_data.email;
    con.query('SELECT * FROM user where email=?',[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });

        if(result && result.length)
        res.json('User already exists');
        else{
            con.query('INSERT INTO `user`(`unique_id`, `name`, `email`, `encrypted_password`, `salt`, `create_at`, `updated_at`) VALUES (?,?,?,?,?,NOW(),NOW())',
            [uid,name,email,password,salt],function(err,result,fields){
                con.on('error',function(err){
                    console.log('[MySQL ERROR]',err);
                    res.json('Register error:',err);
                });
                res.json('Register successful');
            })
        }

    });
   

})
app.get('/slider',(req,res,next)=>{
   
    con.query('SELECT * FROM slider',function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });

           // var salt=result[0].salt;
        
            res.end(JSON.stringify(result[0]+"ajbhhjbsbshgdhghdvdhgvdgvdsgvdhgvdsgvdhdvhdsvhdsvhdsvdshvddgsvdshgvdhgdvhsdvdsvg"))
    });



app.post('/login/',(req,res,next)=>{
    var post_data=req.body;
    var user_password=post_data.password;
    var email=post_data.email;
    con.query('SELECT * FROM user where email=?',[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });

        if(result && result.length){
            var salt=result[0].salt;
            var encrypted_password=result[0].encrypted_password;
            var hashed_password=checkHashPassword(user_password,salt).passwordHash;
            if(encrypted_password==hashed_password)
            res.end(JSON.stringify(result[0]))
            else
            res.end(JSON.stringify('wrong password'));
           
        }

       
        else{
           res.json('User not exists');
        }

    });
   
  /*  con.query('select * from user where email=?',[email],function(error,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
            res.json('Resister erroe',err);
        });
        var salt=result[0].salt;
    })*/
})


    })

   // "devStart": "nodemon video.js"
    

    /*
app.get('/slider',function(req,res,next){
    //slider
   // if(req.query.key==API_KEY){
  // var fbid=req.query.fbid
  // if(fbid!=null){
    con.getConnection(function(error,conn){
        conn.query('SELECT * FROM slider',function(err,rows,fields){
            if(error){
                res.status(500)
                res.send(JSON.stringify({success:false,message:error.message}))
            }else{
                if(rows.length>0){
                    res.send(JSON.stringify({success:true,result:rows}))
                }else{
                    res.send(JSON.stringify({success:false,message:"Empty"}))
                }
            }
        })
    */

app.listen(port,()=>{
    console.log(`lllllll ${port}`);
})
