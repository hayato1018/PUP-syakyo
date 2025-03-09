import puppeteer, { ElementHandle } from "puppeteer";
const browser = await puppeteer.launch();
const page = await browser.newPage();

/// Configuration
// Puppeteerはデフォルトで特定バージョンのChromeをダウンロードする（npm install puppeteerだと）
// そのため、APIは実行後すぐに動作することが保証されている
// Puppeteerは別のバージョンのChromeまたはChromiumで使用する場合、ブラウザインスタンスを作成する際に実行可能なファイルパスを渡す
// 確かPlaywrightでもそんな感じのことができた。指定するブラウザをファイルパスで指定する。みたいな

// const browser = await puppeteer.launch({executablePath: '/path/to/Chrome'});
// ブラウザのダウンロードファイルを指定する。澤村的にブラウザのダウンロードファイル重たいから私用PCであまりやりたくない

/// デバッグ
// Puppeteerを使用したデバッグは困難な作業になる...？
// PuppeteerはネットワークリクエストやWebAPIなど、ブラウザのコンポーネントに依存するため、考慮すべき問題すべてをデバッグできる方法はない。
// ただし、Puppeteerには考慮すべき問題に対して多少カバーできるデバッグ方法がある

// 一般的に問題として考慮すべきなのは大きく分けて2つ
// 1つはNode.jsで実行されているコード（サーバーコード）と、
// もう1つはブラウザーで実行されているコード（クライアントコード）の2つ

// 各シチュエーションによるデバッグ方法

// Puppeteerのデバッグ
// 1. ヘッドレスをオフにする=ChromおよびChromiumをたちあげる
// よくやるパターン。selectorなどに問題がないか確かめる時につかう
// const browser = await puppeteer.launch({ headless: false });

// 2. slowMoオプション
// 指定されたミリ秒だけPuppeteerの操作を遅くする
// 実際、Puppeteerの実行時はヘッドレスオフでもかなり早く操作が行われるため、この方法は意外と使えると思った
// const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 250, // 250ミリ秒遅く実行される
// })

// クライアントコードのデバック

// 1. console.*出力をキャプチャする。クライアントコードはブラウザーで実行されるため、
// クライアントコードでconsole.*を実行してもNode.jsに直接ログが記録されることはない。
// ただし、ログに記録されたテキストを含むペイロードを返すコンソールイベントをリッスン（page.on）することは可能
page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
await page.evaluate(() => console.log(`url is ${location.href}`));

// 2. ブラウザのデバッガーを使う
// devtoolをtrueにセット
const browser = await puppeteer.launch({ devtools: true });
// デバッグしたいクライアントコード内にデバッガーを追加する
await page.evaluate(() => {
  debugger;
});

// サーバーコードのデバッグ

// 1. Node.jsのデバッガーを使用する（ChromeもしくはChromiumのみ）
// サーバーコードはクライアントコードと混在するため、この方法はブラウザーに依存する
// たとえば、サーバースクリプトでawait page.click()をステップ実行し、ブラウザーでクリックが発生することを確認できる

// ヘッドレスはfalse
// サーバーコードへデバッガーを追加
debugger;
await page.click("a[target=_brank]");
// --inspect-brkオプションでサーバーを起動する
// node --inspect-brk path/to/script.js
