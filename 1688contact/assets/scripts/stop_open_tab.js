var messageChrome = {"text": "need_validate_code", "time": new Date().getTime()};
console.log(messageChrome.text);
chrome.runtime.sendMessage({greeting: messageChrome}, function (response) {
    console.log(response.farewell);
});

if (window.location.href.indexOf("sec.1688.com/query.htm") > 0) {
    alert("请输入验证码");
} else if(window.location.href.indexOf("login.1688.com/member") > 0){
    alert("请登陆");
}