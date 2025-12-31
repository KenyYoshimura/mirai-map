// 算命学ロジック
// 生年月日から十干・十二支を導き、主星（胸の星）を特定

// 十干
const TEN_KAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const TEN_KAN_ELEMENTS = {
  '甲': { element: '木', yin_yang: '陽', nature: '大木' },
  '乙': { element: '木', yin_yang: '陰', nature: '草花' },
  '丙': { element: '火', yin_yang: '陽', nature: '太陽' },
  '丁': { element: '火', yin_yang: '陰', nature: '灯火' },
  '戊': { element: '土', yin_yang: '陽', nature: '山岳' },
  '己': { element: '土', yin_yang: '陰', nature: '田園' },
  '庚': { element: '金', yin_yang: '陽', nature: '鉄鉱' },
  '辛': { element: '金', yin_yang: '陰', nature: '宝石' },
  '壬': { element: '水', yin_yang: '陽', nature: '大海' },
  '癸': { element: '水', yin_yang: '陰', nature: '雨露' }
};

// 十二支
const TWELVE_SHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TWELVE_SHI_INFO = {
  '子': { season: '冬', direction: '北', element: '水' },
  '丑': { season: '冬土', direction: '北北東', element: '土' },
  '寅': { season: '春', direction: '東北東', element: '木' },
  '卯': { season: '春', direction: '東', element: '木' },
  '辰': { season: '春土', direction: '東南東', element: '土' },
  '巳': { season: '夏', direction: '南南東', element: '火' },
  '午': { season: '夏', direction: '南', element: '火' },
  '未': { season: '夏土', direction: '南南西', element: '土' },
  '申': { season: '秋', direction: '西南西', element: '金' },
  '酉': { season: '秋', direction: '西', element: '金' },
  '戌': { season: '秋土', direction: '西北西', element: '土' },
  '亥': { season: '冬', direction: '北北西', element: '水' }
};

// 主星（十大主星）
const MAIN_STARS = {
  '貫索星': {
    name: '貫索星',
    element: '木',
    keyword: '守り・自立',
    personality: '自分の世界を大切にし、独立心が強い。責任感があり、信頼される存在。',
    strengths: ['自立心', '責任感', '信頼性'],
    career: '専門職、研究者、職人'
  },
  '石門星': {
    name: '石門星',
    element: '木',
    keyword: '和合・協調',
    personality: '人との和を大切にし、協調性がある。グループの中で力を発揮する。',
    strengths: ['協調性', 'コミュニケーション力', 'チームワーク'],
    career: '営業、HR、コミュニティマネージャー'
  },
  '鳳閣星': {
    name: '鳳閣星',
    element: '火',
    keyword: '遊び・楽観',
    personality: '明るく楽観的。遊び心があり、周囲を楽しませる才能がある。',
    strengths: ['明るさ', '楽観性', 'エンターテイメント性'],
    career: 'クリエイター、エンターテイナー、広報'
  },
  '調舒星': {
    name: '調舒星',
    element: '火',
    keyword: '孤高・芸術',
    personality: '繊細で芸術的センスがある。独自の世界観を持ち、深い思考を好む。',
    strengths: ['芸術的センス', '繊細さ', '独創性'],
    career: 'アーティスト、作家、デザイナー'
  },
  '禄存星': {
    name: '禄存星',
    element: '土',
    keyword: '奉仕・愛情',
    personality: '愛情深く、人のために尽くす。奉仕精神があり、面倒見が良い。',
    strengths: ['奉仕精神', '愛情深さ', '面倒見の良さ'],
    career: '医療、教育、福祉、サービス業'
  },
  '司禄星': {
    name: '司禄星',
    element: '土',
    keyword: '蓄積・堅実',
    personality: '堅実で計画的。コツコツと積み上げていく力がある。',
    strengths: ['堅実さ', '計画性', '忍耐力'],
    career: '会計、事務、経理、管理職'
  },
  '車騎星': {
    name: '車騎星',
    element: '金',
    keyword: '行動・攻撃',
    personality: '行動力があり、目標に向かって突き進む。決断力と実行力に優れる。',
    strengths: ['行動力', '決断力', '実行力'],
    career: '起業家、営業、スポーツ選手'
  },
  '牽牛星': {
    name: '牽牛星',
    element: '金',
    keyword: '名誉・品格',
    personality: '品格があり、リーダーシップを発揮する。名誉を重んじる。',
    strengths: ['リーダーシップ', '品格', '責任感'],
    career: '管理職、政治家、公務員'
  },
  '龍高星': {
    name: '龍高星',
    element: '水',
    keyword: '改革・創造',
    personality: '革新的で創造力がある。既存の枠にとらわれない発想ができる。',
    strengths: ['創造力', '革新性', '探究心'],
    career: '研究者、発明家、コンサルタント'
  },
  '玉堂星': {
    name: '玉堂星',
    element: '水',
    keyword: '習得・伝統',
    personality: '学習能力が高く、知識の習得に長けている。伝統を大切にする。',
    strengths: ['学習能力', '知識欲', '伝統への敬意'],
    career: '教師、学者、伝統芸能'
  }
};

