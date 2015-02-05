var apiKey = 'insert you key here';
var keyData = '';// 'apiKey=' + apiKey;
var baseUrl = 'https://api.pearson.com/v2/dictionaries/ldoce5';
var dataFmt = '';
var searchUrl = baseUrl + '/entries' + dataFmt;
var debugLog;

function init(){
	$("#results").hide();
	$('#search').click(function(event){
		event.preventDefault();
		doSearch($('#searchText').val());
	});
	debugLog = $('#log');
}

function doSearch(searchFor){
	debugLog.append('Looking up ' + searchFor + ' using  ' + searchUrl + '<br/>');
	// Use double quotation marks to handle words e.g. yes-man
	var data = keyData + '&headword=' + '"' + searchFor + '"';
	$.ajax({
    	type: 'GET',
    	url: searchUrl,
    	data: data,
    	dataType: 'jsonp',
    	jsonp: 'jsonp',
    	success: function(data){
			handleResponse(data);
		},
		error: function(req, err, text ) {
			debugLog.append('Error: ' + status + '(' + text +')<br/>');
		}
	});
	$("#results").hide();
}

function handleResponse(data){
	debugLog.append('Response received <br/>');
	var results = data.results;
	var html = entry(results);
	$('#resultList').html(html);
	$('li>a').click(function(){
		$(this).parent().find("div").toggle();
	});
	$('#resultList > li > div').hide();
	$('#resultList > li:first > div').show();
	$("#results").show();
	debugLog.append('Response processed <br/>');
}

function entry(from){
	var html = '';
	if ($.isArray(from)){
		for (var idx in from){
			html += entry(from[idx]);
		}
	} else {
		debugLog.append("Processing Entry: " + from.headword + '<br/>');
		html += '<li><a>';
		html += from.headword;
		html += '</a><div>';
		if ($(from).hasAttr('multimedia')) {
			html += multimedia(from.multimedia);
		}
		html += '<ol id="sense">';
		html += sense(from.senses);
		html += '</ol>';
		html += '</div></li>\n';
		debugLog.append("<br/>Processed Entry: " + from.headword + '<br/>');
	}
	return html;
}


function multimedia(from){
	debugLog.append('multimedia ');
	var html='';
	if ($.isArray(from)) {
		for (var idx in from){
			html += multimedia(from[idx]);
		}
	} else {
		var mm_href = from['@href'];
		var mm_type = from['@type'];
		if (mm_type =='EXA_PRON'){
			mm_type ='';
	 	}
		switch (mm_type){
			case 'EX_PRON':
				mm_type = '';
				break;
			case 'US_PRON':
				mm_type = 'American pronunciation';
				break;
			case 'GB_PRON':
				mm_type = 'British pronunciation';
				break;
			case 'SOUND_EFFECTS':
				mm_type = 'Sound effect';
				break;
		}
		if (mm_href.match(/\.mp3$/)) {
			html = mm_type + ' <audio controls="controls"> <source src="' + baseUrl + mm_href + '?' + keyData +'" type="audio/mpeg"/> </audio>';
		} else if (mm_type == 'DVD_PICTURES') {
			html = '<img src="' + baseUrl + mm_href + '?' + keyData +'"> </img>';
		}
		html += '<br/>';
	}
	return html;
}


function sense(from){
	debugLog.append('sense ');
	var html='';
	if ($.isArray(from)) {
		for (var idx in from){
			html += sense(from[idx]);
		}
	} else if ($(from).hasAttr('Subsense')) {
		html += sense(from.Subsense);
	} else {
		html += '<li>' + from.definition + '<br/>';
		if ($(from).hasAttr('examples')){
			html += example(from.examples);
		} else if ($(from).hasAttr('LEXUNIT')){
			html += example(from.LEXUNIT);
		}
		html += '</li>';
	}
	return html;
}


function example(from){
	debugLog.append('example ');
	var html ='';
	if ($.isArray(from)){
		for (var idx in from){
			html+= example(from[idx]);
		}
	} else {
		html += '<q>' + text(from) + '</q>';
		if ($(from).hasAttr('multimedia')){
			html += multimedia(from.multimedia);
		}
	}
	return html;
}


function text(from){
	debugLog.append('text ');
	var result = '';
	var text = from.text;
	var nonDv;
	var hasNonDv = $(from).hasAttr('NonDV');
	if ($.isArray(text)){
		for (var idx in text) {
			result += text[idx];
			if (hasNonDv){
				nonDv = from.NonDV[idx];
				if (nonDv != undefined){
					result += nonDv.REFHWD['#text'];
				}
			}
		}
	} else {
		result += text;
		if ($(from).hasAttr('NonDV')){
			result += from.NonDV.REFHWD['#text'];
		} else if ($(from).hasAttr('COLLOINEXA')){
			result += from.COLLOINEXA['#text'];
		}
	}
	return result;
}