var textCopy = "";
var messageChrome = {};

function getTextByJquery() {

    textCopy = textCopy + $("div.contact-info").find("h4").text() + ",";
    textCopy = textCopy + $("div.contact-info").find("a.membername").parent().text().replace("和我联系", "").replace("免费电话", "").split(/\s{4}/)[5] + ",";

    var phoneNumber = $($("div.contcat-desc").find("dl:contains('话')")).find("dd").text().replace(/\s\s+/g, ' / ');
    phoneNumber = phoneNumber.substring(0, phoneNumber.length - 2);

    textCopy = textCopy + phoneNumber;

    textCopy = textCopy;

    messageChrome = {"text": textCopy, "time": new Date().getTime()};

}

var counter = 0;
var interval = setInterval(function () {
    getTextByJquery();

    chrome.runtime.sendMessage({greeting: messageChrome}, function (response) {
        console.log(response.farewell);
        window.close();
    });

    counter++;
    if (counter === 1) {
        clearInterval(interval);
    }
}, 1000);