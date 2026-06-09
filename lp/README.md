# Chessenger 申請用 LP（ランディングページ）

App Store Connect 提出用の静的 Web サイトです。

## ページ構成

| ファイル | 用途 | App Store Connect での設定 |
|---------|------|---------------------------|
| `index.html` | マーケティング LP | **マーケティング URL**（任意） |
| `privacy.html` | プライバシーポリシー | **プライバシーポリシー URL**（必須） |
| `support.html` | サポート・FAQ | **サポート URL** |
| `terms.html` | 利用規約 | 参考（アプリ内と同一内容） |

## 公開 URL（Vercel・本番）

| ページ | URL |
|--------|-----|
| トップ | https://lp-five-eta.vercel.app/ |
| プライバシー | https://lp-five-eta.vercel.app/privacy |
| サポート | https://lp-five-eta.vercel.app/support |
| 利用規約 | https://lp-five-eta.vercel.app/terms |

## 再デプロイ（Vercel CLI）

```bash
cd lp
npx vercel deploy --prod
```

Vercel ダッシュボード: https://vercel.com/hiroki-nanba-s-projects/lp

## App Store Connect への入力例

| 項目 | URL |
|------|-----|
| プライバシーポリシー URL | `https://lp-five-eta.vercel.app/privacy` |
| サポート URL | `https://lp-five-eta.vercel.app/support` |
| マーケティング URL | `https://lp-five-eta.vercel.app/` |

## ローカル確認

```bash
cd lp
python3 -m http.server 8080
# http://localhost:8080 をブラウザで開く
```

## 審査用デモアカウント

LP には掲載しません。App Store Connect の「審査用メモ」にのみ記載してください。
