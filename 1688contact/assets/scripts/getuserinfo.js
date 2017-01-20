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
var interval;

if (window.location.href.indexOf("sec.1688.com/query.htm") > 0) {
    messageChrome = {"text": "need_validate_code", "time": new Date().getTime()};
    console.log(messageChrome.text);
    chrome.runtime.sendMessage({greeting: messageChrome}, function (response) {
        console.log(response.farewell);
    });
    alert("请输入验证码");
} else if(window.location.href.indexOf("login.1688.com/member") > 0){
    messageChrome = {"text": "need_validate_code", "time": new Date().getTime()};
    console.log(messageChrome.text);
    chrome.runtime.sendMessage({greeting: messageChrome}, function (response) {
        console.log(response.farewell);
    });
    alert("请登陆");
}else{
    interval = setInterval(function () {
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
}