
/// Daysago option

var options = {
    series: [{
        name: "Coin value",
        data: []
    }],
    chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
        },
        toolbar: {
            autoSelected: 'zoom'
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 0.2,
            color: '#000',
            opacity: 0.3
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,
    },
    grid: {
        row: {
            colors: undefined, // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    theme: {
        mode: 'light',
        monochrome: {
            enabled: true,
            color: '#00c9b7' ,
            shadeTo: 'light',
            shadeIntensity: 0.8
        },
    },
    title:{
        style:{
            fontFamily: 'monospace'
        }
    },
    xaxis: {
        type: 'numeric',
        tickAmount: 6,
        decimalsInFloat: 0,
        title: {
            text: 'days ago',
            style:{
                color: '#FFFFFF',
                fontFamily: 'monospace'
            }
        },
        labels: {
            show: true,
            style:{
                fontFamily: 'monospace',
                colors: 'white',
            }
        }
    },
    forecastDataPoints: {
        count: 0,
        fillOpacity: 0.5,
        strokeWidth: undefined,
        dashArray: 4,
    },
    yaxis: {
        type: 'numeric',
        tickAmount: 4,
        decimalsInFloat: 2,
        title: {
            text: 'value in €',
            style:{
                fontFamily: 'monospace',
                color: '#FFFFFF'
            }
        },
        labels:{
            show: true,
            style:{
                fontFamily: 'monospace',
                colors: '#fff'
            }
        },
        tooltip:{
            style:{
                color:'#F86624',
            }
        }
    },
    tooltip:{
        enabled: true,
        fillSeriesColor: false,
        style:{
            fontFamily: 'monospace'
        }
    }
};

var chart = new ApexCharts(document.querySelector("#time-series"), options);
chart.render();

/// Forecasting prediction data sereies option

var options2 = {
    series: [{
        name: "Coin value",
        data: []
    }],
    chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
        },
        toolbar: {
            autoSelected: 'zoom'
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 0.2,
            color: '#000',
            opacity: 0.3
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,
    },
    grid: {
        row: {
            colors: undefined, // takes an array which will be repeated on columns
            opacity: 0.5
        },
    },
    theme: {
        mode: 'light',
        monochrome: {
            enabled: true,
            color: '#00c9b7' ,
            shadeTo: 'light',
            shadeIntensity: 0.8
        },
    },
    title:{
        style:{
            fontFamily: 'monospace'
        }
    },
    xaxis: {
        type: 'datetime',
        tickAmount: 6,
        decimalsInFloat: 0,
        title: {
            text: 'Date',
            style:{
                color: '#FFFFFF',
                fontFamily: 'monospace'
            }
        },
        labels: {
            show: true,
            style:{
                fontFamily: 'monospace',
                colors: 'white',
            }
        }
    },
    forecastDataPoints: {
        count: 7,
        fillOpacity: 0.5,
        strokeWidth: undefined,
        dashArray: 4,
    },
    yaxis: {
        type: 'numeric',
        tickAmount: 4,
        decimalsInFloat: 2,
        title: {
            text: 'value in €',
            style:{
                fontFamily: 'monospace',
                color: '#FFFFFF'
            }
        },
        labels:{
            show: true,
            style:{
                fontFamily: 'monospace',
                colors: '#fff'
            }
        },
        tooltip:{
            style:{
                color:'#F86624',
            }
        }
    },
    tooltip:{
        enabled: true,
        fillSeriesColor: false,
        style:{
            fontFamily: 'monospace'
        }
    }
};

var chart2 = new ApexCharts(document.querySelector("#forecasting-time-series"), options2);
chart2.render();



///// Global Variables

var coin = getUrlParameter('coin');
var coinList = [];
var yValues = [];
var todayPrice = null;

getIdAllCoins(coinList);

urlCheck();





// Function dateByDaysAgo - get date by days ago

function dateByDaysAgo(days){
    let today = new Date();
    today.setDate(today.getDate() + days);
    return today.toJSON().slice(0,10);
}






// Function getUrlParameter: prende get url passato

  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}
  
  
  

// Function urlCheck - controlla se ricevo coin tramite url 

async function urlCheck(){
    if(coin == false){
        console.log('you must insert a coin');
        $(".coin-title").html('INSERT A COIN');
    }else{
        $('#coinDaysAgo').prop('disabled', false);
        $("#coinDaysAgo").val("100").change();
        insertCoinCard(coin); // card1
        await timeSeriesCoin(yValues, coin); // card2  Devo aspettare che questo finisca per visualizzare la lista yValues
        updateChart(100);
        getSeriesResults(100);
    }
}
  
  
  
  // Function insertCoinCard: riempie la prima card

function insertCoinCard(coin){
    var url = "https://api.coingecko.com/api/v3/coins/"+coin;

    const options = {
        method: 'GET',
        url: url
    };

    axios.request(options).then(function (response) {

        $(".coin-title").html(response.data.name.toUpperCase());

        $("#coin-gecko-rank").append(response.data.coingecko_rank);

        $("#coin-id").html(response.data.id);
        $("#coin-symbol").html(response.data.symbol);
        $("#coin-name").html(response.data.name);
        $("#coin-genesis_date").html(response.data.genesis_date);

        $("#coin-ath").html(response.data.market_data.ath.eur + " €");
        $("#coin-atl").html(response.data.market_data.atl.eur + " €");
        $("#coin-current_price").html(response.data.market_data.current_price.eur + " €");
        $("#coin-market_cap_rank").html(response.data.market_cap_rank);
        $("#coin-market_cap").html(response.data.market_data.market_cap.eur + " eur");
        $("#coin-total_volume").html(response.data.market_data.total_volume.eur + " eur");
        $("#coin-high_24h").html(response.data.market_data.high_24h.eur + " €");
        $("#coin-low_24h").html(response.data.market_data.low_24h.eur + " €");
        $("#coin-price_change_24h").html(response.data.market_data.price_change_percentage_24h);
        $("#coin-price_change_1h").html(response.data.market_data.price_change_percentage_1h_in_currency.eur + " eur");

    }).catch(function (error) {
        console.error(error);
    });

}






