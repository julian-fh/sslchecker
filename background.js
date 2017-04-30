var pattern = "https://*.facebook.com/*";

function redirect(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);
  return {
    redirectUrl: "https://facebook.com"
  };
}


function getHostname(target) {
  var l = document.createElement("a");
  l.href = target;
  return l.hostname;
}


function parseResult(jsonResponse, referenceURL) {
  var response = JSON.parse(jsonResponse);
  console.log(response);
  var items = response.items;
  var i = 0;
  var found = false;

  for (; i < 3; i++) {
    if (getHostname(items[i].link) == getHostname(referenceURL)) {
      found = true;
      console.log("found " + getHostname(referenceURL));
      break;
    }
  }

  return found;
}


function main(target) {
  var hostname = getHostname(target.url)
  var res = hostname.split(".");
  var host = res[res.length - 2];
  console.log(host);

  var xhr = new XMLHttpRequest();
  //xhr.open("GET", "https://www.google.de/?q=" + host, false);

  // <insert request here>

  xhr.send();

  var result = xhr.responseText;
  parseResult(result, target.url);
}


browser.webRequest.onBeforeRequest.addListener(
  main,
  {urls:[pattern], types:["main_frame"]}
);
