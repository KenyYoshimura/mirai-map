// スコア計算ロジック
// 6カテゴリ + 特性タイプ（4軸）のスコア計算

// カテゴリ定義
export const CATEGORIES = {
  行動実行: {
    name: '行動実行スタイル',
    description: '物事を進める際のアプローチ',
    positiveLabel: '慎重・計画型',
    negativeLabel: '直感・行動型',
    questions: ['Q01', 'Q02', 'Q03', 'Q04']
  },
  対人コミュニケーション: {
    name: '対人コミュニケーションスタイル',
    description: '他者との関わり方',
    positiveLabel: '協調・共感型',
    negativeLabel: '独立・論理型',
    questions: ['Q05', 'Q06', 'Q07', 'Q08']
  },
  学習成長: {
    name: '学習成長スタイル',
    description: '新しい知識・スキルの習得方法',
    positiveLabel: '理論・体系型',
    negativeLabel: '実践・経験型',
    questions: ['Q09', 'Q10', 'Q11', 'Q12']
  },
  モチベーション源泉: {
    name: 'モチベーション源泉',
    description: '行動の原動力',
    positiveLabel: '協調・関係型',
    negativeLabel: '達成・成果型',
    questions: ['Q13', 'Q14', 'Q15', 'Q16']
  },
  感情ストレス管理: {
    name: '感情ストレス管理',
    description: 'ストレスへの対処法',
    positiveLabel: '内省・抑制型',
    negativeLabel: '表出・行動型',
    questions: ['Q17', 'Q18', 'Q19', 'Q20']
  },
  意思決定リーダーシップ: {
    name: '意思決定リーダーシップスタイル',
    description: '決断とリーダーシップのスタイル',
    positiveLabel: '合意形成・協調型',
    negativeLabel: '主導・決断型',
    questions: ['Q21', 'Q22', 'Q23', 'Q24']
  }
};

// 特性タイプ（4軸）定義
export const PERSONALITY_AXES = {
  EI: {
    name: 'エネルギーの方向',
    positive: { label: 'I（内向型）', description: '一人の時間でエネルギーを回復' },
    negative: { label: 'E（外向型）', description: '人との交流でエネルギーを得る' },
    question: 'Q25'
  },
  SN: {
    name: '情報の取り入れ方',
    positive: { label: 'S（感覚型）', description: '具体的な事実や詳細を重視' },
    negative: { label: 'N（直感型）', description: '抽象的な概念や可能性を重視' },
    question: 'Q26'
  },
  TF: {
    name: '意思決定の仕方',
    positive: { label: 'T（思考型）', description: '論理的な分析で判断' },
    negative: { label: 'F（感情型）', description: '感情や価値観で判断' },
    question: 'Q27'
  },
  JP: {
    name: '外界への接し方',
    positive: { label: 'J（計画型）', description: '計画的に物事を進める' },
    negative: { label: 'P（知覚型）', description: '柔軟に状況に対応する' },
    question: 'Q28'
  }
};

// 回答からスコアを計算
export function calculateScores(answers) {
  // カテゴリスコアの初期化
  const categoryScores = {
    行動実行: 0,
    対人コミュニケーション: 0,
    学習成長: 0,
    モチベーション源泉: 0,
    感情ストレス管理: 0,
    意思決定リーダーシップ: 0
  };

  // 特性タイプスコアの初期化
  const personalityScores = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  // 各回答のスコアを合算
  Object.entries(answers).forEach(([questionId, selectedOption]) => {
    if (selectedOption && selectedOption.scores) {
      Object.entries(selectedOption.scores).forEach(([scoreKey, value]) => {
        if (categoryScores.hasOwnProperty(scoreKey)) {
          categoryScores[scoreKey] += value;
        } else if (scoreKey.startsWith('特性')) {
          const axis = scoreKey.replace('特性', '');
          if (personalityScores.hasOwnProperty(axis)) {
            personalityScores[axis] += value;
          }
        }
      });
    }
  });

  return { categoryScores, personalityScores };
}

// スコアをパーセンテージに変換（レーダーチャート用）
export function normalizeScores(categoryScores) {
  // 各カテゴリの最大スコアは ±8（4問 × ±2）
  const maxScore = 8;

  const normalized = {};
  Object.entries(categoryScores).forEach(([category, score]) => {
    // -8 to +8 を 0 to 100 に変換
    normalized[category] = Math.round(((score + maxScore) / (maxScore * 2)) * 100);
  });

  return normalized;
}

// 特性タイプの判定
export function determinePersonalityType(personalityScores) {
  const type = {
    EI: personalityScores.EI >= 0 ? 'I' : 'E',
    SN: personalityScores.SN >= 0 ? 'S' : 'N',
    TF: personalityScores.TF >= 0 ? 'T' : 'F',
    JP: personalityScores.JP >= 0 ? 'J' : 'P'
  };

  return {
    type: type.EI + type.SN + type.TF + type.JP,
    details: type,
    scores: personalityScores
  };
}

