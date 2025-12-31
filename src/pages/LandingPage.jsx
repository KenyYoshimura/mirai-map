import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content fade-in">
        <p className="brand-label">よく当たる行動理論</p>
        <h1>あなたの未来地図</h1>
        <p className="subtitle">
          独自の行動理論に基づいた<br />
          あなただけのキャリア診断ツール
        </p>

        <div className="features">
          <div className="feature-card">
            <h3>本質タイプ診断</h3>
            <p>生年月日から導き出す12の本質タイプで、あなたの強みと才能を明らかにします。</p>
          </div>
          <div className="feature-card">
            <h3>行動特性分析</h3>
            <p>28問の設問で6つの行動スタイルを科学的に分析。仕事での傾向がわかります。</p>
          </div>
          <div className="feature-card">
            <h3>キャリアアドバイス</h3>
            <p>得意領域・苦手領域から、理想の環境や相性の良い上司・部下まで具体的に提案。</p>
          </div>
        </div>

        <button
          className="btn btn-primary pulse"
          onClick={() => navigate('/input')}
          style={{
            padding: '18px 48px',
            fontSize: '1.125rem',
            background: 'white',
            color: '#6366f1'
          }}
        >
          無料で診断を始める
        </button>

        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          所要時間：約5分 / 10万人以上が診断
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
