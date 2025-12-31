import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for diagnosis results (本番環境ではデータベースを使用)
const diagnosisStorage = new Map();

// 診断結果を保存
app.post('/api/diagnosis', (req, res) => {
  try {
    const { userData, results } = req.body;

    // ユニークIDを生成
    const diagnosisId = `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 保存
    diagnosisStorage.set(diagnosisId, {
      id: diagnosisId,
      createdAt: new Date().toISOString(),
      userData: {
        name: userData.name,
        birthDate: userData.birthDate
      },
      results
    });

    // 24時間後に自動削除（仕様書の要件）
    setTimeout(() => {
      diagnosisStorage.delete(diagnosisId);
      console.log(`Diagnosis ${diagnosisId} deleted after 24 hours`);
    }, 24 * 60 * 60 * 1000);

    res.json({
      success: true,
      diagnosisId,
      resultUrl: `/result/${diagnosisId}`
    });
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    res.status(500).json({ success: false, error: 'Failed to save diagnosis' });
  }
});

// 診断結果を取得
app.get('/api/diagnosis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const diagnosis = diagnosisStorage.get(id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        error: 'Diagnosis not found or expired'
      });
    }

    res.json({
      success: true,
      diagnosis
    });
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch diagnosis' });
  }
});

// 診断結果を削除
app.delete('/api/diagnosis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = diagnosisStorage.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Diagnosis not found'
      });
    }

    res.json({
      success: true,
      message: 'Diagnosis deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting diagnosis:', error);
    res.status(500).json({ success: false, error: 'Failed to delete diagnosis' });
  }
});

// 統計情報（管理用）
app.get('/api/stats', (req, res) => {
  res.json({
    totalDiagnosis: diagnosisStorage.size,
    serverTime: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/diagnosis - Save diagnosis result`);
  console.log(`  GET  /api/diagnosis/:id - Get diagnosis result`);
  console.log(`  DELETE /api/diagnosis/:id - Delete diagnosis result`);
  console.log(`  GET  /api/stats - Get server statistics`);
  console.log(`  GET  /api/health - Health check`);
});

export default app;