// Function drawChart: calcola il max=1000 lista dell'andamento 

async function updateChart(daysAgo){
    chart.updateSeries([{
         data: yValues.slice(0, daysAgo)
    }]);
    forecastCoin(daysAgo);
}







// Function freshtimeSeries: refresha la serie tramite selezione della select

function freshtimeSeries(item){
    if($(item).val() != ''){
        updateChart($(item).val()); // card2 - card4
        getSeriesResults($(item).val()); // card3
    }
}





// Function timeSeriesCoin: calcola il max=1000 lista dell'andamento 

async function timeSeriesCoin(yValues, coin){
    $(".coin-time-series").html(coin.toUpperCase() + " TIME SERIES");

    var daysAgo = 1000; // max possible to select

    var url = "https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart";

    const options = {
        method: 'GET',
        url: url,
        params: {
        'vs_currency': 'eur',
        'days': daysAgo,
        'interval': 'daily'
        }
    };

    await axios.request(options).then( await function (response) {
        response.data.prices.forEach(element => {
            yValues.push(element[1]);
        });
        
    todayPrice =  yValues.pop();
    yValues.pop();  // remove todays value
    yValues.reverse(); // prendere i giorni in ordine: ieri - l'altro ieri
    //console.log(yValues);
    });
}




// Function getIdAllCoins: prende tutti gli id dei primi 100 coin di geckocoin

function getIdAllCoins(coinList){
    var url = "https://api.coingecko.com/api/v3/coins/markets";

    const options = {
        method: 'GET',
        url: url,
        params:{
            'vs_currency': 'eur'
        }
    };

    axios.request(options).then(function (response) {

        response.data.forEach(element => {

            //console.log(element.id);
            coinList.push(element.id);
        });

    }).catch(function (error) {
        console.error(error);
    });
}



// Function freshDropdown - inserisce tutti gli id all'interno della dropbox tramite filtro

function freshDropdown(){
    $('#coinListDropdown').empty();

    filter = $('#coinListInput').val();

    if(filter == null || filter == '' || filter == undefined){
        $('#coinListDropdown').append('<li class = "dropdown-item"> insert a coin </li>');
    }
    else{
        dropdownList = coinList.filter(coin => coin.includes(filter));
        console.log(dropdownList);

        for (let i = 0; i < dropdownList.length; i++) {
            $('#coinListDropdown').append('<li class = "dropdown-item to-select-item" onclick="getCoinFromInput(this)">' +   dropdownList[i]  + '</li>');
        }
    } 
}



 // Function getCoinFromInput - carica la pagina se riceve qualcosa tramite input
 
 function getCoinFromInput(item){
    coin = $(item).text();
    $('#coinDaysAgo').prop('disabled', false);
    $("#coinDaysAgo").val("100").change();
    recalculateCoinSelected_Page();
}


// Function recalculateCoinSelected_Page - ricalcolare la pagine tramite input

async function recalculateCoinSelected_Page(){
    insertCoinCard(coin); // card1
    await timeSeriesCoin(yValues, coin); // card2
    updateChart(100);
    getSeriesResults(100);
}




///////////////////////////// Time series calculations


// Function getSeriesResults - calcola mean, max, min dalla serie 

function getSeriesResults(daysAgo){
    seriesValues = yValues.slice(0, daysAgo);

    max = 0;
    min = yValues[0];
    mean = 0;
    total = 0;
    for (let i = 0; i < seriesValues.length; i++) {
       if(seriesValues[i] > max){
           max = seriesValues[i];
       }
       if (seriesValues[i] < min){
           min = seriesValues[i];
       }
       total += seriesValues[i];
    }

    mean = total / seriesValues.length;
    
    $("#series-mean").html(mean + " €");
    $("#series-max").html(max + " €");
    $("#series-low").html(min + " €");
    $("#series-daysAgo").html(seriesValues.length);
}



///////////////////////////// Time series forecatin

async function forecastCoin(daysAgo){

    var bodyFormData = new FormData();

    bodyFormData.append('coin', coin);
    bodyFormData.append('yValues', daysAgo); 

    axios({
        method: "post",
        url: "forecast.html",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {

            list = [];
            prices = yValues.slice(0, daysAgo).reverse();


            for (var i = 0; i < daysAgo; i++) {
                list.push([dateByDaysAgo(i - daysAgo), prices[i]]);
            }

            list.push([dateByDaysAgo(0),todayPrice]);  // il valore di oggi

            for (var i = 0; i < response.data.length; i++) {
                list.push([dateByDaysAgo(i + 1), response.data[i]]);
            }

            chart2.updateSeries([{
                data: list
            }]);


            max = 0;
            min = list[0][1];
            mean = 0;
            total = 0;

            for (var i = 0; i < list.length; i++) {
               if(list[i][1] > max){
                   max = list[i][1];
               }
               if (list[i][1] < min){
                   min = list[i][1];
               }
               total += list[i][1];
            }
        
            mean = total / list.length;

            $('#series-forecast-mean').html(mean + " €");
            $('#series-forecast-min').html(min + " €");
            $('#series-forecast-max').html(max + " €");
            $('#series-forecast-days').html(list.length);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}