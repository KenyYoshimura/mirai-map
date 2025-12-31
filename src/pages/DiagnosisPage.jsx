import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { getAnimalFortune, getAnimalDescription } from '../utils/animalFortune';
import { getSanmeigakuResult } from '../utils/sanmeigaku';
import { calculateScores, generateReport } from '../utils/scoreCalculator';

function DiagnosisPage({ userData, setUserData, setDiagnosisResult }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(userData.answers || {});
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // 既に回答がある場合は選択状態を復元
    if (answers[currentQuestion.id]) {
      setSelectedOption(answers[currentQuestion.id]);
    } else {
      setSelectedOption(null);
    }
  }, [currentIndex, answers, currentQuestion.id]);

  useEffect(() => {
    // ユーザーデータがない場合は入力ページへ
    if (!userData.name || !userData.birthDate) {
      navigate('/input');
    }
  }, [userData, navigate]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers({
      ...answers,
      [currentQuestion.id]: option
    });
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 診断完了
      completeDiagnosis();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const completeDiagnosis = () => {
    // ローディングページへ遷移
    navigate('/loading');

    // 診断結果を計算
    setTimeout(() => {
      // 動物占い
      const animalResult = getAnimalFortune(userData.birthDate);
      const animalDescription = getAnimalDescription(animalResult.animal);

      // 算命学
      const sanmeigakuResult = getSanmeigakuResult(userData.birthDate);

      // スコア計算
      const { categoryScores, personalityScores } = calculateScores(answers);

      // レポート生成
      const report = generateReport(
        categoryScores,
        personalityScores,
        { ...animalResult, ...animalDescription },
        sanmeigakuResult
      );

      // 結果をセット
      setDiagnosisResult({
        animalResult: { ...animalResult, ...animalDescription },
        sanmeigakuResult,
        categoryScores,
        personalityScores,
        report
      });

      // ユーザーデータを更新
      setUserData({
        ...userData,
        answers
      });

      // 結果ページへ遷移
      navigate('/result');
    }, 2500);
  };

  return (
    <div className="diagnosis-page">
      <div className="container">
        {/* プログレスバー */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="card question-card fade-in" key={currentQuestion.id}>
          <div className="question-number">
            質問 {currentIndex + 1} / {questions.length}
            <span style={{ marginLeft: '12px', color: 'var(--text-light)', fontWeight: 400 }}>
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options">
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                className={`option-btn ${selectedOption?.label === option.label ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span className="option-label">{option.label}</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>

          <div className="navigation">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              前の質問
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              {currentIndex === questions.length - 1 ? '診断結果を見る' : '次の質問'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisPage;
