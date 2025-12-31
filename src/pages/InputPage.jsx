import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InputPage({ userData, setUserData }) {
  const navigate = useNavigate();
  const [name, setName] = useState(userData.name || '');
  const [birthDate, setBirthDate] = useState(userData.birthDate || '');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }

    if (!birthDate) {
      newErrors.birthDate = '生年月日を選択してください';
    } else {
      const date = new Date(birthDate);
      const today = new Date();
      if (date > today) {
        newErrors.birthDate = '有効な生年月日を入力してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setUserData({
        ...userData,
        name: name.trim(),
        birthDate
      });
      navigate('/diagnosis');
    }
  };

  return (
    <div className="input-page">
      <div className="card input-card fade-in">
        <h2>基本情報を入力</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">お名前</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              style={errors.name ? { borderColor: 'var(--error-color)' } : {}}
            />
            {errors.name && (
              <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">生年月日</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={errors.birthDate ? { borderColor: 'var(--error-color)' } : {}}
            />
            {errors.birthDate && (
              <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors.birthDate}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              style={{ flex: 1 }}
            >
              戻る
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              診断を開始する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputPage;
