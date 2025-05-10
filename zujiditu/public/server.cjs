// server.js
const express = require('express')
const request = require('request')
const app = express()

app.get('/proxy', (req, res) => {
    const url = req.query.url
    request({ url, encoding: null }, (err, resp, body) => {
        if (!err && resp.statusCode === 200) {
            res.set('Access-Control-Allow-Origin', '*')
            res.set('Content-Type', resp.headers['content-type'])
            res.send(body)
        } else {
            res.status(500).send('Image fetch failed')
        }
    })
})

app.listen(3000, () => console.log('代理服务器已启动~ http://localhost:3000'))
