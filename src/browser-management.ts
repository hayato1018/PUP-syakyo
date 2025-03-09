import puppeteer from "puppeteer";

// ブラウザを起動する
// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// ブラウザを閉じる
// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// await browser.close();

// ブラウザ
// const browser = await puppeteer.launch();

// const context = await browser.createBrowserContext();

// const page1 = await context.newPage();
// const page2 = await context.newPage();

// await context.close();

// ブラウザコンテキストの権限を構成する
// const browser = await puppeteer.launch();
// const context = browser.defaultBrowserContext();

// await context.overridePermissions('https://hrml5demo.com', ['geolocation']);

// 実行中ブラウザへの接続
// Puppeteerの外部でブラウザを起動している場合に、connectメソッドを使用して接続できる
// 通常、ブラウザの出力から、ウェブソケットエンドポイントURLを取得できる
// const browser = await puppeteer.connect({
//     browserWSEndpoint: 'ws://127.0.0.1:9222/...',
// })

// const page = await browser.newPage();

// browser.disconnect();
