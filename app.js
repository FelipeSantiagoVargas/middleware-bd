const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const cors = require("cors");
const shelljs = require("shelljs")
var serverPort = 3002
var mongoPort = 27017
const WRITE_LOG_BASH_PATH = "./scripts/write_log_file.sh"
const EXECUTE_DOCKER_PATH = "./scripts/execute_docker.sh"
const LOG_FILE_PATH = "./data/log_file.log"

let cont = 1;

setInterval(() => {
  axios
    .get(`http://localhost:${serverPort}/status`)
    .then(function (response) {
      cont = 0;
    })
    .catch(function (error) {
      cont = cont+1;
      if (cont == 5) {
        writeLog("El servidor no respondió durante 5 segundos... Instanciando nuevo servidor")
        executeNewInstance()
        cont = 0
      }
      console.log("Servidor Caido");
    })
    .then(function () {});
}, 1000);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.post("/addPrisioner", (req, res) => {
  axios
    .post(`http://localhost:${serverPort}/newprisioner`, req.body)
    .then(function (response) {
      writeLog("El servidor atendió una petición correctamente")
      res.json("Prisionero encarcelado correctamente");
    })
    .catch(function (error) {
      writeLog("La base de datos no pudo capturar el prisionero")
      res.json("La base de datos no pudo capturar el prisionero");
    });
});

app.get("/prisioners", (req, res) => {
  axios
    .get(`http://localhost:${serverPort}/prisioners`)
    .then(function (response) {
      writeLog("Se obtuvo la información de la base de datos de forma correcta")
      res.json(response.data);
    })
    .catch(function (error) {
      writeLog("No se pudo acceder a la información de la base de datos")
      res.json({ message: "Falla en el servidor, intentelo nuevamente" });
    })
    .then(function () {});
});

function writeFile(script_path, message){
  shelljs.exec(`sh ${script_path} ${message}`, {silent: true})
}

function writeLog(info){
  let message = `"${info}" ${LOG_FILE_PATH}`
  writeFile(WRITE_LOG_BASH_PATH, message)
}

function executeNewInstance(){
  serverPort++
  mongoPort++
  shelljs.exec(`sh ${EXECUTE_DOCKER_PATH} ${serverPort} ${mongoPort}`)
  writeLog("Servidor instanciado")
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
