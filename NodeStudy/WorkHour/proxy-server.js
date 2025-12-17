const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 启用CORS（允许前端访问）
app.use(cors());

// 解析请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 代理端点
app.get('/', (req, res) => {
    res.send('Proxy server is running');
});
app.post('/proxy/working-hours', (req, res) => {
    const targetUrl = 'http://coms.fhdigz.com/dz/working/dz_working_hours_project/dzWorkingHoursProject.do?method=insertWorking';
    
    // console.log('Received request headers:', req.headers);
    // console.log('Received request Cookie:', req.body.cookie);

    // 设置请求头
    const options = {
        url: targetUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': req.body.cookie,
            'X-Requested-With': 'XMLHttpRequest'
        },
        form: req.body // 转发请求体
    };
    //测试，不真发送
    // res.status(200).send("代理请求已发送");

    // 发送请求到目标服务器
    request(options, (error, response, body) => {
        if (error) {
            console.log('Error occurred while proxying request:', error);
            return res.status(500).json({ error: '代理请求失败: ' + error.message });
        }
        
        //console.log('Response from target server:', body);
        //console.log('Response headers from target server:', response.headers);
        // 将目标服务器的响应返回给前端
        res.status(response.statusCode).send(body);
    });
});

app.listen(PORT, () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
});