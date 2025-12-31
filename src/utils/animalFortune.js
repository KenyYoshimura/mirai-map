// 動物占い（60干支）計算ロジック
// 生年月日から60干支を算出し、12動物に紐付ける

// 十干（じっかん）
const TEN_KAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二支（じゅうにし）
const TWELVE_SHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 60干支（六十干支）
const SIXTY_KANSHI = [];
for (let i = 0; i < 60; i++) {
  SIXTY_KANSHI.push(TEN_KAN[i % 10] + TWELVE_SHI[i % 12]);
}

// 12動物とその特徴
const ANIMALS = {
  '猿': { name: '猿', color: 'レッド', group: '地球グループ', personality: '落ち着きのある楽天家' },
  'チータ': { name: 'チータ', color: 'レッド', group: '地球グループ', personality: '超ポジティブな挑戦者' },
  'ライオン': { name: 'ライオン', color: 'レッド', group: '地球グループ', personality: '情熱的なリーダー' },
  'トラ': { name: 'トラ', color: 'ブルー', group: '月グループ', personality: '正義感の強い王者' },
  'コアラ': { name: 'コアラ', color: 'ブルー', group: '月グループ', personality: 'のんびりマイペース' },
  'ゾウ': { name: 'ゾウ', color: 'ブルー', group: '月グループ', personality: '努力家の平和主義者' },
  'ペガサス': { name: 'ペガサス', color: 'グリーン', group: '太陽グループ', personality: '自由奔放な天才肌' },
  '狼': { name: '狼', color: 'グリーン', group: '太陽グループ', personality: '一匹狼の実力者' },
  'こじか': { name: 'こじか', color: 'イエロー', group: '太陽グループ', personality: '甘え上手な警戒心の持ち主' },
  '黒ひょう': { name: '黒ひょう', color: 'イエロー', group: '月グループ', personality: 'プライド高き感情豊か' },
  'ひつじ': { name: 'ひつじ', color: 'イエロー', group: '地球グループ', personality: 'さみしがり屋の世話好き' },
  'たぬき': { name: 'たぬき', color: 'グリーン', group: '地球グループ', personality: '人たらしの社交家' }
};

// 60干支から12動物へのマッピング
const KANSHI_TO_ANIMAL = {
  0: '猿', 1: 'チータ', 2: '黒ひょう', 3: 'ライオン', 4: 'たぬき', 5: 'コアラ',
  6: 'ゾウ', 7: 'ひつじ', 8: 'ペガサス', 9: '狼', 10: 'こじか', 11: 'トラ',
  12: '猿', 13: 'チータ', 14: '黒ひょう', 15: 'ライオン', 16: 'たぬき', 17: 'コアラ',
  18: 'ゾウ', 19: 'ひつじ', 20: 'ペガサス', 21: '狼', 22: 'こじか', 23: 'トラ',
  24: '猿', 25: 'チータ', 26: '黒ひょう', 27: 'ライオン', 28: 'たぬき', 29: 'コアラ',
  30: 'ゾウ', 31: 'ひつじ', 32: 'ペガサス', 33: '狼', 34: 'こじか', 35: 'トラ',
  36: '猿', 37: 'チータ', 38: '黒ひょう', 39: 'ライオン', 40: 'たぬき', 41: 'コアラ',
  42: 'ゾウ', 43: 'ひつじ', 44: 'ペガサス', 45: '狼', 46: 'こじか', 47: 'トラ',
  48: '猿', 49: 'チータ', 50: '黒ひょう', 51: 'ライオン', 52: 'たぬき', 53: 'コアラ',
  54: 'ゾウ', 55: 'ひつじ', 56: 'ペガサス', 57: '狼', 58: 'こじか', 59: 'トラ'
};

