/**
 * Created by leiguorui on 2017/1/19.
 */

var counter = 0;
var urls = [];
var interval;
var aList = $("a.list-item-title-text");

aList.each(function (index, entry) {
    urls.push($(entry).attr("href").split("?")[0] + "/page/contactinfo.htm");
});

console.log(urls);

interval = setInterval(function () {

    window.open(urls[counter], '_blank');

    counter++;
    if (counter === urls.length) {
        clearInterval(interval);
        alert("这个页面的联系人已经抓取完成");
    }
}, 5000);


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");

        console.log(request.greeting);

        if ("need_validate_code" == request.greeting) {
            clearInterval(interval);
        } else if ("continue_scan" == request.greeting) {
            interval = setInterval(function () {

                window.open(urls[counter], '_blank');

                counter++;
                if (counter === urls.length) {
                    clearInterval(interval);
                    alert("这个页面的公司联系人已经抓取完成");
                }
            }, 5000);
        }
    });