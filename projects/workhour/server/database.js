const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'workhour.db');
const db = new Database(dbPath);

// 创建项目名称表
db.exec(`
  CREATE TABLE IF NOT EXISTS project_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 创建工作性质表
db.exec(`
  CREATE TABLE IF NOT EXISTS project_natures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 初始化项目名称数据（如果表为空）
const projectTypesCount = db.prepare('SELECT COUNT(*) as count FROM project_types').get();
if (projectTypesCount.count === 0) {
  const insertProjectType = db.prepare('INSERT INTO project_types (id, name) VALUES (?, ?)');
  const projectTypes = [
    { id: '1931a7d931b170272c132c6480794d78', name: '航道投标' },
    { id: '18d5096a70a4895d196e85948d593c39', name: '阳江闸坡智慧渔港' },
    { id: '19766ca7011a697618ab63e46cface6c', name: '渔港经济区' },
    { id: '197638ddd1664be025af4654ee4913c7', name: 'AI-学习' },
    { id: '19072987378cff59df5c03d47028600d', name: '阳江风电运维基地' },
    { id: '19072bbe83dd3aabbebe92241e99eb69', name: '职能工作' },
    { id: '1907bcaf09290450c261b984792b450d', name: '党建工作' }
  ];
  for (const pt of projectTypes) {
    insertProjectType.run(pt.id, pt.name);
  }
  console.log('项目名称数据初始化完成');
}

// 初始化工作性质数据（如果表为空）
const projectNaturesCount = db.prepare('SELECT COUNT(*) as count FROM project_natures').get();
if (projectNaturesCount.count === 0) {
  const insertProjectNature = db.prepare('INSERT INTO project_natures (id, name) VALUES (?, ?)');
  const projectNatures = [
    { id: '18d4a164d9d08188ab25b1b42d9bbf9a', name: '成果输出' },
    { id: '18d4a171bb318a573c5788648cca3d29', name: '差旅' },
    { id: '18d4a16d252c3e6e790ea304cfc825a0', name: '内部讨论' },
    { id: '18d4a16f629a5cec35e699a4ca48eca2', name: '外部接待' }
  ];
  for (const pn of projectNatures) {
    insertProjectNature.run(pn.id, pn.name);
  }
  console.log('工作性质数据初始化完成');
}

console.log('数据库初始化完成');

module.exports = db;
