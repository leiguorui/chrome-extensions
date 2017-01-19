
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(element).select();
  document.execCommand("copy");
  $temp.remove();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
          "from the extension");

      var storeData = {};
      storeData[request.greeting.time]  = request.greeting.text;

      // Save it using the Chrome extension storage API.
      chrome.storage.sync.set(storeData, function() {
        console.log('Settings saved : ' + JSON.stringify(request.greeting));
      });

      sendResponse({farewell:"goodbye"});
    });

$(function(){

  window.onload = function() {
    chrome.storage.sync.get(null, function(items) {
      var allKeys = Object.keys(items);

      $("tbody").empty();

      if(allKeys.length == 0){
        $("tbody").append("<tr><td></td><td>暂时没有数据, 请打开1688网站中的联系人页面</td><td></td></tr>");
      }else{
        allKeys.forEach(function(entry) {
          var value = items[entry].split(",");

          $("tbody").append("<tr><td>"+value[0]+"</td><td>"+value[1]+"</td><td>"+value[2]+"</td></tr>");
        });
      }
    });
  }

  $('a:contains("导出文件")').on('click',function(){

    var args = [$('table'), 'export.csv'];

    exportTableToCSV.apply(this, args);

  });


  $('a:contains("清空数据")').on('click',function(){
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
    alert("数据已经清空");
    window.close();
  });
});

function exportTableToCSV($table, filename) {

  var $rows = $table.find('tr:has(td)'),

  // Temporary delimiter characters unlikely to be typed by keyboard
  // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character

  // actual delimiter characters for CSV format
      colDelim = '","',
      rowDelim = '"\r\n"',

  // Grab text from table into CSV formatted string
      csv = '"' + $rows.map(function(i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function(j, col) {
              var $col = $(col),
                  text = $col.text();

              return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

          }).get().join(tmpRowDelim)
              .split(tmpRowDelim).join(rowDelim)
              .split(tmpColDelim).join(colDelim) + '"';

  // Deliberate 'false', see comment below
  if (false && window.navigator.msSaveBlob) {

    var blob = new Blob([decodeURIComponent(csv)], {
      type: 'text/csv;charset=utf8'
    });

    // Crashes in IE 10, IE 11 and Microsoft Edge
    // See MS Edge Issue #10396033
    // Hence, the deliberate 'false'
    // This is here just for completeness
    // Remove the 'false' at your own risk
    window.navigator.msSaveBlob(blob, filename);

  } else if (window.Blob && window.URL) {
    // HTML5 Blob
    var blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8'
    });
    var csvUrl = URL.createObjectURL(blob);

    $(this)
        .attr({
          'download': filename,
          'href': csvUrl
        });
  } else {
    // Data URI
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    $(this)
        .attr({
          'download': filename,
          'href': csvData,
          'target': '_blank'
        });
  }
}
