# 開発ログ - あなたの未来地図

## プロジェクト概要
- **プロジェクト名**: あなたの未来地図
- **ブランド名**: よく当たる行動理論
- **公開URL**: https://mirai-map-kenyyoshimuras-projects.vercel.app
- **GitHub**: https://github.com/KenyYoshimura/mirai-map

---

## 開発タイムライン

### Phase 1: 初期開発

#### 技術スタック選定
- フレームワーク: React 19 + Vite 7
- ルーティング: React Router DOM 7
- チャート: Chart.js 4 + react-chartjs-2
- バックエンド: Express 5（開発用）
- スタイリング: カスタムCSS

#### 実装した機能
1. **本質タイプ診断（12タイプ）**
   - 生年月日から60干支を計算
   - 12の動物タイプにマッピング（猿、チータ、ライオン、トラ、コアラ、ゾウ、ペガサス、狼、こじか、黒ひょう、ひつじ、たぬき）

2. **主星診断（10主星）**
   - 算命学に基づく十大主星の判定
   - 貫索星、石門星、鳳閣星、調舒星、禄存星、司禄星、車騎星、牽牛星、龍高星、玉堂星

3. **行動特性分析（28問）**
   - 6カテゴリの行動スタイル分析
     - 行動実行スタイル
     - 対人コミュニケーション
     - 学習成長スタイル
     - モチベーション源泉
     - 感情ストレス管理
     - 意思決定リーダーシップ
   - 4軸特性タイプ（MBTI類似）
     - E/I（外向/内向）
     - S/N（感覚/直感）
     - T/F（思考/感情）
     - J/P（計画/知覚）

4. **レーダーチャート表示**
   - 6カテゴリのスコアを視覚化

#### ファイル構成
```
mirai-map/
├── package.json
├── vite.config.js
├── index.html
├── server/
│   └── index.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── data/
│   │   └── questions.js
│   ├── utils/
│   │   ├── animalFortune.js
│   │   ├── sanmeigaku.js
│   │   └── scoreCalculator.js
│   └── pages/
│       ├── LandingPage.jsx
│       ├── InputPage.jsx
│       ├── DiagnosisPage.jsx
│       ├── LoadingPage.jsx
│       └── ResultPage.jsx
└── dist/
```

---

### Phase 2: 機能拡張（v2.0.0）

#### 追加機能
1. **キャリアアドバイス**
   - 得意な領域（strengths）
   - 注意が必要な領域（weaknesses）+ アドバイス
   - 理想の職場環境（idealEnvironment）

2. **相性診断**
   - 相性の良い上司タイプ
   - 相性の良い部下タイプ
   - 相性に注意が必要なタイプ

3. **SNSシェア機能**
   - X（Twitter）: Intent URL経由
   - Instagram: クリップボードコピー

4. **結果ページの4タブ構成**
   - 概要タブ
   - 強み・注意点タブ
   - キャリアタブ
   - 相性タブ

#### 追加ファイル
- `src/data/careerDatabase.js` - 全タイプのキャリアデータ
- `SPECIFICATION.md` - 技術仕様書

#### ブランディング変更
- ブランド名を「よく当たる行動理論」に設定
- ランディングページにブランドラベル追加

---

### Phase 3: デプロイ

#### Git設定
```bash
git init
git add .
git commit -m "Initial commit: あなたの未来地図 v2.0.0"
```

#### GitHub
- リポジトリ: https://github.com/KenyYoshimura/mirai-map
- ブランチ: main

#### Vercel
- フレームワーク: Vite（自動検出）
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- 設定ファイル: `vercel.json`

#### 公開URL
**https://mirai-map-kenyyoshimuras-projects.vercel.app**

---

## 技術的なポイント

### 60干支の計算（animalFortune.js）
```javascript
// 基準日: 1900年1月31日
// 通算日数を60で割った余りから干支インデックスを算出
const daysSinceBase = calculateDaysSince(1900, 1, 31, year, month, day);
const kanshiIndex = ((daysSinceBase % 60) + 60) % 60;
```

### 主星の判定（sanmeigaku.js）
```javascript
// 日干と月支の組み合わせから主星を決定
const mainStarTable = {
  // 日干: { 月支: 主星, ... }
};
```

### スコア計算（scoreCalculator.js）
```javascript
// 各カテゴリ4問 × 6カテゴリ = 24問
// 残り4問は4軸特性タイプ判定用
```

---

## 今後の拡張予定

- [ ] PDF出力機能
- [ ] 他者への回答依頼（サーベイ機能）
- [ ] チーム診断機能
- [ ] 診断履歴機能
- [ ] OGP画像生成（SNSシェア用）
- [ ] カスタムドメイン設定

---

## 更新履歴

| 日付 | バージョン | 内容 |
|------|------------|------|
| 2025/01/15 | v1.0.0 | 初期リリース（本質タイプ + 行動特性分析） |
| 2025/01/15 | v2.0.0 | キャリアアドバイス、相性診断、SNSシェア追加 |
| 2025/01/15 | - | Vercelにデプロイ完了 |
