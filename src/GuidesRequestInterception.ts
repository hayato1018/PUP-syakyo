import puppeteer from "puppeteer";
// リクエストインターセプションを有効にすると、すべてのリクエストが停止する
// ページがネットワークリクエストを送るたびに、Puppeteerがそのリクエストを処理するまで進まない状態になる
// リクエストをcontinueやrespond、abortのいずれかで処理をする
// 画像リクエストをすべてブロックする（abortして、Webページ上の画像は読み込ませない→負荷を軽くできる）
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (interceptedRequest) => {
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    if (
      interceptedRequest.url().endsWith(".png") ||
      interceptedRequest.url().endsWith(".jpg")
    )
      interceptedRequest.abort();
    else interceptedRequest.continue();
  });
  await page.goto("http://example.com");
  await browser.close();
})();

// 複数のインターセプトハンドラーと非同期解決

// デフォルトで、Puppeteerは、request.abort、request.continue、またはrequest.respondのは1回しか呼べない
// 2回目以降は"Request is already handleed"エラーが発生する
// 他のハンドラーがすでに登録している可能性があるため、それを確認する→request.isInterceptResolutionHandled()
// 非同期処理中に他のハンドラーが処理する可能性がある。
// →awaitで待っている間に別のリスナーがリクエストを処理
// →request.isInterceptResolutionHandled()の値は同期的なコード内でしか安全でない。
// →request.isInterceptResolutionHandled()のチェックとabort/continue/respondの呼び出しは必ず同期的に行う

// この最初のハンドラーはリクエストのインターセプトが解決されていないため、request.continueの呼び出しに成功する
page.on("request", (interceptedRequest) => {
  if (interceptedRequest.isInterceptResolutionHandled()) return;
  interceptedRequest.continue();
});
// この 2 番目のハンドラーは、request.continue が最初のハンドラーによってすでに呼び出されているため、request.abort を呼び出す前に戻る
page.on("request", (interceptedRequest) => {
  if (interceptedRequest.isInterceptResolutionHandled()) return;
  interceptedRequest.abort();
});
