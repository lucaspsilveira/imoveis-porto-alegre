const axios = require('axios');
const fs = require('fs');
const RealState = require('./Models/RealState');
const guaridaService = require('./Services/GuaridaService');
const auxiliadoraService = require('./Services/AuxiliadoraService');
const foxterService = require('./Services/FoxterService');
const nameCsvFile = 'realStatesFiltered400k.csv';

function writeRealStateToFile(csvFile, realState) {
    csvFile.write(realState.Price + ",");
    csvFile.write(realState.Area + ",");
    csvFile.write(realState.AddressStreet + ",");
    csvFile.write(realState.AddressStreetNumber + ",");
    csvFile.write(realState.District + ",");
    csvFile.write(realState.BedroomQuantity + ",");
    csvFile.write(realState.Link + ",");
    csvFile.write(realState.Latitude + ",");
    csvFile.write(realState.Longitude + ",");
    csvFile.write(realState.Source + "\n");
}

console.log("Script started!")
let a = new RealState();
let array = Object.getOwnPropertyNames(a);
let headerCsv = array.join(',')
console.log(headerCsv)
let totalRealStates = 0
guaridaService.sendGuaridaRequest().then(realStates => {
    totalRealStates = realStates.length
    var csvFile = fs.createWriteStream(nameCsvFile, {
        flags: 'w' // 'a' means appending (old data will be preserved)
        , encoding: "utf-8"
    })
    csvFile.write(headerCsv + '\n')

    realStates.forEach(realState => {
        writeRealStateToFile(csvFile, realState);
    });
    auxiliadoraService.sendAuxiliadoraRequest().then(realStates => {
        totalRealStates += realStates.length
        realStates.forEach(realState => {
            writeRealStateToFile(csvFile, realState);
        });
        foxterService.sendFoxterRequest().then(realStates => {
            totalRealStates += realStates.length
            realStates.forEach(realState => {
                writeRealStateToFile(csvFile, realState);
            });
            csvFile.end()
            console.log("End of the script. Total real states stored: " + totalRealStates)
        })
    })
});







