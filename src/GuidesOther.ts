import puppeteer from "puppeteer";

///Screenshots

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://news.ycombinator.com", {
  waitUntil: "netwokidle2",
});
await page.screenshot({
  path: "hn.png",
});

await browser.close();

// ElementHandleをスクショできる（デベロッパーツールで選択した要素のみのスクショとれたやつと同じ）
const fileElement = await page.waitForSelector("div");
await fileElement?.screenshot({
  path: "div.png",
});

/// ページのPDF
await page.goto("https://news.ycombinator.com", {
  waitUntil: "netwokidle2",
});

await page.pdf({
  path: "hn.pdf",
});

await browser.close();

/// Chrome拡張機能
// PuppeteerをChromeの拡張機能テストとして使用

//以下は、ソースが ./my-extension にある拡張機能のバックグラウンド ページへのハンドルを取得するためのコード

// import path from 'path';
//process.cwd() は 現在の作業ディレクトリ（カレントディレクトリの絶対パス）を取得
// path.join() を使って、カレントディレクトリにある my-extension フォルダのフルパスを作成
// const pathToExtension = path.join(process.cwd(), 'my-extension');
//
// args で Chrome の起動オプションを指定
//  --disable-extensions-except=${pathToExtension}
// デフォルトの拡張機能を無効化（ただし my-extension のみ有効）
//  --load-extension=${pathToExtension}
// my-extension を Chrome にロード
//  「指定した拡張機能 my-extension だけを有効化して Chrome を起動する」
// const browser = await puppeteer.launch({
//     args: [
//         `--disable-extensions-except=${pathToExtension}`,
//         `--load-extension=${pathToExtension}`,
//     ],
// });
//
// 拡張機能のバックグラウンドページが読み込まれるのを待機
//  const backgroundPageTarget = await browser.waitForTarget(
//     target => target.type() === 'background_page',
// );
// const backgroundPage = await backgroundPageTarget.page();
// await browser.close();

// import path from 'path';

// const pathToExtension = path.join(process.cwd(), 'my-extension');
// const browser = await puppeteer.launch({
//     args: [
//         `--disable-extensions-except=${pathToExtension}`,
//         `--load-extention=${pathToExtension}`,
//     ],
// });

// const workerTarget = await browser.waitForTarget(
//     // 拡張機能によって作成されたサービスワーカーが1つだけ存在し、
//     // そのURLが"background.js"で終わると仮定する
//     target =>
//         target.type() === 'service_worker' &&
//         target.url().endsWith('background.js'),
// );

// const worker = await workerTarget.worker();

// // ポップアップを開く（Canaryチャンネルで利用可能）
// await worker?.evaluate('chrome.action.openPopip();');

// const popupTarget = await browser.waitForTarget(
//     // 拡張機能によって作成されたポップアップ
//     // そのURLが"popup.html"で終わるページが1つだけ存在すると仮定
//     target => target.type() === 'page' && target.url().endsWith('popup.html'),
// );

// const popupPage = popupTarget.asPage();

// // 通常のページと同様にポップアップページをテストする
// await browser.close();
