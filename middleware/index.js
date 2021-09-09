const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require("axios");
const cors = require("cors");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const config = {
  application: {
    cors: {
      server: [
        {
          origin: "*",
          credentials: true,
        },
      ],
    },
  },
};
const server_list = [];
let ip_host_id = 140;
let serving_index = 0;
let actual_cpu = ''
let actual_ram = ''

app.use(cors(config.application.cors.server));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

function generateInstanceNetwork() {
  let ip = "192.168.100.";
  ip += ip_host_id;
  ip_host_id++;
  server_list.push(ip);
  createVM(ip, server_list.indexOf(ip));
}

function createVM(ip, id) {
  fs.mkdir("./src/resources/vm/" + id, (err) => {
    if (err && err.code != "EEXIST") throw "up";
    fs.writeFile(
      "./src/resources/vm/" + id + "/Vagrantfile",
      'Vagrant.configure("2") do |config|\n' +
        'config.vm.box = "matjung/nodejs14"\n' +
        'config.vm.network "public_network", ip: "' +
        ip +
        '"' +
        '\nconfig.vm.provision "shell", inline: <<-SHELL' +
        "\n apt-get update\n apt-get upgrade" +
        "\n sudo apt-get install -y mysql-server"+
        "\n sudo rm app"+
        "\n sudo mkdir app"+
        "\n cd app"+
        "\n git clone https://github.com/SebSCam/laboratorio_3.git" +
        "\n cd Laboratorio_3" +
        "\n cd server"+
        "\n sudo npm i" +
        "\n sudo npm i -g pm2" +
        "\n pm2 start index.js" +
        "\nSHELL" +
        "\nend",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("el archivo fue creado correctamente");
      }
    );
  });
  exec("cd src/resources/vm/" + ip + "&& vagrant up --provision");
}

setInterval(async() => {
  const cpu = await exec(
    `sshpass -p vagrant ssh vagrant@192.168.100.140 top -bn1 | grep "Cpu(s)" | \
    sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | \
    awk '{print 100 - $1}'`
  );
  cpu.stdout.on("data", (data) => {
    console.log(`Received chunk ${data}`);
    actual_cpu = data;
    io.emit("cpu", data);
  });
  const ram = await exec(`sshpass -p vagrant ssh vagrant@192.168.100.140 free -t | awk 'NR == 2 {print($3/$2*100)}'`);
  ram.stdout.on("data", (data) => {
    console.log(`Received chunk ${data}`);
    actual_ram = ram;
    io.emit("ram", data);
  });
}, 5000);

io.on("connection", (socket) => {
  console.log("[Socket] client conected");
});

app.post("/query", (req, res) => {
  assignServer(req, res);
});

function assignServer(req, res){
  if (serving_index > server_list.length) {
    serving_index = 0
  }else{
    axios.post('http://'+ server_list[serving_index++] + ':3002/query',{
     query: 'SELECT * FROM users;'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.error(error)
    });
  }
}

app.post("/query-out", (req, res) => {
  axios
    .post("http://localhost:4500/query", {
      req,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post('/set', (req, res)=>{
  evaluateNewServer(req.body.cpu, req.body.ram);
})

function evaluateNewServer (cpu, ram) {
  if (actual_cpu >= cpu || actual_ram >= ram) createVM()
}

server.listen(app.get("port"), () => {
  console.log(`Example app listening at http://localhost:3000`);
});
