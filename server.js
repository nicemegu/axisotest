const url = require('url');

function createApplication() {
  // 收集响应集合
  this.get = {};
  this.post = {};

  const APP = (req, res) => {
    // 借助url内置模块来获取路由
    let pathname = url.parse(req.url).pathname;
    // 统一转成小写处理
    let method = req.method.toLowerCase();

    // 处理一下传递参数
    if (this[method][pathname]){
      if (method ==='get'){
        // 将request与response对象传回对象的响应中
        this[method][pathname](req, res);
      }else {
        // 统一将post请求的参数放在req.body上
        let params = '';
        req.on('data', chunk => {
          params += chunk;
        });
        req.on('end', () => {
          req.body = params;
          this[method][pathname](req, res);
        })
      }
    }else {
      res.end('404');
    }
  };

  // APP身上挂载方法, 供导出后的对象使用
  APP.get = (url, cb) => {
    this.get[url] = cb;
  };
  APP.post = (url, cb) => {
    this.post[url] = cb;
  };

  return APP;
}



const http = require('http');
const host = 'localhost';
const port = '8888';
const app = createApplication() // 引入router.js文件

const server = http.createServer(app);

app.post('/api/register', (req, res) => {
  res.write(`<head><meta charset="utf-8"/></head>`);
  res.end('注册接口响应')
});

app.post('/api/login', (req, res) => {
  res.write(`<head><meta charset="utf-8"/></head>`);
  res.end('登录接口响应')
});

app.get('/api/list', (req, res) => {
  res.write(`<head><meta charset="utf-8"/></head>`);
  res.end('查询列表接口响应')
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
