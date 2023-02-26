
const axios = require('axios');
const RealState = require('./../Models/RealState')
const auxiliadoraUrl = "https://www3.auxiliadorapredial.com.br/api/v2/imoveis/comprar/busca";

function createRealState(element) {
    var realState = new RealState();
    realState.Price = Number(element.valores.valor);
    realState.Area = element.caracteristicas.area;
    let tipo = element.endereco.tipo.toLowerCase() == "av" ? "avenida" : element.endereco.tipo.toLowerCase();
    realState.AddressStreet = tipo + " " +  element.endereco.rua.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    realState.AddressStreetNumber = element.endereco.numero.replaceAll(",", "/");
    realState.District = element.endereco.bairro.toLowerCase();
    realState.Link = "https://www.auxiliadorapredial.com.br/imovel/venda/" + element.id;
    realState.BedroomQuantity = element.caracteristicas.quartos;
    realState.Latitude = element.endereco.lat;
    realState.Longitude = element.endereco.lng;
    realState.Source = 'AUXILIADORA';
    return realState;
  }

const sendAuxiliadoraRequest = async () => {
    console.log("Auxiliadora Request started!")
    let auxiliadoraRequestBody = {"place":"rs+porto-alegre","tipoGeralImovel":"residencial","bairro":"petropolis","page":1,"order":"Relevância"
    //,"valorMax": 400000
    //, "quartos":2
    }
    let totalPages = 1;
    let currentPage = 0;
    let realStates = []
    while (currentPage < totalPages) {
        currentPage = currentPage + 1;
        auxiliadoraRequestBody.page = currentPage;
        const {data} = await axios.post(auxiliadoraUrl, auxiliadoraRequestBody);
        console.log("Total itens:" + data.totalItems)
        console.log("Total pages:" + data.totalPages)
        console.log("Current page is : "+ currentPage)
        totalPages = data.totalPages;
        //totalPages = 2;
        realStates.push(...data.items)
    }
    console.log("Count of Real States: " + realStates.length)

    realStates = realStates.filter(function( element ) {
        return element.valores !== undefined;
    }).map(createRealState);
    return realStates;
}

exports.sendAuxiliadoraRequest = sendAuxiliadoraRequest;