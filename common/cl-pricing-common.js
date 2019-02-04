
var debug = false;


var slidersData = new Array();
var scenariosData = new Array();



function cloneSlider(slider) {
	
	var sliderHtml = $("#slider-cloneable").html();
	sliderHtml = sliderHtml.replace(/@SLIDER_NAME@/g, slider.name);
	sliderHtml = sliderHtml.replace(/@SLIDER_LABEL@/g, slider.label);
	
	$("#sliders").append(sliderHtml);

}


function checkDiscount(value, slider) {

	if (slider.discounts == null) return;

	var pct = null;

	for (i = 0; i < slider.discounts.length; i++) {
		var discount = slider.discounts[i];
		if (value > discount.thr) pct = discount.pct;
		else break;
	}
	
	var dscObj = $("#discount-"+slider.name);
	
	if (pct != null) {
		if (dscObj.text() == "") dscObj.effect("highlight", {}, 2000);
		dscObj.text("-"+pct+"%");
	}
	else dscObj.text("");
	
	return pct;

}


function getSliderPrice(sliderName, value) {
	
	var price = value * slidersData[sliderName].price;
	var discount = checkDiscount(value, slidersData[sliderName]);
	
	if (discount != null) price = price - ((price/100)*discount);
	
	return formatCurrency(price);
	
}


function formatCurrency(value) {
	return value.toFixed(2).toString().replace('\.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function evaluateTotalPrice() {
	
	var totalPrice = 0;
	
	$(".slider-value").each(function( index, value ) {
		var price = value.value.toString();
		price = price.replace('\.', '').replace(',', '.');
		totalPrice += Number(price);
	});
	
	$("#totalPrice").val(formatCurrency(totalPrice));
	
}


function initSlider(slider) {
	
}

function updateSlider(slider, value) {
	
}

function createSliders(data) {
	
	$.each( data, function( index, slider ) {
		slidersData[slider.name] = slider;
		cloneSlider(slider);
		initSlider(slider);
	});
	
	evaluateTotalPrice();
	
}

function resetSliders() {
	alert("RESET");
}


function initScenarios() {
	
}

function applyScenario(scenario) {
	if (scenario == null) return;
	$.each( scenario.values, function( index, sliderData ) {
		var slider = slidersData[sliderData.slider];
		if (slider != null) updateSlider(slider, sliderData.value);
		else if (debug) alert("Invalid slider: "+sliderData.slider);
	});
}

function changeScenario() {
	applyScenario(scenariosData[$("#scenarios").val()]);
}

function createScenarios(data) {
	
	var scsObj = $("#scenarios");
	
	$.each( data, function( index, scenario ) {
		scenariosData[scenario.name] = scenario;
		// $('<option>', { value : scenario.name }).text(scenario.label).appendTo('#scenarios');
		scsObj.append($('<option>', { value : scenario.name }).text(scenario.label));
	});
	
	initScenarios();
	applyScenario(scenariosData[scsObj.val()]);
	
}


function loadSlidersData(slidersDataFile) {
	$.getJSON( slidersDataFile, createSliders).fail(function() {
		if (debug) alert( "Error reading Commerce Layer prices" );
	});
}

function loadScenariosData(scenariosDataFile) {
	$.getJSON( scenariosDataFile, createScenarios).fail(function(a, b) {
		if (debug) alert( "Error reading scenarios" );
	});
}


// STARTUP
$(function(){
	loadSlidersData("../data/sliders.json");
	loadScenariosData("../data/scenarios.json");
});