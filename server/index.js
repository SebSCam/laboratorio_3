const express = require('express')
const app = express()
const cors = require('cors');
const axios = require('axios');
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
   connection.query(req.body.query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }
    console.log("Consulta ejecutada con éxito:", rows);
        await axios.post('http://localhost:3000/query-out', {
    out: result
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
});
   
})

async function executeQuery(query){
   
}

app.listen(4000, () => {
    console.log(`Example app listening at http://localhost:4000`)
})
