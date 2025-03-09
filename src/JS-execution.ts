import puppeteer, { ElementHandle } from "puppeteer";

(async () => {
  // ブラウザ起動
  const browser = await puppeteer.launch();

  // ページ作成
  const page = await browser.newPage();

  // サイト移動
  await page.goto("YOUR_SITE");

  // Evaluate JS
  const three = await page.evaluate(() => {
    return 1 + 2;
  });

  // 関数本体を文字列とすることも可能
  //   const three = await page.evaluate(`1 + 2`);

  // 戻り値
  const body = await page.evaluate(() => {
    return document.body;
  });
  console.log(body);

  const body2 = await page.evaluateHandle(() => {
    return document.body;
  });
  console.log(body2 instanceof ElementHandle);

  // Promiseを返す
  // 評価呼び出しからPromiseを返すと、そのPromiseは自動的に待機される
  await page.evaluate(() => {
    // 100ms待つ
    return new Promise((resolve) => setTimeout(resolve, 100));
  });

  //評価関数に引数を渡す
  const three2 = await page.evaluate(
    (a, b) => {
      return a + b;
    },
    1,
    2
  );

  console.log(three);

  // Close browser
  await browser.close();
})();
