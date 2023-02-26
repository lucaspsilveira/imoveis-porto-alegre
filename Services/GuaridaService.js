const axios = require('axios');
const RealState = require('./../Models/RealState')

const guaridaUrl = "https://site-api.guarida.com.br/imoveis";

function createRealState(element) {
    var realState = new RealState();
    realState.Price = Number(element.valor_num);
    realState.Area = element.area_privativa_txt;
    realState.AddressStreet = element.endereco.split(',')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    realState.AddressStreetNumber = element.endereco.split(',')[1].toLowerCase();
    realState.District = element.bairro.toLowerCase();
    realState.BedroomQuantity = element.quartos;
    realState.Link = "https://www.guarida.com.br" + element.url;
    realState.Latitude = element.latitude;
    realState.Longitude = element.longitude;
    realState.Source = 'GUARIDA';

    return realState;
  }

const sendGuaridaRequest = async () => {
    console.log("Guarida Request started!")
    let guaridaRequestBody = {negocio:2,order:"relevancia",finalidade:"residencial",cidade:1,estado:1,page:1
    , bairros: [14]
    //, numeroquartos: 2
    , valor: {max: 400000}
    };
    let totalPages = 1;
    let currentPage = 0;
    let realStates = []
    while (currentPage < totalPages) {
        currentPage = currentPage + 1;
        guaridaRequestBody.page = currentPage;
        const {data} = await axios.post(guaridaUrl, guaridaRequestBody);
        console.log("Total itens:" + data.total)
        console.log("Página atual:" + data.paginacao.current)
        console.log("Total pages:" + data.paginacao.pages)
        console.log("Current page is : "+ currentPage)
        totalPages = data.paginacao.pages;
        //totalPages = 2;
        realStates.push(...data.imoveis)
    }
    console.log("Count of Real States: " + realStates.length)
    
    var realStatesMapped = realStates.map(createRealState)
    return realStatesMapped;
}

exports.sendGuaridaRequest = sendGuaridaRequest;