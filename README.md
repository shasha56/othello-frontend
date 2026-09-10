# オセロ Web フロントエンド

Next.jsで実装したオセロAI対戦Webアプリのフロントエンド

## デモ
公開URL: [オセロWeb AI対戦](https://othello-frontend-three.vercel.app/othello)

## 概要

ブラウザ上で8×8オセロをプレイできます。
バックエンドAPIと通信し、ユーザーの着手・AIの着手・合法手・勝敗などを表示します。

## 主な機能

- 8×8オセロ盤面の表示
- マスクリックによる着手
- 合法手の表示
- AI着手後の盤面更新
- パス表示
- 勝敗表示
- 黒石・白石の枚数表示
- ゲームのリスタート

## 使用技術

- Next.js
- TypeScript
- React
- Tailwind CSS
- Vercel

## セットアップ

依存関係をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000/othello
```

## バックエンドAPI

このフロントエンドは、別途起動したFastAPIバックエンドと通信します。

開発環境では以下のURLを使用しています。

```text
http://127.0.0.1:8000
```

APIのURLは環境変数 NEXT_PUBLIC_API_URL で設定します。
例:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

## 今後の予定

- UIの改善
- ユーザーごとのゲーム状態管理
- 戦績管理
- ユーザーの先攻・後攻の切り替え