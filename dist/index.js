"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
(async () => {
    // ブラウザを起動し、新しい空のページを開く
    const browser = await puppeteer_1.default.launch({
        headless: false,
    });
    const page = await browser.newPage();
    // 指定したURLに移動する
    await page.goto("https://developer.chrome.com/");
    // 画面サイズを設定する
    await page.setViewport({ width: 1080, height: 1024 });
    // 検索ボックスに文字を入力
    await page.type(".devsite-search-field", "automate beyond recorder");
    // 検索結果が表示されるのを待って、最初の結果をクリックする
    const searchResultSelector = ".devsite-result-item-link";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);
    // 一意の文字列を含むタイトル要素を探す
    const textSelector = await page.waitForSelector("text/Customize and automate");
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);
    // 取得したタイトルを出力
    console.log(`このブログ記事のタイトルは "%s"です。`, fullTitle);
    await browser.close();
})();
