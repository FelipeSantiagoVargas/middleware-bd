const express = require("express");
const app = express();
const port = 2000;
const axios = require("axios");
const cors = require("cors");

let cont = 1;

setInterval(() => {
  axios
    .get("http://localhost:5000/hola")
    .then(function (response) {
      cont = 1;
      console.log(response.data);
    })
    .catch(function (error) {
      cont = cont+1;
      if (cont == 5) {
        //instanciar sevidor
        cont = 1
      }
      console.log("Servidor Caido");
    })
    .then(function () {});
}, 1000);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
// app.use(express.bodyParser());

app.get("/", (req, res) => {
  res.json("hola mundo");
});

app.post("/addPrisioner", (req, res) => {
  axios
    .post("/serverbasededatos", req.body)
    .then(function (response) {
      console.log(response);
      res.json("Prisionero encarcelado correctamente");
    })
    .catch(function (error) {
      console.log(error);
      res.json("La base de datos no pudo capturar el prisionero");
    });
});

app.get("/prisioners", (req, res) => {
  axios
    .get("/serverbasededatos")
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.json({ message: "Falla en el servidor, intentelo nuevamente" });
    })
    .then(function () {});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
