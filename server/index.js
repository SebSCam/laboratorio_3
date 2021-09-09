const express = require('express')
const app = express()
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '2021SlFj09',
    database : 'test'
});

connection.connect(function(err) {
    // en caso de error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const config = {
    application: {
        cors: {
            server: [
                {
                    origin: ('*'),
                    credentials: true
                }
            ]
        }
    }
}

app.use(cors(
    config.application.cors.server
));


app.post('/consulta',(req, res)=>{
console.log(req.body.query)
       connection.query(req.body.query,function (err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
    }
    console.log("Consulta ejecutada con éxito:", {rows});
   test(JSON.parse(JSON.stringify(rows)))
   })
})

async function test(result){
console.log(result)
await axios.post('http://192.168.1.112:3000/query-out',result)
        .then( function (response){
        console.log(response)
        })
        .catch(function(error){
        console.log(error)
        })
}

app.listen(4000, () => {
    console.log(`Example app listening at http://localhost:4000`)
})

