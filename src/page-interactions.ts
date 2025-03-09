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

// ロケーターにフィルターかける
await page
  .locator("button")
  .filter((button) => button.innerText === "My button")
  .click();

// ロケーターから値を返す
const enabled = await page
  .locator("button")
  .map((button) => !button.disabled)
  .wait();

// ロケーターからElementHandlesを返す
const buttonHandle = await page.locator("button").waitHandle();
await buttonHandle.click();

// ロケーターの設定
await page
  .locator("button")
  .setEnsureElementIsInTheViewport(false) // 要素がビューポートにあるかどうかを強制しない
  .setVisibility(null) // 要素の可視性チェックを無効化
  .setWaitForEnabled(false) // 要素が有効（クリック可能）になるのを待機しない
  .setWaitForStableBoundingBox(false) // 要素の位置が安定するのを待機しない
  .click();

// ロケーターのタイムアウト
await page.locator("button").setTimeout(3000).click();

// ロケータイベントの取得
let willClick = false; // ボタンがクリックされる予定かのフラグ
await page
  .locator("button")
  .on(LocatorEvent.Action, () => {
    // clickなどのアクションが発生する直前に呼び出される
    willClick = true;
  })
  .click();

// waitForSelector
// locatorと比較してローレベルのAPI=手動で管理が必要
// 具体的に、waitForSelectorはDOMに要素が現れるのを待つことができるが、失敗した場合に自動でリトライしてくれない
// ElementHandleを手動で破棄しないとメモリリークの原因になる。

// 指定したURLに移動する
await page.goto("YOUR_SITE");

// ElementHandleへのクエリをセット
const element = await page.waitForSelector("div > .class-name");

// 要素に対する実行
await element?.click();

// ハンドル破棄→メモリ解放
await element?.dispose();

// ブラウザーを閉じる
await browser.close();

// 待たずにクエリ実行する
// 要素がすでにページ上にあることが明確な時にセレクターに一致する要素を見つける方法がある
page.$(); // セレクターに一致する単一の要素を返す
page.$$(); // セレクターに一致するすべての要素を返す
page.$eval(); // セレクターに一致する最初の要素に対して、JS関数を実行した結果を返す
page.$$eval(); // セレクターに一致する各要素に対して、JS関数を実行した結果を返す

// ただし、入力フォームに対して実行する場合、実際は要素が見つからずに何も返ってこない場合がある
// しかもwaitForSelectorと違い、エラーとならないため要注意
// この場合、JSのevaluateメソッドを使う方が確実

// CSS以外のセレクター

// XPathセレクター
// ブラウザネイティブを使用し、Document.evaluate要素を取得する
const element = await page.waitForSelector("::-p-xpath(//h2)");

// テキストセレクター
// 指定されたテキストの「最小」の要素を選択する→「最小」とは最もDOMツリーで深い要素の意味

// 内部テキストとしてCheckoutを持つdiv要素内のボタンをクリックする
await page.locator("div ::p-text(Checkout)").click();

// 検索テキストの一部('Checkout(2items)')の場合は、'(,)'などのCSSセレクター構文をエスケープする必要がある
await page.locator(":scope >>> ::-p-text(Checkout \\(2items\\))").click();

// もしくは、検索テキストの一部である引用符をエスケープする
await page.locator(':scope >>> ::-p-text("He sait: \\"Hello\\""))').click();

// ARIAセレクター
// アクセス可能な名前とロールを使用して要素を見つけるのに使用
await page.locator("::-p-aria(Submit)").click();
await page.locator('::-p-aria([name="Click me"][role="button"])').click();

// ピアスセレクター
// ドキュメント内のシャドウルートで指定されたCSSセレクターに一致する全ての要素を返す
await page.locator("pierce/div").click();
// ディープコンビネーターを使用した/pierceと同じクエリ
await page.locator("& >>> div").click();

// カスタムセレクター
// 独自の擬似要素を追加することもできる
// フレームワークオブジェクトまたはアプリケーションに基づいてカスタムセレクターを作成するのに便利
Puppeteer.registerCustomQueryHandler("react-component", {
  queryOne: (elementOrDocument, selector) => {
    // ダミーの例では querySelector に委任するだけですが、このコールバックはページ コンテキストで実行されるため、
    // React コンポーネントを見つけることができる。
    return elementOrDocument.querySelector(`[id="${CSS.escape(selector)}"]`);
  },
  queryAll: (elementOrDocument, selector) => {
    return elementOrDocument.querySelectorAll(`[id="${CSS.escape(selector)}"]`);
  },
});
//以下のようにセレクターを記述できる
await page.locator("::-p-react-component(MyComponent)").click();
// もしくは他のセレクターを選択
await page.locator(".side-bar ::-p-react-component(MyComponent)").click();
