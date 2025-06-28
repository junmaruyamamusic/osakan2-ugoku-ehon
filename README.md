# わくわくえほんパラダイス (Wakuwaku Ehon Paradise)

かわいいイラストとアニメーションで、子どもが主人公の絵本を手軽に作成できるWebアプリです。写真をアップロードすると、その子が物語に登場するオリジナル絵本を楽しめます。

## 機能

### 🎨 主な機能
- **絵本の自動生成**: 子どもの名前を入力するだけで、オリジナルの物語を生成
- **写真アップロード**: 子どもと保護者の写真をアップロード（将来的にAI画像合成に使用）
- **アニメーション**: 6種類の美しいページ遷移アニメーション
  - フェードイン/アウト
- スライド（左右）
  - バウンス
  - ズーム
  - フロート
- **レスポンシブデザイン**: スマホ・タブレット・デスクトップに対応
- **プログレス表示**: 物語生成の進捗をリアルタイムで表示

### 🎯 対象ユーザー
- 3〜6歳の子どもとその保護者
- スマホまたはタブレットでの閲覧が中心

## 技術スタック

### フロントエンド
- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Framer Motion** - アニメーション
- **Zustand** - 状態管理
- **React Dropzone** - ファイルアップロード
- **Radix UI** - アクセシブルなUI コンポーネント
- **Lucide React** - アイコン

### 開発・デプロイ
- **Vercel** - デプロイメント
- **ESLint** - コード品質
- **Turbopack** - 高速ビルド

## セットアップ

### 前提条件
- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd ugoku-ehon-app

# 依存関係をインストール
npm install

# API キーの設定
プロジェクトルートに `.env` ファイルを作成し、以下のように API キーを設定します。

echo "OPENAI_API_KEY=your_api_key_here" > .env

# 開発サーバーを起動
npm run dev

```

開発サーバーが起動したら、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## プロジェクト構造

```
ugoku-ehon-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # グローバルスタイル
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── page.tsx            # ホームページ
│   ├── components/             # Reactコンポーネント
│   │   ├── ui/                 # 再利用可能なUIコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── progress.tsx
│   │   ├── ImageUpload.tsx     # 画像アップロードコンポーネント
│   │   ├── StoryPage.tsx       # 絵本ページコンポーネント
│   │   └── StoryViewer.tsx     # 絵本ビューアー
│   ├── lib/
│   │   └── utils.ts            # ユーティリティ関数
│   ├── store/
│   │   └── useStore.ts         # Zustand ストア
│   └── types/
│       └── index.ts            # TypeScript型定義
├── public/                     # 静的ファイル
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 使用方法

### 1. 絵本作成
1. ホーム画面で「絵本を作る」ボタンをクリック
2. 子どもの名前を入力（必須）
3. 保護者の名前を入力（任意）
4. 子どもの写真をアップロード（任意）
5. 保護者の写真をアップロード（任意）
6. 「絵本を生成する」ボタンをクリック

### 2. 絵本閲覧
- 生成された絵本は自動的に表示されます
- 「前へ」「次へ」ボタンでページを移動
- キーボードの矢印キー（←→）でも操作可能
- プログレスバーで現在の進捗を確認
- 「ホーム」ボタンで最初の画面に戻る

## カスタマイズ

### アニメーションの追加
`src/components/StoryPage.tsx` の `animationVariants` オブジェクトに新しいアニメーションを追加できます。

### スタイルの変更
- `src/app/globals.css` でグローバルスタイルを編集
- `tailwind.config.ts` でTailwindの設定をカスタマイズ

### 物語テンプレートの追加
`src/app/page.tsx` の `generateSampleStory` 関数で物語のテンプレートを編集できます。

## 今後の拡張予定

### AI統合
- **OpenAI GPT-4**: 物語の自動生成
- **Stable Diffusion**: イラストの自動生成
- **顔合成技術**: アップロードした写真をキャラクターに合成

### 機能追加
- 物語の保存・管理
- 複数の物語テンプレート
- 音声読み上げ機能
- ソーシャル共有機能
- 印刷機能

### バックエンド
- Firebase または Supabase での認証・データベース
- 画像ストレージ（Firebase Storage / Amazon S3）
- AI API との連携

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 貢献

プルリクエストや Issue の報告を歓迎します。大きな変更を行う前に、まず Issue を作成して議論することをお勧めします。

## サポート

質問や問題がある場合は、GitHub の Issue を作成してください。
