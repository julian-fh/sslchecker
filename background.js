function getHostname(target) {
  var l = document.createElement("a");
  l.href = target;
  return l.hostname;
}


function areEqualHostnames(h1, h2){
  res1 = getHostname(h1).split(".");
  res2 = getHostname(h2).split(".");

  if (res1[res1.length - 1] == res2[res2.length - 1] && res1[res1.length - 2] == res2[res2.length - 2]){
    return true;
  }

  return false;
}


function parseResult(jsonResponse, referenceURL) {

  console.log(jsonResponse);

  var response = JSON.parse(jsonResponse);
  var items = response.items;
  var i = 0;
  var found = false;

  for (; i < 3; i++) {
    if (areEqualHostnames(items[i].link, referenceURL)) {
      found = true;
      console.log("found " + getHostname(referenceURL));
      break;
    }
  }

  return found;
}


function main(target) {
  var hostname = getHostname(target.url);
  var sourceHostname = getHostname(target.originUrl);

  if (hostname == "julian-fh.github.io" || sourceHostname == "julian-fh.github.io" || sourceHostname == hostname) {
    return target;
  }

  console.log(target);

  var res = hostname.split(".");
  var host = res[res.length - 2];
  console.log("Now processing:" + host);

  var xhr = new XMLHttpRequest();
  //xhr.open("GET", "https://www.google.de/?q=" + host, false);

  // <insert request here>
  

  xhr.send();

  console.log("request done");

  var result = xhr.responseText;
  if (parseResult(result, target.url)) {
    console.log("success");
    browser.browserAction.setPopup({popup: "/popup/locked_pop.html"});
    browser.browserAction.setIcon({path: "icons/lock_32.png" });

    return target;
  } else {
    console.log("failed");
    browser.browserAction.setPopup({popup: "/popup/unlocked_pop.html"});
    browser.browserAction.setIcon({path: "icons/unlocked_32.png"});

    return {
      redirectUrl: "https://julian-fh.github.io/?callback=" + target.url
    };
  }
}


browser.webRequest.onBeforeRequest.addListener(
  main,
  {urls:["<all_urls>"], types:["main_frame"]},
  ["blocking"]
);