// 年干の算出（1984年を甲子年として計算）
function getYearKanShi(year) {
  // 1984年は甲子年
  const baseYear = 1984;
  let diff = year - baseYear;

  let kanIndex = diff % 10;
  let shiIndex = diff % 12;

  if (kanIndex < 0) kanIndex += 10;
  if (shiIndex < 0) shiIndex += 12;

  return {
    kan: TEN_KAN[kanIndex],
    shi: TWELVE_SHI[shiIndex],
    kanshi: TEN_KAN[kanIndex] + TWELVE_SHI[shiIndex]
  };
}

// 月干の算出
function getMonthKanShi(year, month) {
  // 節入り日を考慮した月の調整
  const adjustedMonth = month;

  // 年干から月干を算出する表
  const yearKan = getYearKanShi(year).kan;
  const yearKanIndex = TEN_KAN.indexOf(yearKan);

  // 月干の算出（年干と月から決定）
  const monthKanBase = (yearKanIndex % 5) * 2;
  const monthKanIndex = (monthKanBase + adjustedMonth - 1) % 10;

  // 月支は固定（寅月=1月〜丑月=12月、但し旧暦基準）
  const monthShiMapping = [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 1月=亥, 2月=子, ...
  const monthShiIndex = monthShiMapping[adjustedMonth - 1];

  return {
    kan: TEN_KAN[monthKanIndex],
    shi: TWELVE_SHI[monthShiIndex],
    kanshi: TEN_KAN[monthKanIndex] + TWELVE_SHI[monthShiIndex]
  };
}

// 日干の算出（基準日からの日数で計算）
function getDayKanShi(year, month, day) {
  // 基準日: 1900年1月31日 = 甲子日
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate - baseDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let kanIndex = diffDays % 10;
  let shiIndex = diffDays % 12;

  if (kanIndex < 0) kanIndex += 10;
  if (shiIndex < 0) shiIndex += 12;

  return {
    kan: TEN_KAN[kanIndex],
    shi: TWELVE_SHI[shiIndex],
    kanshi: TEN_KAN[kanIndex] + TWELVE_SHI[shiIndex]
  };
}

// 日干から主星を算出（簡略版）
function calculateMainStar(dayKan, monthShi) {
  const dayKanIndex = TEN_KAN.indexOf(dayKan);
  const monthShiIndex = TWELVE_SHI.indexOf(monthShi);

  // 十大主星の決定ロジック（簡略化）
  const starMapping = {
    0: '貫索星',  // 甲
    1: '石門星',  // 乙
    2: '鳳閣星',  // 丙
    3: '調舒星',  // 丁
    4: '禄存星',  // 戊
    5: '司禄星',  // 己
    6: '車騎星',  // 庚
    7: '牽牛星',  // 辛
    8: '龍高星',  // 壬
    9: '玉堂星'   // 癸
  };

  // 月支との相互作用を考慮した調整
  const adjustedIndex = (dayKanIndex + Math.floor(monthShiIndex / 3)) % 10;

  return starMapping[adjustedIndex];
}

// メイン関数：算命学の結果を取得
export function getSanmeigakuResult(birthDate) {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearKanShi = getYearKanShi(year);
  const monthKanShi = getMonthKanShi(year, month);
  const dayKanShi = getDayKanShi(year, month, day);

  const mainStarName = calculateMainStar(dayKanShi.kan, monthKanShi.shi);
  const mainStar = MAIN_STARS[mainStarName];

  const dayKanInfo = TEN_KAN_ELEMENTS[dayKanShi.kan];

  return {
    // 基本情報
    yearKanShi: yearKanShi.kanshi,
    monthKanShi: monthKanShi.kanshi,
    dayKanShi: dayKanShi.kanshi,

    // 日干（本質を表す）
    dayKan: dayKanShi.kan,
    dayKanElement: dayKanInfo.element,
    dayKanNature: dayKanInfo.nature,
    dayKanYinYang: dayKanInfo.yin_yang,

    // 主星
    mainStar: mainStar.name,
    mainStarKeyword: mainStar.keyword,
    mainStarPersonality: mainStar.personality,
    mainStarStrengths: mainStar.strengths,
    mainStarCareer: mainStar.career,

    // 説明文
    description: `あなたの日干は「${dayKanShi.kan}」（${dayKanInfo.nature}）で、主星は「${mainStar.name}」です。${mainStar.personality}`
  };
}

// 五行の相性判定
export function getElementCompatibility(element1, element2) {
  const compatibilityMatrix = {
    '木': { '木': '比和', '火': '相生', '土': '相剋', '金': '相剋', '水': '相生' },
    '火': { '木': '相生', '火': '比和', '土': '相生', '金': '相剋', '水': '相剋' },
    '土': { '木': '相剋', '火': '相生', '土': '比和', '金': '相生', '水': '相剋' },
    '金': { '木': '相剋', '火': '相剋', '土': '相生', '金': '比和', '水': '相生' },
    '水': { '木': '相生', '火': '相剋', '土': '相剋', '金': '相生', '水': '比和' }
  };

  return compatibilityMatrix[element1]?.[element2] || '不明';
}

export { MAIN_STARS, TEN_KAN, TWELVE_SHI, TEN_KAN_ELEMENTS, TWELVE_SHI_INFO };
