
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(element).select();
    document.execCommand("copy");
    $temp.remove();
}

var textCopy = "";
var messageChrome = {};

function getTextByJquery(){

	textCopy = textCopy + $("div.contact-info").find("h4").text() + ",";
	textCopy = textCopy + $("div.contact-info").find("a.membername").parent().text().replace("和我联系","").replace("免费电话","").split(/\s{4}/)[5] + ",";

	var phoneNumber = $($("div.contcat-desc").find("dl:contains('话')")).find("dd").text().replace(/\s\s+/g, ' / ');
	phoneNumber = phoneNumber.substring(0, phoneNumber.length - 2);

	textCopy = textCopy + phoneNumber;

	textCopy = textCopy;

	messageChrome = {"text" : textCopy , "time":new Date().getTime()};

	console.log(textCopy);

}

var counter = 0;
var urls = [];
var interval;

if(window.location.href.indexOf("1688.com/company/company_search.htm") > 0){

	var aList = $("a.list-item-title-text");

	aList.each(function(index, entry) {
		urls.push($(entry).attr("href").split("?")[0]+"/page/contactinfo.htm");
	});

	console.log(urls);

	interval = setInterval(function(){

		window.open(urls[counter], '_blank');

		console.log(urls);
		counter++;
		if(counter === aList.length) {
			clearInterval(interval);
		}
	}, 5000);
}else{
	interval = setInterval(function(){
		getTextByJquery();

		chrome.runtime.sendMessage({greeting: messageChrome}, function(response) {
			console.log(response.farewell);
			window.close();
		});

		counter++;
		if(counter === 1) {
			clearInterval(interval);
		}
	}, 1000);
}
