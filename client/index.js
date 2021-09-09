//Librerias
const express = require('express');
const cors = require('cors');
const axios = require('axios');
//Declaración de app
const app = express();
//Configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static("static"));
//Permitir que cualquier equipo acceda
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

//Microservicios

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/sendRequire', function (req, res) {
    var ramMemory = req.body.ramMemory
    var processUse = req.body.ProcessorUse
    console.log("nuevos criterios:\nmemoria: "+ramMemory+"\nuso del procesador: "+processUse)
})

app.listen(5000, () => {
    console.log('Client running on http://localhost:5000')
});