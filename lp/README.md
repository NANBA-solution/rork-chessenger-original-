# Chessenger 申請用 LP（ランディングページ）

App Store Connect 提出用の静的 Web サイトです。

## ページ構成

| ファイル | 用途 | App Store Connect での設定 |
|---------|------|---------------------------|
| `index.html` | マーケティング LP | **マーケティング URL**（任意） |
| `privacy.html` | プライバシーポリシー | **プライバシーポリシー URL**（必須） |
| `support.html` | サポート・FAQ | **サポート URL** |
| `terms.html` | 利用規約 | 参考（アプリ内と同一内容） |

## 公開方法（GitHub Pages）

1. GitHub リポジトリ → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / **Folder**: `/lp`
4. Save

公開後の URL 例:

- トップ: `https://<username>.github.io/<repo>/`
- プライバシー: `https://<username>.github.io/<repo>/privacy.html`
- サポート: `https://<username>.github.io/<repo>/support.html`

> リポジトリ名が `rork-chessenger` の場合、ルートは `https://<username>.github.io/rork-chessenger/` になります。

## App Store Connect への入力例

| 項目 | URL |
|------|-----|
| プライバシーポリシー URL | `https://<your-domain>/privacy.html` |
| サポート URL | `https://<your-domain>/support.html` |
| マーケティング URL | `https://<your-domain>/` |

## ローカル確認

```bash
cd lp
python3 -m http.server 8080
# http://localhost:8080 をブラウザで開く
```

## 審査用デモアカウント

LP に記載済み（`index.html` / `support.html`）:

- メール: `chessenger.co.ltd@gmail.com`
- パスワード: `chessenger`

App Store Connect の「審査用メモ」にも同内容を記載してください。
