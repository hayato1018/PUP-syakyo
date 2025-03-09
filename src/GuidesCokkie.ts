import puppeteer from "puppeteer";

// // ブラウザストレージを直接操作して、事前にCookieを取得、設定、削除する方法を提供する
// // 特定のCookieを保存および復元させたりするのに便利

// // Cookieの取得

// const browser = await puppeteer.launch();
// const page = browser.newPage();

// await page.goto("https://example.com");

// // スクリプト評価でクッキーを設定する（ページやサーバーでも設定が可能）
// await page.evaluate(() => {
//   document.cookie = "myCookie = MyCookieValue";
// });

// console.log(await browser.cookies());

// // Cookie情報をセットする
// // ブラウザストレージに直接Cookieを書き込むことができる
// const browser = await puppeteer.launch();

// // 2つのCookie情報をローカルホストのドメインにセットする
// await browser.setCookie(
//   {
//     name: "cookie1",
//     value: "1",
//     domain: "localhost",
//     path: "/",
//     sameParty: false,
//     expires: -1,
//     httpOnly: false,
//     secure: false,
//     sourceScheme: "NonSecure",
//   },
//   {
//     name: "cookie2",
//     value: "2",
//     domain: "localhost",
//     path: "/",
//     sameParty: false,
//     expires: -1,
//     httpOnly: false,
//     secure: false,
//     sourceScheme: "NonSecure",
//   }
// );

// console.log(await browser.cookies());

// // Cookie情報の削除
// const browser = await puppeteer.launch();

// // ローカルホストドメインのCookie情報を削除
// await browser.deleteCookie(
//   {
//     name: "cookie1",
//     value: "1",
//     domain: "localhost",
//     path: "/",
//     sameParty: false,
//     expires: -1,
//     httpOnly: false,
//     secure: false,
//     sourceScheme: "NonSecure",
//   },
//   {
//     name: "cookie2",
//     value: "2",
//     domain: "localhost",
//     path: "/",
//     sameParty: false,
//     expires: -1,
//     httpOnly: false,
//     secure: false,
//     sourceScheme: "NonSecure",
//   }
// );

// console.log(await browser.cookies());