// 生年月日から通算日数を計算する補助関数
function getDaysFromBase(year, month, day) {
  // 基準日: 1900年1月31日 = 甲子の日
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate - baseDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// 生年月日から60干支のインデックスを算出
export function calculate60Kanshi(year, month, day) {
  const days = getDaysFromBase(year, month, day);
  // 60で割った余りが干支のインデックス
  let index = days % 60;
  if (index < 0) index += 60;
  return {
    index,
    kanshi: SIXTY_KANSHI[index]
  };
}

// 生年月日から動物占いの結果を取得
export function getAnimalFortune(birthDate) {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const { index, kanshi } = calculate60Kanshi(year, month, day);
  const animalName = KANSHI_TO_ANIMAL[index];
  const animal = ANIMALS[animalName];

  return {
    kanshi,
    kanshiIndex: index,
    animal: animal.name,
    color: animal.color,
    group: animal.group,
    personality: animal.personality,
    description: `あなたは${animal.color}の${animal.name}です。${animal.group}に属し、「${animal.personality}」タイプです。`
  };
}

// 動物の詳細説明を取得
export function getAnimalDescription(animalName) {
  const descriptions = {
    '猿': {
      strengths: ['社交的で人気者', '器用で何でもこなせる', '頭の回転が速い'],
      weaknesses: ['飽きっぽい', '調子に乗りやすい'],
      advice: '継続的な努力を心がけると、より大きな成果を得られます。'
    },
    'チータ': {
      strengths: ['行動力がある', '目標達成への意欲が高い', 'ポジティブ思考'],
      weaknesses: ['せっかち', '計画性に欠ける場合がある'],
      advice: '時には立ち止まって振り返ることで、より確実な成長ができます。'
    },
    'ライオン': {
      strengths: ['リーダーシップがある', '責任感が強い', '堂々としている'],
      weaknesses: ['プライドが高い', '融通が利かない'],
      advice: '周囲の意見にも耳を傾けると、より広い視野が得られます。'
    },
    'トラ': {
      strengths: ['正義感が強い', '面倒見が良い', '決断力がある'],
      weaknesses: ['頑固', '自分のやり方にこだわる'],
      advice: '柔軟性を持つことで、より多くの人と協力できます。'
    },
    'コアラ': {
      strengths: ['穏やかで癒し系', 'マイペース', '平和主義'],
      weaknesses: ['優柔不断', '動きが遅い'],
      advice: '時には積極的に動くことで、新しいチャンスを掴めます。'
    },
    'ゾウ': {
      strengths: ['努力家', '誠実', '信頼される'],
      weaknesses: ['融通が利きにくい', '変化を好まない'],
      advice: '新しいことにも挑戦すると、更なる成長が期待できます。'
    },
    'ペガサス': {
      strengths: ['独創的', '感性が豊か', '自由な発想'],
      weaknesses: ['気分屋', '束縛を嫌う'],
      advice: 'ルーティンを取り入れることで、才能をより安定して発揮できます。'
    },
    '狼': {
      strengths: ['独立心が強い', '専門性が高い', '一途'],
      weaknesses: ['協調性に欠ける', '孤独になりやすい'],
      advice: '他者との協力関係を築くと、より大きな成果を上げられます。'
    },
    'こじか': {
      strengths: ['純粋', '直感が鋭い', '可愛げがある'],
      weaknesses: ['警戒心が強い', '甘えん坊'],
      advice: '自立心を育てることで、より魅力的な人になれます。'
    },
    '黒ひょう': {
      strengths: ['センスが良い', '感情表現が豊か', '情熱的'],
      weaknesses: ['気分の波がある', 'プライドが高い'],
      advice: '感情をコントロールする術を身につけると、より安定した成果を出せます。'
    },
    'ひつじ': {
      strengths: ['世話好き', 'チームワークを大切にする', '穏やか'],
      weaknesses: ['寂しがり屋', '依存しやすい'],
      advice: '自分の時間も大切にすることで、心のバランスが取れます。'
    },
    'たぬき': {
      strengths: ['社交的', '人たらし', '適応力がある'],
      weaknesses: ['本音が見えにくい', '八方美人'],
      advice: '時には本心を伝えることで、より深い人間関係を築けます。'
    }
  };

  return descriptions[animalName] || null;
}

export { ANIMALS, SIXTY_KANSHI, TEN_KAN, TWELVE_SHI };
