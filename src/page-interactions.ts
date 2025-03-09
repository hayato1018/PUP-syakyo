import puppeteer from "puppeteer";
const browser = await puppeteer.launch();
const page = await browser.newPage();

// ロケーター
// 要素選択に使う。要素選択に関する情報をカプセル化し、Puppeteerが要素のDOM内に存在し、アクションが適用された状態になるまで待機する
// ※page.waitForSelector()などのAPI使用でも問題ない

await page.locator("button").click();

// ロケーターはクリックする前に下記について確認する
// ・要素がビューポート内に存在する
// ・要素が表示されるもしくは非表示になるまで待つ
// ・要素が有効化されるのを待つ

// 入力
await page.locator("input").fill("value");

// 入力タイプを検出し、fill内の値で入力する
// ロケーターはクリックする前に下記について確認する
// ・要素がビューポート内に存在する
// ・要素が表示されるもしくは非表示になるまで待つ
// ・要素が有効化されるのを待つ
// ・連続する2つのアニメーションフレームにわたり、要素が安定した境界ボックスを待機する
// 以降、内容被るため略

// ホバー
await page.locator("div").hover();

//　スクロール
await page.locator("div").scroll({
  scrollLeft: 10,
  scrollTop: 20,
});

// 要素表示を待つ
// 以下.loadingというCSSセレクターを待つ
await page.locator(".loading").wait();

// 関数を待つ
// 関数を条件として待機する
// オブザーバーを使って検出するのを待つやり方
// ※オブザーバーは実際にiframeの描写で使ったやつ、事前にデベロッパーツールで仕掛けとく
await page
  .locator(() => {
    let resolve!: (node: HTMLCanvasElement) => void;
    const promise = new Promise((res) => {
      return (resolve = res);
    });
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.target instanceof HTMLCanvasElement) {
          resolve(record.target);
        }
      }
    });
    observer.observe(document);
    return promise;
  })
  .wait();
