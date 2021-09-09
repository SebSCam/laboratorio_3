const { json } = require("express")

var divRamsIds = ['ram1']
var divProcIds = ['proc1']
var spRamsIds = ['spr1']
var spProcIds = ['spp1']
var indMachines = 0

const socket = io("http://127.0.0.1:2000");



function listen(){
    //aqui va el metodo de los sockets, si se cumple un condicional, se ejecuta el metodo de crear una nueva maquina
    socket.on("cpu", (arg) => {
        console.log(arg);
    });

    socket.on("ram", (arg) => {
        console.log(arg);
    });
}    
    

function readStatusMachine() {
    document.getElementById("spr1").textContent = "newtext";
    document.getElementById("ram1").className = "progress-circle p40";
    alert(spRamsIds.length)    
}

function createNewMachine(){
    indMachines++
    divRamsIds.push('ram'+(indMachines+1))
    divProcIds.push('proc'+(indMachines+1))
    spRamsIds.push('spr'+(indMachines+1))
    spProcIds.push('spp'+(indMachines+1))
    addNewMachineToShow()
}

function addNewMachineToShow() {
    document.getElementById('containerStatus').innerHTML += `
            <div class="container contStatus" style="display:flex;">
                    <h3 class="elementForm">${'aqui se mete el nombre de la nueva maquina'}</h3>
                    <h3 class="elementForm">Memoria Ram</h3>
                    <div class="elementForm">
                        <div id="${divRamsIds[indMachines]}" class="progress-circle p0}">
                            <span id="${spRamsIds[indMachines]}">0%</span>
                            <div class="left-half-clipper">
                                <div class="first50-bar"></div>
                                <div class="value-bar"></div>
                            </div>
                        </div>
                    </div>
                    <h3 class="elementForm">Procesador</h3>
                    <div class="elementForm">
                        <div id="proc${divProcIds[indMachines]}" class="progress-circle p0">
                            <span id=${spProcIds[indMachines]}>0%</span>
                            <div class="left-half-clipper">
                                <div class="first50-bar"></div>
                                <div class="value-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
}

readStatusMachine()