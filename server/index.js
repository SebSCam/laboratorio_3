const express = require('express')
const app = express()
const cors = require('cors');
const axios = require('axios');
const { pool } = require('./database')

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

app.post('/queryC',(req, res)=>{
    console.log(req.body);
    console.log(req.body.query)
    executeQuery(req.body.query);
})

async function executeQuery(query){
    console.log(query)
    const result = await pool.query(query);
    await axios.post('http://localhost:3000/query-out', {
    out: result
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

app.listen(4000, () => {
    console.log(`Example app listening at http://localhost:4000`)
})
