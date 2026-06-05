# Chessenger — GitHub Actions で TestFlight を更新する

デスクトップの **iOS-Git-リリース手順.md** と同じフロー。Expo は CI 内で `expo prebuild` するため、`ios/` をコミットする必要はありません。

## Actions が 8秒で落ちるとき

ログで **Validate secrets** が赤 → 下の Secret が **1つでも欠けている**状態です。  
`git exit code 128` は本体の原因ではないことが多いです。

**登録場所:** リポジトリ → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

## Secrets（6つすべて必須）

| Secret | 内容 |
|--------|------|
| `APPSTORE_ISSUER_ID` | App Store Connect API の Issuer ID |
| `APPSTORE_API_KEY_ID` | API キー ID（**Admin** 必須） |
| `APPSTORE_API_PRIVATE_KEY` | `.p8` の PEM 全文 or base64 1行 |
| `DEVELOPMENT_TEAM` | Apple Team ID |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase URL（本番） |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（本番） |

## アップデート（いつもの手順）

### ビルドだけ上げる（1.0.0 のまま・修正反映）

1. ローカルで動作確認
2. `git commit` → `git push origin main`
3. GitHub → **Actions** → **iOS TestFlight Upload** が緑になるまで待つ
4. [App Store Connect](https://appstoreconnect.apple.com) → **TestFlight** → Processing 完了
5. 審査中なら **同じバージョン** で **新しいビルド** を選び直す

`expo/app.json` の `version` は **変えなくてよい**。ビルド番号は `github.run_number` で自動増加。

### 1.0.0 → 1.1.0 など（ストアのバージョン番号も上げる）

1. `expo/app.json` の `"version": "1.0.0"` を `"1.1.0"` に変更
2. commit → push → Actions 成功を待つ
3. Connect で **新バージョン 1.1.0** を作成 → 新ビルドを紐付け → **審査用に追加**

## 手動でビルドだけ回す

push せずに CI だけ走らせる場合:

GitHub → **Actions** → **iOS TestFlight Upload** → **Run workflow** → branch `main`

## push で CI が走るパス

- `expo/**`
- `.github/workflows/ios-testflight.yml`
- `ci/**`

ルートだけの変更では走りません。アプリ変更は `expo/` 配下に含めてください。

## トラブルシュート

| 症状 | 対処 |
|------|------|
| Cloud signing permission error | API キーを **Admin** に |
| AuthKey invalid | Secret の `.p8` を再登録 |
| Archive **exit 65** / `modulemap not found` / `no such module Expo` | ワークフローは **`.xcworkspace`** で Archive（修正済み）。再 Run workflow |
| `git exit 128` / submodule `rork-chessenger` | 誤って追加したサブモジュールをリポジトリから削除（`.gitignore` 済み） |
| Node.js 20 actions deprecated | `actions/checkout@v6` / `setup-node@v6`（Node 24 ランタイム）を使用 |
| unable to cache dependencies | `expo` に `package-lock.json` が無いため npm キャッシュは無効（`package-manager-cache: false`） |
| altool 90062 / CFBundleShortVersionString | `expo/app.json` の `version` を **App Store 承認済みより大きく**（例: 1.3.0 済みなら 1.4.0）して再ビルド |
| 審査 **crashed on launch** | CI で `expo/.env` を書き込み済みか確認。Actions の **Verify Supabase env in JS bundle** が緑であること |
| prebuild / pod 失敗 | Actions ログの該当ステップを確認 |
| ビルドが Connect に出ない | Processing 5〜30 分待つ |
