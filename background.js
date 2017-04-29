var pattern = "https://*/*";

function redirect(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);
  return {
    redirectUrl: "https://google.de"
  };
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern]},
  ["blocking"]
);
