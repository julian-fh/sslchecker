// Init

var tabStates = [];
var currentTab = 0;
var isActive = true;

browser.tabs.onActivated.addListener(onTabSwitched);
browser.browserAction.onClicked.addListener(handleIconClick);

function handleIconClick() {
  isActive = (!isActive);

  if(isActive) {
    browser.browserAction.setIcon({path: "icons/shield_32.png" });
  }
  else {
    browser.browserAction.setIcon({path: "icons/deactivated_32.png" });
    tabStates = [];
  }
}

function setButtonState(state) {
  if (state) {
    browser.browserAction.setIcon({path: "icons/lock_32.png" });
  } else {
    browser.browserAction.setIcon({path: "icons/unlocked_32.png"});
  }

  if (currentTab >= tabStates.length) {
    tabStates.push(state);
  } else {
    tabStates[currentTab] = state;
  }
}


function onTabSwitched(tab) {
  if (!isActive) {
    return;
  }

  var tabID = tab.tabId;

  if (tabID != null) {
      currentTab = tabID;
      var tabState = tabStates[tabID];

      if (tabState == null) {
        browser.browserAction.setIcon({path: "icons/shield_32.png" });
      } else {
        setButtonState(tabState);
      }
  }
}

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
  if (!isActive) {
    console.log("deactivated!!!");
    return target;
  }

  var hostname = getHostname(target.url);
  var sourceHostname = getHostname(target.originUrl);

  if (hostname == "julian-fh.github.io" || sourceHostname == "julian-fh.github.io" || sourceHostname == hostname) {
    console.log("early abort");
    return target;
  }

  console.log(target);

  var res = hostname.split(".");
  var host = res[res.length - 2];
  console.log("Now processing:" + host);

  var xhr = new XMLHttpRequest();
  //xhr.open("GET", "https://www.google.de/?q=" + host, false);

  // <insert request here>
  var googleAPIkey = "";
  xhr.open("GET", "https://www.googleapis.com/customsearch/v1?key=" + googleAPIkey + "&q=" + host + "&cx=010143307677666965821:bxxm3_rqvc4", false);



  xhr.send();

  console.log("request done");

  var result = xhr.responseText;

  if (parseResult(result, target.url)) {

    console.log("success");
    setButtonState(true);

    return target;
  } else {
    console.log("failed");
    setButtonState(false);

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
