const axios = require('axios');
const RealState = require('./../Models/RealState')

let foxterUrl = "https://www.foxterciaimobiliaria.com.br/api/v4/imoveis";


function createRealState(element) {
    var realState = new RealState();
    realState.Price = Number(element.price.replace(".", ""));
    realState.Area = element.areaPrivate;
    realState.AddressStreet = element.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    realState.AddressStreetNumber = "Not published";
    realState.District = element.district.toLowerCase();
    realState.BedroomQuantity = element.bedrooms;
    realState.Link = "https://www.foxterciaimobiliaria.com.br/imovel/" + element.code;
    realState.Latitude = "Not published";
    realState.Longitude = "Not published";
    realState.Source = 'FOXTER';

    return realState;
  }

const sendFoxterRequest = async () => {
    console.log("Foxter Request started!")
    let urlSegments = "/a-venda"
    urlSegments += "/apartamento-ou-apartamento-garden-ou-casa-residencial-ou-casa-em-condominio-ou-cobertura-ou-fazenda-sitio-chacara-ou-flat-ou-kitnet-jk-studio-ou-loft-ou-terreno-residencial-ou-terreno-em-condominio-residencial"
    urlSegments += "/em-porto-alegre-rs/no-bairro-petropolis/entre-0-e-400000"
    //urlSegments += "/2+quartos"
    
    let currentPage = 0;
    let realStates = []
    while (true) {
        currentPage = currentPage + 1;
        let urlQueryParams = `?page=${currentPage}&pageSize=150&order=relevance`;
        let fullUrl = foxterUrl + urlSegments + urlQueryParams;
        console.log(fullUrl)
        const {data} = await axios.get(fullUrl);
        console.log(data.length)
        console.log("Current page is : "+ currentPage)
        if (data.length === 0) break;
        realStates.push(...data)
    }
    console.log("Count of Real States: " + realStates.length)
    
    var realStatesMapped = realStates.map(createRealState)
    return realStatesMapped;
}

exports.sendFoxterRequest = sendFoxterRequest;