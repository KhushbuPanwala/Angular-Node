//use path module
const path = require('path');

//use express module
const express = require('express');

//use bodyParser middleware
const bodyParser = require('body-parser');

//use mysql database
const mysql = require('mysql');

var formidable = require('formidable');
var fs = require('fs');

const app = express();

const cors = require('cors')

var originsWhitelist = [
    'http://localhost:4200',
    'https://localhost:44311/',
    //this is my front-end url for development
];

var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions));

////upload image
//const router = express.Router();
//var multer = require("multer");
//const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//        cb(null, './upload')
//    },
//    filename: function (req, file, cb) {
//        cb(null, file.originalname)
//    }
//})
//const upload = multer({
//    storage: storage
//})


//Create connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'promact',
    database: 'crud_db'
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));


app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

//set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));


//Login User
app.post('/authenticateUser', (req, res) => {
    let sql = "SELECT * FROM user WHERE Email='" + req.body.Email + "' AND Password = '" + req.body.Password + "';";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});

//User Detail
app.get('/user', (req, res) => {
    let sql = "SELECT * FROM user";
    conn.query(sql, (err, results) => {
        res.send(results);
    });
});

app.get('/userById', (req, res) => {
    let userId = parseInt(req.query.id);
    let sql = "SELECT * FROM user WHERE Id=" + userId;
    conn.query(sql, (err, results) => {
        res.send(results);
    });
});

app.post('/saveUser', (req, res) => {
    let data = {
        firstName: req.body.FirstName, lastName: req.body.LastName,
        email: req.body.Email, password: req.body.Password
    };

    let sql = "INSERT INTO user SET ?";
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.put('/updateUser', (req, res) => {
    let sql = "UPDATE user SET FirstName='" + req.body.FirstName + "', LastName='" + req.body.LastName +
        "', Email = '" + req.body.Email + "', Password = '" + req.body.Password +
        "' WHERE Id=" + req.body.Id;

    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.delete('/deleteUser', (req, res) => {
    let userId = parseInt(req.query.id);
    let sql = "DELETE FROM user WHERE Id=" + userId;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});


//Product Detail
app.get('/products', (req, res) => {
    let sql = "SELECT * FROM product";
    conn.query(sql, (err, results) => {
        res.send(results);
    });
});

app.get('/productsById', (req, res) => {
    let productId = parseInt(req.query.id);
    let sql = "SELECT * FROM product WHERE Id=" + productId;
    conn.query(sql, (err, results) => {
        res.send(results);
    });
});

app.post('/saveProduct', (req, res) => {
    let data = {
        ProductCode: req.body.ProductCode, ProductName: req.body.ProductName,
        Category: req.body.Category,
        Price: req.body.Price, Quantity: req.body.Quantity,
        //Description: req.body.Description,
    };

    let sql = "INSERT INTO product SET ?";
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.put('/updateProduct', (req, res) => {
    let sql = "UPDATE product SET ProductCode='" + req.body.ProductCode + "', ProductName='" + req.body.ProductName +
        "', Category = '" + req.body.Category +
        "', Price = '" + req.body.Price + "', Quantity = '" + req.body.Quantity +
        "' WHERE Id=" + req.body.Id;
    //"', Description = '" + req.body.Description +

    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.delete('/deleteProduct', (req, res) => {
    let userId = parseInt(req.query.id);
    let sql = "DELETE FROM product WHERE Id=" + userId;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Cart Detail
app.post('/addTocart', (req, res) => {
    let data = {
        UserId: req.body.UserId, ProductId: req.body.ProductId,
        ProductName: req.body.ProductName, Quantity: req.body.Quantity,
        Price: req.body.Price
    };
    let sql = "INSERT INTO cart SET ?";
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/cartDetails', (req, res) => {
    let userId = parseInt(req.query.id);
    let sql = "SELECT * FROM cart WHERE UserId=" + userId;
    conn.query(sql, (err, results) => {
        res.send(results);
    });
});

app.delete('/deleteCart', (req, res) => {
    let cartId = parseInt(req.query.id);
    let sql = "DELETE FROM cart WHERE Id=" + cartId + "";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});




//app.post('fileupload', upload.single('file'), (req, res) => {
//    console.log("fileupload:" + files);
//    // the file is uploaded when this route is called with formdata.
//    // now you can store the file name in the db if you want for further reference.
//    const filename = req.file.filename;
//    const path = req.file.path;
//    // Call your database method here with filename and path
//    res.json({ 'message': 'File uploaded' });
//});

//app.post("/fileupload", multer({ dest: "/public/productImage/" }).array("uploads", 12), function (req, res) {
//    console.log("fileupload1");
//    res.send(req.files);
//});

////route for upload image
//app.post('/fileupload', (req, res) => {
//    console.log("fileupload");
//    var form = new formidable.IncomingForm();
//    form.parse(req, function (err, fields, files) {
//        console.log("files:" + files);
//        console.log("filetoupload:" + files.filetoupload);
//        //console.log("path:" + files.filetoupload.path);

//        var oldpath = files.filetoupload.path;
//        console.log("oldpath : " + oldpath);
//        //./assets/productImage/
//        var newpath = (__dirname + '/assets/productImage/' + files.filetoupload.name);
//        console.log("newpath: " + newpath);
//        fs.rename(oldpath, newpath, function (err) {

//            if (err) throw err;
//            res.send("File uploaded successfully!");
//            //res.write('File uploaded successfully!');
//            //res.end();
//        });
//    });
//});

//server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});

//module.exports = router;