var pattern = "https://*.google.de/*";

function redirect(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);
  return {
    redirectUrl: "https://facebook.de"
  };
}


function getHostname(href) {
    var l = document.createElement("a");
    l.href = href.url;
    var hostname = l.hostname;
    var res = hostname.split(".");
    var host = res[res.length - 2];
    
    console.log(host);
}


browser.webRequest.onBeforeRequest.addListener(
  getHostname,
  {urls:[pattern]}
);
