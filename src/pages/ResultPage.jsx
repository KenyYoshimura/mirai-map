import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { animalCareerData, sanmeigakuCareerData, personalityTypeCareerData } from '../data/careerDatabase';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 動物のアイコン
const animalIcons = {
  '猿': '🐵',
  'チータ': '🐆',
  'ライオン': '🦁',
  'トラ': '🐯',
  'コアラ': '🐨',
  'ゾウ': '🐘',
  'ペガサス': '🦄',
  '狼': '🐺',
  'こじか': '🦌',
  '黒ひょう': '🐈‍⬛',
  'ひつじ': '🐑',
  'たぬき': '🦝'
};

function ResultPage({ userData, diagnosisResult }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!diagnosisResult) {
      navigate('/');
    }
  }, [diagnosisResult, navigate]);

  if (!diagnosisResult) {
    return null;
  }

  const { animalResult, sanmeigakuResult, report } = diagnosisResult;
  const animalCareer = animalCareerData[animalResult.animal];
  const sanmeigakuCareer = sanmeigakuCareerData[sanmeigakuResult.mainStar];
  const personalityCareer = personalityTypeCareerData[report.personalityType];

  // レーダーチャートのデータ
  const radarData = {
    labels: [
      '行動実行',
      '対人コミュニケーション',
      '学習成長',
      'モチベーション',
      '感情ストレス管理',
      '意思決定リーダーシップ'
    ],
    datasets: [
      {
        label: 'あなたのスコア',
        data: [
          report.radarChartData['行動実行'],
          report.radarChartData['対人コミュニケーション'],
          report.radarChartData['学習成長'],
          report.radarChartData['モチベーション源泉'],
          report.radarChartData['感情ストレス管理'],
          report.radarChartData['意思決定リーダーシップ']
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          display: false
        },
        pointLabels: {
          font: {
            size: 11,
            family: 'Noto Sans JP'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: true
  };

  // SNSシェア用テキスト生成
  const generateShareText = () => {
    return `【よく当たる行動理論】あなたの未来地図で診断しました！

🎯 本質タイプ: ${animalResult.animal}
⭐ 主星: ${sanmeigakuResult.mainStar}
🧠 特性タイプ: ${report.personalityType}

あなたも診断してみませんか？
#あなたの未来地図 #よく当たる行動理論 #キャリア診断`;
  };

  // Xでシェア
  const shareToX = () => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  // Instagramシェア用（クリップボードにコピー）
  const shareToInstagram = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      alert('シェア用テキストをコピーしました！\nInstagramのストーリーズやフィードに貼り付けてください。');
    });
  };

  const tabs = [
    { id: 'overview', label: '概要' },
    { id: 'strengths', label: '強み・注意点' },
    { id: 'career', label: 'キャリア' },
    { id: 'compatibility', label: '相性' }
  ];

  return (
    <div className="result-page">
      <div className="container">
        {/* ヘッダー */}
        <div className="result-header fade-in">
          <p className="brand-label">よく当たる行動理論</p>
          <h1>{userData.name}さんの未来地図</h1>
          <p>あなただけの診断結果が完成しました</p>
        </div>

        {/* タブナビゲーション */}
        <div className="tab-navigation fade-in">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <>
            {/* メイン診断結果 */}
            <div className="card result-section fade-in">
              <h3>あなたの本質タイプ</h3>
              <div className="animal-result">
                <div className="animal-icon">
                  {animalIcons[animalResult.animal] || '🐾'}
                </div>
                <div className="animal-info">
                  <h4>{animalResult.animal}</h4>
                  <p>{animalResult.personality}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--primary-color)' }}>
                    {animalResult.group}
                  </p>
                </div>
              </div>
            </div>

            {/* 主星 */}
            <div className="card result-section fade-in">
              <h3>あなたの主星</h3>
              <div className="star-result">
                <div className="star-name">{sanmeigakuResult.mainStar}</div>
                <div className="star-keyword">{sanmeigakuResult.mainStarKeyword}</div>
                <p style={{ marginTop: '12px' }}>{sanmeigakuResult.mainStarPersonality}</p>
              </div>
            </div>

            {/* レーダーチャート */}
            <div className="card result-section fade-in">
              <h3>行動特性分析</h3>
              <div className="chart-container">
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div className="category-list" style={{ marginTop: '24px' }}>
                {report.categoryAnalysis.map((item, index) => (
                  <div className="category-item" key={index}>
                    <span className="category-name">{item.category}</span>
                    <span className="category-type">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 特性タイプ */}
            <div className="card result-section fade-in">
              <h3>特性タイプ</h3>
              <div className="personality-type">
                <div className="type-code">{report.personalityType}</div>
                {personalityCareer && (
                  <div className="type-nickname">{personalityCareer.nickname}</div>
                )}
                <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem' }}>
                  {report.personalityTypeAnalysis}
                </p>
              </div>
            </div>
          </>
        )}

        {/* 強み・注意点タブ */}
        {activeTab === 'strengths' && animalCareer && (
          <>
            <div className="card result-section fade-in">
              <h3>✨ {animalCareer.strengths.title}</h3>
              <ul className="advice-list success">
                {animalCareer.strengths.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card result-section fade-in">
              <h3>⚠️ {animalCareer.weaknesses.title}</h3>
              <ul className="advice-list warning">
                {animalCareer.weaknesses.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="advice-box">
                <strong>アドバイス:</strong> {animalCareer.weaknesses.advice}
              </div>
            </div>

            {personalityCareer && (
              <div className="card result-section fade-in">
                <h3>🧠 {report.personalityType}タイプの強み</h3>
                <div className="strength-tags">
                  {personalityCareer.careerStrengths.map((strength, i) => (
                    <span key={i} className="strength-tag">{strength}</span>
                  ))}
                </div>
                <p style={{ marginTop: '16px' }}>{personalityCareer.workAdvice}</p>
              </div>
            )}
          </>
        )}

        {/* キャリアタブ */}
        {activeTab === 'career' && (
          <>
            {animalCareer && (
              <div className="card result-section fade-in">
                <h3>🏢 {animalCareer.idealEnvironment.title}</h3>
                <ul className="advice-list">
                  {animalCareer.idealEnvironment.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {sanmeigakuCareer && (
              <div className="card result-section fade-in">
                <h3>🎯 {sanmeigakuCareer.careerTheme}</h3>
                <p>{sanmeigakuCareer.workStyle}</p>
                <div className="career-roles">
                  <strong>適性のある職種:</strong>
                  <div className="role-tags">
                    {sanmeigakuCareer.idealRoles.map((role, i) => (
                      <span key={i} className="role-tag">{role}</span>
                    ))}
                  </div>
                </div>
                <div className="advice-box" style={{ marginTop: '16px' }}>
                  <strong>成長のヒント:</strong> {sanmeigakuCareer.growthAdvice}
                </div>
              </div>
            )}

            {personalityCareer && (
              <div className="card result-section fade-in">
                <h3>💼 おすすめのキャリア</h3>
                <div className="career-roles">
                  <div className="role-tags">
                    {personalityCareer.idealCareers.map((career, i) => (
                      <span key={i} className="role-tag primary">{career}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 相性タブ */}
        {activeTab === 'compatibility' && animalCareer && (
          <>
            <div className="card result-section fade-in">
              <h3>👔 {animalCareer.compatibleBoss.title}</h3>
              <div className="compatibility-types">
                {animalCareer.compatibleBoss.types.map((type, i) => (
                  <span key={i} className="compat-tag good">
                    {animalIcons[type]} {type}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: '12px' }}>{animalCareer.compatibleBoss.description}</p>
            </div>

            <div className="card result-section fade-in">
              <h3>👥 {animalCareer.compatibleSubordinate.title}</h3>
              <div className="compatibility-types">
                {animalCareer.compatibleSubordinate.types.map((type, i) => (
                  <span key={i} className="compat-tag good">
                    {animalIcons[type]} {type}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: '12px' }}>{animalCareer.compatibleSubordinate.description}</p>
            </div>

            <div className="card result-section fade-in">
              <h3>💡 {animalCareer.avoidTypes.title}</h3>
              <div className="compatibility-types">
                {animalCareer.avoidTypes.types.map((type, i) => (
                  <span key={i} className="compat-tag caution">
                    {animalIcons[type]} {type}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: '12px' }}>{animalCareer.avoidTypes.description}</p>
            </div>
          </>
        )}

        {/* SNSシェア */}
        <div className="card fade-in">
          <div className="share-section">
            <h3 style={{ marginBottom: '16px', color: 'var(--text-color)' }}>診断結果をシェア</h3>
            <p>友達にも診断を勧めてみましょう！</p>
            <div className="share-buttons">
              <button className="share-btn x" onClick={shareToX}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xでシェア
              </button>
              <button className="share-btn instagram" onClick={shareToInstagram}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagramでシェア
              </button>
            </div>
          </div>
        </div>

        {/* トップへ戻る */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
