// Module dependencies.
const express = require('express')
	const app = express()
	const bodyparser = require('body-parser')
	const fileUpload = require('express-fileupload')
	const mysql = require('mysql')
	var uuid = require('uuid')

//use express static folder
	app.use(express.static("./public"))

	// set view engine
//	app.set('view engine', 'ejs')

	// body-parser middleware use
	app.use(bodyparser.json())
	app.use(bodyparser.urlencoded({
	   extended: true
	}))

	// fileupload middleware use
	app.use(fileUpload())

	// Database connection
	const db = mysql.createConnection({
	             host : "localhost",
	             user : "root",
	            password : "",
	            database : "pharma"
	})
	db.connect(function (err) {
	      if (err) {
	          return console.error('error: ' + err.message);
	     }
	     console.log('Connected to the MySQL server.');
	})

	// Routes
	
	//@type   GET
	//$route  /
	//@desc   route for Home page
	//@access PUBLIC
	app.get("/", (req,res) => {
	      res.render('Home');
	})

	//@type   POST
	 //$route  /post
	 //@desc   route for post data
	 //@access PUBLIC
	 app.post("/post", (req, res) => {
	     if (!req.files) {
	         res.send("No file upload")
	     } else {
	         var file = req.files.image // here 'image' in Home.ejs form input name
	             //for image upload
	     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
	             var imageName = file.name
	             console.log(imageName)
	             var uuidname = uuid.v1(); // this is used for unique file name
	             var imgsrc = 'http://127.0.0.1:3000/images/' + uuidname + file.name
	             var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
             db.query(insertData, [imgsrc], (err, result) => {
	                 if (err) throw err
					 file.mv('public/images/' + uuidname + file.name)
			   //  res.send("image upload success")
			   res.json({
                message:"image success upload",
                url:imgsrc,
        
            }); 
	             })
	         }
	         // for any file like pdf,docs etc. upload
	         else {
	             var fileName = file.name;
	             console.log(fileName);
	             var uuidname = uuid.v1(); // this is used for unique file name
	             var filesrc = 'http://127.0.0.1:3000/docs/' + uuidname + file.name
	             var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
	             db.query(insertData, [filesrc], (err, result) => {
	                 if (err) throw err
	                 file.mv('public/docs/' + uuidname + file.name)
					 //res.send("data success docs,pdf")
					 res.json({
						message:"docs,pdf success upload",
						url:filesrc,
				
					}); 
	             })
	         }
	     }
	 })
	
	//create connection
	const PORT = process.env.PORT || 4000
	app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))