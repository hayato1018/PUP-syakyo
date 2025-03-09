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
// この2番目のハンドラーは、request.continue が最初のハンドラーによってすでに呼び出されているため、request.abort を呼び出す前に戻る
page.on("request", (interceptedRequest) => {
  if (interceptedRequest.isInterceptResolutionHandled()) return;
  interceptedRequest.abort();
});

// 以下は非同期ハンドラが連携して動作する
// 最初のハンドラはリクエストのインターセプションが解決されていないため、request.continueの呼び出しに成功する
page.on("request", (interceptedRequest) => {
  //　この時点ではインターセプトはまだ処理されない。
  if (interceptedRequest.isInterceptResolutionHandled()) return;

  // プロミスを返すことは厳密に必要ではない、ただしハンドラーを待機できる
  return new ptomise((resolve) => {
    // 500ミリ秒後に続行
    setTimeout(() => {
      // 内部でインターセプトがまだ処理されていないことを確認するため、同期的にチェック
      // 他のハンドラーが独自の非同期操作を待機している間に500ミリ秒間で処理された可能性もある
      if (interceptedRequest.isInterceptResolutionHandled()) {
        resolve();
        return;
      }
      interceptedRequest.continue();
      resolve();
    }, 500);
  });
});

// 以下は上記の例をrequest.interceptResolutionStateを使って直したもの
page.on("request", (interceptedRequest) => {
  const { action } = interceptedRequest.interceptResolutionState();
  if (action === InterceptResolutionAction.AlreadyHandled) return;

  return new Promise((resolve) => {
    setTimeout(() => {
      const { action } = interceptedRequest.interceptResolutionState();
      if (action === interceptedResolutionAction.AlreadyHandled) {
        resolve();
        return;
      }
      interceptedRequest.continue();
      resolve();
    }, 500);
  });
});
page.on("request", async (interceptedRequest) => {
  if (
    interceptedRequest.interceptResolutionState().action ===
    InterceptResolutionAction.AlreadyHandled
  )
    return;
  interceptedRequest.continue();
});

// 協調型インターセプトモード
// めっちゃ簡潔にいうと協調型インターセプトモード（Cooperative Intercept Mode）は、
// 複数のハンドラーが登録された場合に、リクエスト処理の順序と優先度を制御する仕組み
//
// request.abort()、request.continue()、request.respond() は、オプションの優先度（priority）を指定することで
// 「協調型インターセプトモード（Cooperative Intercept Mode）」で動作する。
// すべてのハンドラーが協調型インターセプトモードを使用している場合、Puppeteer は 登録順にすべてのインターセプトハンドラーを実行し、
// それらが確実に完了するように保証する。
// 最も優先度の高い（highest-priority）インターセプトの結果が適用される。
//
// ルール
// すべての処理（abort/continue/respond）には数値の優先度を指定しなければならない。
// どれか一つでも優先度を指定しない処理があると「レガシーモード（Legacy Mode）」が有効になり、協調型インターセプトモードは無効になる。
// 非同期ハンドラーは、インターセプトの最終決定が下される前に完了する必要がある。
// 最も高い優先度を持つ処理が「勝者」となり、その処理（abort/respond/continue）が適用される。
// 優先度が同じ場合の処理順
// abort > respond > continue （abort が最優先）
// 標準化された優先度の指定
// 基本的に 0 または DEFAULT_INTERCEPT_RESOLUTION_PRIORITY を指定するのが推奨
// より高い優先度を設定すると、その処理が勝つ
// 負の優先度も使用可能（例：continue({}, 4) は continue({}, -2) より優先される）
// レガシーモードとの互換性
// 優先度を指定しない処理があった場合、すぐにその処理が適用される
// そのため、協調型インターセプトモードを正しく動作させるには、すべての処理で優先度を指定する必要がある
// 他のハンドラーが優先度なしで abort/continue/respond を呼ぶ可能性があるため、
// request.isInterceptResolutionHandled で事前にチェックすることが重要

// 最終結果: 即時にabort()
page.setRequestInterception(true);
page.on("request", (request) => {
  if (request.isInterceptResolutionHandled()) return;
  // レガシーモード：インターセプトは即時に中止
  request.abort("failed");
});
page.on("request", (request) => {
  if (request.isInterceptResolutionHandled()) return;
  // リクエストはレガシーモードですでに注視されているため、制御はここまで到達しない

  // 協調インターセプトモード：優先度0で続行
  request.continue({}, 0);
});

// 以下の例は1つのハンドラーが優先度を指定してないため、レガシーモードが優先される
// 最終結果:即時continue()
page.setRequestInterception(true);
page.on("request", (request) => {
  if (request.isInterceptResolutionHandled()) return;

  // 協調性インターセプトモード:優先度0で中止
  request.abort("failed", 0);
});
page.on("request", (request) => {
  if (request.isInterceptResolutionHandled()) return;

  // リクエストが中止され、解決が延期されたため制御がこの時点に到達

  // {action: InterceptResolutionAction.Abort, priority: 0}、abort@0が現時点で有効であるため
  console.log(request.interceptedResolutionState());

  // レガシーモード: インターセプトは即時に実行
  request.continue({});
});
page.on("request", (request) => {
  // {action: InterceptResolutionAction.AlreadyHandled}、レガシーモードでの続行が呼び出されるため
  console.log(request.interceptResolutionState());
});