// カテゴリごとのタイプを判定
export function determineCategoryTypes(categoryScores) {
  const types = {};

  Object.entries(categoryScores).forEach(([category, score]) => {
    const categoryInfo = CATEGORIES[category];
    if (categoryInfo) {
      if (score > 2) {
        types[category] = { label: categoryInfo.positiveLabel, strength: 'strong' };
      } else if (score > 0) {
        types[category] = { label: categoryInfo.positiveLabel, strength: 'moderate' };
      } else if (score < -2) {
        types[category] = { label: categoryInfo.negativeLabel, strength: 'strong' };
      } else if (score < 0) {
        types[category] = { label: categoryInfo.negativeLabel, strength: 'moderate' };
      } else {
        types[category] = { label: 'バランス型', strength: 'balanced' };
      }
    }
  });

  return types;
}

// 総合分析レポートを生成
export function generateReport(categoryScores, personalityScores, animalResult, sanmeigakuResult) {
  const normalizedScores = normalizeScores(categoryScores);
  const personalityType = determinePersonalityType(personalityScores);
  const categoryTypes = determineCategoryTypes(categoryScores);

  // 強みと改善点を分析
  const strengths = [];
  const improvements = [];

  Object.entries(categoryTypes).forEach(([category, type]) => {
    if (type.strength === 'strong') {
      strengths.push(`${CATEGORIES[category].name}: ${type.label}`);
    }
  });

  // レポート生成
  const report = {
    summary: `あなたは${animalResult.animal}の${animalResult.color}タイプで、算命学では${sanmeigakuResult.mainStar}を持つ方です。`,

    animalAnalysis: animalResult.description,

    sanmeigakuAnalysis: sanmeigakuResult.description,

    personalityTypeAnalysis: `あなたの特性タイプは「${personalityType.type}」です。` +
      `エネルギーは${personalityType.details.EI === 'I' ? '内向的' : '外向的'}、` +
      `情報収集は${personalityType.details.SN === 'S' ? '感覚的' : '直感的'}、` +
      `判断は${personalityType.details.TF === 'T' ? '論理的' : '感情的'}、` +
      `行動スタイルは${personalityType.details.JP === 'J' ? '計画的' : '柔軟'}です。`,

    categoryAnalysis: Object.entries(categoryTypes).map(([category, type]) => ({
      category: CATEGORIES[category].name,
      type: type.label,
      strength: type.strength,
      description: CATEGORIES[category].description
    })),

    strengths: strengths.length > 0 ? strengths : ['バランスの取れた特性を持っています'],

    radarChartData: normalizedScores,

    personalityType: personalityType.type,

    fullAnalysis: generateFullAnalysis(categoryTypes, personalityType, animalResult, sanmeigakuResult)
  };

  return report;
}

// 詳細な総合分析を生成
function generateFullAnalysis(categoryTypes, personalityType, animalResult, sanmeigakuResult) {
  let analysis = '';

  // 導入
  analysis += `【あなたの総合分析】\n\n`;

  // 動物占いからの分析
  analysis += `■ 本質的な性格（動物占い）\n`;
  analysis += `${animalResult.personality}であるあなたは、${animalResult.group}に属しています。`;
  analysis += `基本的に${animalResult.color}カラーの特徴である`;
  if (animalResult.color === 'レッド') {
    analysis += `情熱的でエネルギッシュな面`;
  } else if (animalResult.color === 'ブルー') {
    analysis += `冷静で分析的な面`;
  } else if (animalResult.color === 'グリーン') {
    analysis += `自由で独創的な面`;
  } else {
    analysis += `協調的で調和を大切にする面`;
  }
  analysis += `を持っています。\n\n`;

  // 算命学からの分析
  analysis += `■ 宿命と使命（算命学）\n`;
  analysis += `${sanmeigakuResult.mainStar}を持つあなたは、「${sanmeigakuResult.mainStarKeyword}」がテーマです。`;
  analysis += `${sanmeigakuResult.mainStarPersonality}\n`;
  analysis += `適性のある分野: ${sanmeigakuResult.mainStarCareer}\n\n`;

  // 特性タイプからの分析
  analysis += `■ 行動特性（特性タイプ: ${personalityType.type}）\n`;
  analysis += `あなたは`;
  if (personalityType.details.EI === 'I') {
    analysis += `一人の時間を大切にし、深く考えることを好みます。`;
  } else {
    analysis += `人との交流からエネルギーを得て、活発にコミュニケーションを取ります。`;
  }
  if (personalityType.details.SN === 'S') {
    analysis += `具体的な事実や現実を重視し、実践的なアプローチを好みます。`;
  } else {
    analysis += `抽象的な概念や未来の可能性に興味を持ち、革新的なアイデアを生み出します。`;
  }
  analysis += `\n\n`;

  // 6カテゴリからの分析
  analysis += `■ 詳細な行動パターン\n`;
  Object.entries(categoryTypes).forEach(([category, type]) => {
    analysis += `・${CATEGORIES[category].name}: ${type.label}\n`;
  });

  return analysis;
}

export default {
  calculateScores,
  normalizeScores,
  determinePersonalityType,
  determineCategoryTypes,
  generateReport,
  CATEGORIES,
  PERSONALITY_AXES
};
