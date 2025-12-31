import { useEffect, useState } from 'react';

function LoadingPage() {
  const [message, setMessage] = useState('未来地図を生成中...');

  useEffect(() => {
    const messages = [
      '未来地図を生成中...',
      '動物占いを解析中...',
      '算命学の星を算出中...',
      '行動特性を分析中...',
      'レポートを作成中...'
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-content fade-in">
        <div className="loading-spinner spin"></div>
        <p className="loading-text">{message}</p>
        <p className="loading-subtext">あなただけの診断結果を準備しています</p>
      </div>
    </div>
  );
}

export default LoadingPage;
