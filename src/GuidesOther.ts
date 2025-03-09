// import puppeteer from "puppeteer";

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

// Puppeteerでサポートされている機能について

// WebSocket接続
// WebSocketを使用して既存のブラウザインスタンスへの接続を確立できる
// Node.jsAPIに依存するため、ブラウザを直接起動またはダウンロードすることはサポートされていない

// スクリプト評価
// ブラウザコンテキスト内でJSコードを実行

// ドキュメント操作
// 現在のWebページのPDFとスクリーンショットを生成

// ページ管理
// さまざまなWebページを作成、閉じる、およびページ間を移動する

// Cookie処理
// ブラウザ内でCookieを検査、変更、および管理する

// ネットワーク制御
// ブラウザによって行われたネットワーク要求と監視および傍受する

// // ブラウザでPuppeteerを実行する方法
// // Puppeteerをブラウザで実行するには、まずrollupやwebpackなどのバンドラーを使用してブラウザ互換のビルドを作成する
// // つまり、Puppeteerは通常Node環境で動作するが、ブラウザで動かすにはそのままでは使えない
// // バンドラーを使い、ブラウザで動くJSとして変換する
// // 変換後のスクリプトを<script>タグでブラウザに読み込ませれば、Puppeteerをブラウザで実行できる

// import puppeteer from 'puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser'
// const browser = await puppeteer.connect({
//     browserWSEndpoint: wsUrl,
// });
// alert('Browser has' + (await browser.pages()).length + ' pages');
// browser.discoonect();

// // バンドラーを使用してアプリをビルドする
// // たとえば、ロールアップでは次の構成を使用できる
// // rollup.config.jsでPuppeteerをブラウザようにバンドルさせる設定
// import { nodeResolve } from "@rollup/plugin-node-resolve";

// export default {
//   input: "main.mjs",
//   output: {
//     format: "esm", // 出力フォーマットをESモジュールに設定
//     dir: "out", // ビルド後の出力先ディレクトリ
//   },
//   // WebDriver BiDi プロトコルを使用しない場合、
//   // `chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js` を除外することでバンドルサイズを最小化
//   external: ["chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"],
//   plugins: [
//     nodeResolve({
//       // バンドルのターゲットをブラウザ環境に設定
//       browser: true,
//       // puppeteer-core以外の依存関係を除外
//       // 事前に npm install puppeteer-core を実行してインストールする必要がある
//       resolveOnly: ["puppeteer-core"],
//     }),
//   ],
// };

// // Chrome拡張機能でPuppeteerを実行する
// // 注意！chrome.debuggerでPuppeteerを実行するためのサポートは現在実験段階

// import {
//   connect,
//   ExtensionTransport,
// } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";

// // タブを新規作成するか、接続するタブを探す
// const tab = await chrome.tabs.create({
//   url,
// });

// // ExtensionTransport.connectTabを使用してPuppeteerを接続
// const browser = await connect({
//   transport: await ExtensionTransport.connectTab(tab.id),
// });

// // browser オブジェクトには1つのページのみ存在し、
// // それはtransportしたタブに対応する
// const [page] = await browser.pages();

// // Puppeteerの通常のページ操作を実行
// console.log(await page.evaluate("document.title"));

// // 接続を解除
// browser.discoonect();

// バンドラーを使用して拡張機能をビルドする
// 例）rollupでは次の構成を使用
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "main.mjs",
  output: {
    format: "esm",
    dir: "out",
  },
  // WebDriver Bidi プロトコルを使用しない場合
  // `chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js` を除外することでバンドルサイズを最小化
  external: ["chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"],
  plugin: [
    nodeResolve({
      // ブラウザ環境をターゲットに設定
      browser: true,

      // puppeteer-core 以外の依存関係を除外
      // 必要に応じて npm install puppeteer-core でpuppeteer-coreをインストール
      resolveOnly: ["puppeteer-core"],
    }),
  ],
};
