import puppeteer from "puppeteer";
const browser = await puppeteer.launch();

// ネットワークログ
// デフォルトでは、Puppeteerはすべてのネットワーク要求と応答をリッスンし、
// ページにネットワークイベントを発行する

const page = await browser.newPage();
page.on("request", (request) => {
  console.log(request.url());
});

page.on("response", (response) => {
  console.log(response.url());
});
