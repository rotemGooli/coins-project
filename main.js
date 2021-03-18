/// <reference path="jquery-3.5.1.js" />

"use strict";

$(document).ready(function () {

    let arrCoin = [];
    let arrLiveReports = [];
    let arrIdToggleLive = [];
    let stopIntervalId = setInterval(() => { });
    
// function to load 
    function loadPages(page) {
        
        waitLoad("contentContainer");
        clearInterval(stopIntervalId);

        $.ajax(
            {
                type: "GET",
                url: `${page}.html`,

                success: function (result) {
                
                    $("#contentContainer").html(result);
                    $("#searchInput").val("");
                },

                error: error => alert(error.status),

                complete: function () {
                
                    if (page === "homePage") {
                        contentHomePage();
                    }

                    if (page === "liveReport") {
                        contentLiveReport();
                    }

                    if (page === "aboutPage") {
                        contentAbout();
                    }

                }
            }
        )

    }
    // function to load the homePage to appear first. // 
    loadPages("homePage");

    function contentHomePage() {
     
        $.ajax(
            {
                type: "GET",
                url: "https://api.coingecko.com/api/v3/coins/list",

                success: function (result) {
                    arrCoin = result;
                },
                error: error => alert(error.status),
                complete: function () {
             
                    for (let i = 1; i < 101; i++) {
                        createCard("contentHomePage", arrCoin[i].symbol, arrCoin[i].name, arrCoin[i].id);
                    }

                    moreInfoBtnEvent();
                    checkToggle();
                }

            }
        )
    }

    // function to make the content of the live reports and push it to the canvas // 

    function contentLiveReport() {

        if (arrLiveReports.length === 0) {
            $("#contentLiveReportPage").html(`<div class="liveReportMsg"> You must select at least one coin to receive Live Report. </div>`);
        }

        else {

            $("#contentLiveReportPage").html(` <div id="chartContainer" style="height: 300px; width: 100%;"></div>`);
            waitLoad("chartContainer");
            let arrCoinLive1 = [];
            let arrCoinLive2 = [];
            let arrCoinLive3 = [];
            let arrCoinLive4 = [];
            let arrCoinLive5 = [];
            let arrCoinNameLive = [];

            function getData() {
                
                $.ajax({

                    type: "GET",
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${arrLiveReports[0]},${arrLiveReports[1]},${arrLiveReports[2]},${arrLiveReports[3]},${arrLiveReports[4]}&tsyms=USD`,

                    success: function (result) {

                        let dateNow = new Date();
                        let counter = 1;
                        arrCoinNameLive = [];

                        for (let key in result) {

                            if (counter === 1) {
                                arrCoinLive1.push({ x: dateNow, y: result[key].USD });
                                arrCoinNameLive.push(key);
                            }

                            if (counter === 2) {
                                arrCoinLive2.push({ x: dateNow, y: result[key].USD });
                                arrCoinNameLive.push(key);
                            }

                            if (counter === 3) {
                                arrCoinLive3.push({ x: dateNow, y: result[key].USD });
                                arrCoinNameLive.push(key);
                            }

                            if (counter === 4) {
                                arrCoinLive4.push({ x: dateNow, y: result[key].USD });
                                arrCoinNameLive.push(key);
                            }

                            if (counter === 5) {
                                arrCoinLive5.push({ x: dateNow, y: result[key].USD });
                                arrCoinNameLive.push(key);
                            }

                            counter++;
                        }

                        createGraph();

                    }

                })

            }
            
            stopIntervalId = setInterval(() => {
                getData();
            }, 2000);
            
            // function to create the graph //

            function createGraph() {

               const chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: false,

                    title: {
                        text: "Favorite currencies"
                    },
                    axisX: {
                        valueFormatString: "HH:mm:ss",
                    },
                    axisY: {
                        title: "Coin Value",
                        suffix: "$",
                        titleFontColor: "#4F81BC",
                        lineColor: "#4F81BC",
                        labelFontColor: "#4F81BC",
                        tickColor: "#4F81BC",
                        includeZero: true,
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries,
                    },
                    data: [{
                        type: "spline",
                        name: arrCoinNameLive[0],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive1

                    },
                    {
                        type: "spline",
                        name: arrCoinNameLive[1],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive2

                    },
                    {
                        type: "spline",
                        name: arrCoinNameLive[2],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive3

                    },
                    {
                        type: "spline",
                        name: arrCoinNameLive[3],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive4

                    },
                    {
                        type: "spline",
                        name: arrCoinNameLive[4],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive5

                    }]

                });

                chart.render();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                }

            }

        }

    }


    // function to add content to about section //

    function contentAbout() {

        $("#contentAboutPage").html(`
        
        <div class="row firstDescription">
            <div class="col">
               Welcome to Rotem Gooli Bitcoin Website!
            </div>
        </div>

        <div class="row secDescription">
            <div class="col">
            On my site you can get live report on Bitcoin currencies,
            </div>
        </div>

        <div class="row thirdDescription">
            <div class="col">
            Please feel free to search , look around and learn information about each coin.
            </div>
        </div>

        <div class="row fourthDescription">
            <div class="col">
            Hope you'll enjoy.
            </div>
        </div>

        <div class="row aboutMe">
            <div class="col">Developer : Rotem Gooli , 21 , Rosh Haayin. 
            <hr> <a href="https://github.com/rotemGooli" target="_blank"> My Git-Hub</a></div>
        </div>

        <div class="row">
            <div class="col about"><img class="MyPicture" src="assets/images/me.jpeg"></div>
        </div>
        
        `);
    }

    $("#homePageBtn").on("click", () => {

        loadPages("homePage");

    })

    $("#liveReportBtn").on("click", () => {

        loadPages("liveReport");

    })


    $("#AboutBtn").on("click", () => {

        loadPages("aboutPage");

    })

    $("#searchBtn").on("click", () => {
    
        clearInterval(stopIntervalId);
   
        let valSearch = $("#searchInput").val().toLowerCase();
        let foundCoin;

        for (let i = 1; i < 101; i++) {

            if (valSearch === arrCoin[i].symbol) {
                foundCoin = arrCoin[i];
            }

        }

        if (valSearch === "") {
            loadPages("homePage");
        }

        else {

            if (foundCoin === undefined) {
                const x = document.getElementById("snackCoin");
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }

            else {

                $("#searchInput").val("");
                $("#contentContainer").html(`
                <div class="row">
                     <div id="contentSearchPage" class="col contentSearchPage">
                 </div>
                </div>
                `);

                createCard("contentSearchPage", foundCoin.symbol, foundCoin.name, foundCoin.id);
                moreInfoBtnEvent();
                checkToggle();

            }
        }
    });

   
    function moreInfoBtnEvent() {

        const coll = document.getElementsByClassName("collapsible");
        let i;

        for (i = 0; i < coll.length; i++) {
            
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
               const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }

                else {
                    content.style.maxHeight = 400 + "px";
                    let idCoin = $(this).next().children().attr("id");
                    waitLoad(idCoin);
                    let timeNow = Date.now();
                    let coinBackUp = JSON.parse(localStorage.getItem(idCoin));
                    console.log(coinBackUp);
                    if (coinBackUp !== null && (timeNow - coinBackUp.ajaxTime < 120000)) {
                         
                        contentMoreInfo(idCoin, coinBackUp.image.small, coinBackUp.market_data.current_price.usd, coinBackUp.market_data.current_price.eur, coinBackUp.market_data.current_price.ils);
                    }
                   
                    else {
                        
                        $.ajax({

                            type: "GET",
                            url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,

                            success: function (result) {
                                contentMoreInfo(result.id, result.image.small, result.market_data.current_price.usd, result.market_data.current_price.eur, result.market_data.current_price.ils);
                            },

                            complete: function (result) {
                                result.responseJSON.ajaxTime = Date.now();
                                localStorage.setItem(result.responseJSON.id, JSON.stringify(result.responseJSON));
                            }

                        })

                    }

                }

            });

        }

    }
    

    function contentMoreInfo(idElement, srcImg, priceUsd, priceEur, priceIls) {


        $(`#${idElement}`).html(`
            <div class="row moreInfoCollapse">
                <div class="col"> <img src=${srcImg} /> </div>
            </div>

            <div class="row moreInfoCollapse">
                <div class="col price">Price:</div>
            </div>

            <div class="row moreInfoCollapse">
                <div class="col">USD: ${priceUsd}$</div>
            </div>

            <div class="row moreInfoCollapse">
                <div class="col">EUR: ${priceEur}€</div>
            </div>

            <div class="row moreInfoCollapse">
                <div class="col">ILS: ${priceIls}₪</div>
            </div>
            `);

    }

    // function to create the cards and append them // 

    function createCard(idElement, symbolCoin, nameCoin, idCoin) {

        $(`#${idElement}`).append(`
            <div class="card col" style="width: 19rem;">
                <div class="card-body">
                        <h5 class="card-title">${symbolCoin.toUpperCase()}</h5>
                        <div class="toggleBtn">
                            <label class="switch">
                                <input id="${idCoin}-toggle" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p class="card-text">${nameCoin}</p>
                        <button class="collapsible">More Info...</button>
                        <div class="content">
                            <div id=${idCoin} class="moreInfo"></div> 
                        </div>                                                    
                </div>
            </div>`
        );

        switchToggleEvent(idCoin, symbolCoin);

    }

    function waitLoad(idElement) {
    
        $(`#${idElement}`).html(`
        <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
        `)

    }

    // this function will make you choose only 5 coins , if you click another one a modal will //
    // pop up and force you to switch between 2 coins or cancel the switching. //
    
    function switchToggleEvent(idElement, symbolCoin) {

        $(`#${idElement}-toggle`).on("change", () => {

            let newSymbolCoin = symbolCoin.toUpperCase();
            let indexSymbolCoin = arrLiveReports.indexOf(newSymbolCoin);
            let indexIdToggleLive = arrIdToggleLive.indexOf(`${idElement}-toggle`);

            if (indexSymbolCoin !== -1) {
                arrLiveReports.splice(indexSymbolCoin, 1);
                arrIdToggleLive.splice(indexIdToggleLive, 1);
            }

            else {

                if (arrLiveReports.length < 5) {
                    arrLiveReports.push(newSymbolCoin);
                    arrIdToggleLive.push(`${idElement}-toggle`);
                }

                else {

                    $(`#${idElement}-toggle`).prop('checked', false);


                    $("#modalWindow").html(`
                    
                    <div id="Modal" class="modal">
                        <div class="modal-content">
                            <span id="close" class="close">&times;</span>
                            <div id="coinContent" class="coinContent">
                            <div class="row modalMessage">
                              <div class="col">Unable to add <span class="coinAdd">'${symbolCoin.toUpperCase()}'</span> coin.</div>
                            </div>
                            <div class="row modalMessage">
                              <div class="col">Press on one of selected coins to replace or click the X button to cancel.</div>
                            </div>
                        </div>
                    </div>
                    
                    `)

                    $("#Modal").css("display", "block");

                    $("#close").on("click", () => {
                        $("#Modal").css("display", "none");
                    })

                    let counterId = 1;

                    for (let i = 0; i < arrLiveReports.length; i++) {

                        $("#coinContent").append(`   
                        <div class="row">
                            <div class="card col" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">${arrLiveReports[i]}</h5>
                                    <div class="toggleBtn">
                                        <label class="switch">
                                            <input id="toggle-Chose${counterId}" type="checkbox">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>                                          
                                </div>
                            </div>
                         </div>
                        `);

                        $(`#toggle-Chose${counterId}`).prop('checked', true);

                        $(`#toggle-Chose${counterId}`).on("change", () => {

                            let indexCoinRemove = arrLiveReports.indexOf(arrLiveReports[i]);
                            let ToggleTofalse = arrIdToggleLive[indexCoinRemove];
                            arrLiveReports.splice(indexCoinRemove, 1);
                            arrIdToggleLive.splice(indexCoinRemove, 1);

                            arrLiveReports.push(symbolCoin.toUpperCase());
                            arrIdToggleLive.push(`${idElement}-toggle`);

                            $("#Modal").css("display", "none");
                            $(`#${ToggleTofalse}`).prop('checked', false);
                            checkToggle();
                        })
                        counterId++;
                    }
                }
            }
        })
    }

    function checkToggle() {

        for (let i = 0; i < arrIdToggleLive.length; i++) {

            $(`#${arrIdToggleLive[i]}`).prop('checked', true);   
        }
    }
  

    // When the user scrolls down 500px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            document.getElementById("scrollUpBtn").style.display = "block";
        } else {
            document.getElementById("scrollUpBtn").style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document

    $('#scrollUpBtn').click(function(){
    
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    })
 
});

