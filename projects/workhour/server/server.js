const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 获取项目名称列表
app.get('/api/project-types', (req, res) => {
  try {
    const types = db.prepare('SELECT id, name FROM project_types ORDER BY name').all();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取工作性质列表
app.get('/api/project-natures', (req, res) => {
  try {
    const natures = db.prepare('SELECT id, name FROM project_natures ORDER BY name').all();
    res.json({ success: true, data: natures });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加项目名称
app.post('/api/project-types', (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'ID和名称不能为空' });
    }
    const stmt = db.prepare('INSERT INTO project_types (id, name) VALUES (?, ?)');
    stmt.run(id, name);
    res.json({ success: true, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加工作性质
app.post('/api/project-natures', (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'ID和名称不能为空' });
    }
    const stmt = db.prepare('INSERT INTO project_natures (id, name) VALUES (?, ?)');
    stmt.run(id, name);
    res.json({ success: true, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除项目名称
app.delete('/api/project-types/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM project_types WHERE id = ?');
    stmt.run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除工作性质
app.delete('/api/project-natures/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM project_natures WHERE id = ?');
    stmt.run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新项目名称
app.put('/api/project-types/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: '名称不能为空' });
    }
    const stmt = db.prepare('UPDATE project_types SET name = ? WHERE id = ?');
    stmt.run(name, id);
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新工作性质
app.put('/api/project-natures/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: '名称不能为空' });
    }
    const stmt = db.prepare('UPDATE project_natures SET name = ? WHERE id = ?');
    stmt.run(name, id);
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`数据库服务运行在 http://localhost:${PORT}`);
});
