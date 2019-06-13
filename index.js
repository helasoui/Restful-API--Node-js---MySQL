const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'evaluation',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


function sendSQLRequestAlbumsSync(row) {
    return new Promise(resolve => {
        mysqlConnection.query("SELECT * FROM albums WHERE pruduct_id = ? ", row.idProducts, (err, data, fiels) => {
            resolve(data);
        });
    })
}
function sendSQLRequestReviewsSync(row) {
    return new Promise(resolve => {
        mysqlConnection.query("SELECT * FROM reviews WHERE idproduct = ? ", row.idProducts, (err, data, fiels) => {
            resolve(data);
        });
    })
}


//Get all products 
app.get('/products', (req, res) => {
    mysqlConnection.query('SELECT * FROM products', async (err, rows, fields) => {
        if (!err) {

            for (row of rows) {
                let albums = await sendSQLRequestAlbumsSync(row);
                let reviews = await sendSQLRequestReviewsSync(row);
                row.albums = albums;
                row.reviews = reviews;
            }
            res.send(rows);
        }

        else
            console.log(err);
    })
})
//Get an products
app.get('/products/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM products WHERE idProducts = ?', [req.params.id], async (err, rows, fields) => {
        if (!err) {
            if (rows.length === 0) res.send({ "message": "Product doesn't exist" });
            var row = rows[0];
            let albums = await sendSQLRequestAlbumsSync(row);
            let reviews = await sendSQLRequestReviewsSync(row);
            row.albums = albums;
            row.reviews = reviews;
            res.send(rows);
        }
        else
            console.log(err);
    })
});


//Add Review
app.post('/products/:id/reviews', (req, res) => {

    let emp = req.body;
    var sql = 'INSERT INTO reviews (score,descrip,idproduct) VALUES (?,?,?) '
    mysqlConnection.query(sql, [emp.score, emp.description, req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});





function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
    
}



//generating image stream
var fs = require("fs");
app.get('/products/:id/albums', (req, res) => {
    var sql = 'select path from albums where pruduct_id = ?'
    mysqlConnection.query(sql, [req.params.id], (err, result) => {
        if (!err) {
            for (x of result) {
                image = x.path + "\\" +"IMG_20171204_195126.jpg";
            }
            fs.readFile(image, function(err, data) {
                if (err) throw err;
                //convert an image 
                var decodedImage = new Buffer(data, 'base64').toString('binary');
                res.send(decodedImage); 
              });
        }
        else
            console.log(err);
    })
});

