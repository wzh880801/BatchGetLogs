# BatchGetLogs

# Steps

`node` 运行环境请自行安装。

## 1. Clone 仓库，安装 NPM 依赖
进到仓库目录
```bash
git clone https://github.com/wzh880801/BatchGetLogs.git
cd BatchGetLogs
npm i
```

## 2. 获取对应环境的 cookie 和 x-kunlun-token
线上环境 和 开发环境 身份验证信息不同，需要分别获取。
进到对应的环境，打开浏览器开发者工具，以 Chrome 为例，右键 -> 检查，切换到 Network 选项，filter 中输入 search。
切换到观测模块任一菜单，触发一次搜索。
在 Headers -> Request Headers 中找到 `Cookie` 和 `X-Kunlun-Token`,复制它们的值。
![img](https://wl.esobing.com/screenshot-20241021-192538.png)


## 3. 配置 cookie 和 x-kunlun-token

### 方式一 带参启动

```js
node main.js --token='123*****' --cookie='X-Kunlun-SessionId=G%3A627e0041ec***'

```

### 方式二 配置 config.js
```js

module.exports = {
    "cookie": "X-Kunlun-SessionId=SWS%3A4e7ec4904ba**********************",
    "x_kunlun_token": "10eae3c06ca32e3cA3u22a92fbba7*********************"
}
```

### 方式三 配置环境变量

```bash
export -p KUNLUN_COOKIE='X-Kunlun-SessionId=SWS%3A4e7ec4904ba**********************';
export -p KUNLUN_TOKEN='10eae3c06ca32e3cA3u22a92fbba7*********************';
```

## 4. 修改 main.js ，设置对应的 domain、namespace、start_time、end_time、event_type 获取对应时间范围的事件数据

```js
...
    // 注意
    // 「dev 环境」和「生产环境」的身份信息是不同的，需要分别获取
    // 「dev 环境」的域名类似这样：apaas-dev24658.aedev.feishuapp.cn
    const client = new aeClient('galaxy_001__c', authObj, 'apaas.feishuapp.cn');

    // all_event                全部事件
    // user_operation_event     用户操作
    // page_load_event          页面加载
    // invoke_workflow_event    流程执行
    // invoke_function_event    函数执行
    // invoke_dataflow_event    数据流执行
    // access_control_event     鉴权
    // page_error_event         页面报错
    // invoke_openapi_event     Open API


    // 演示获取当天页面加载事件
    const query_event_type = 'page_load_event';

    const now = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
    // 如果是昨天的可以
    // const now = moment().tz('Asia/Shanghai').add(-1, 'd').format('YYYY-MM-DD');

    const start_str = `${now}T00:00:00.000+08:00`;
    const end_str = `${now}T23:59:59.999+08:00`;

    const start = moment(start_str).toDate().getTime();
    const end = moment(end_str).toDate().getTime();

    console.log(`获取 ${start_str} - ${end_str} 的 ${query_event_type} 数据...`);

    ...

```

![img](https://wl.esobing.com/screenshot-20241021-195232.png)

```bash
galaxy@galaxy:/mnt/e/repos/BatchGetLogs$ node main.js 
获取 2024-10-21T00:00:00.000+08:00 - 2024-10-21T23:59:59.999+08:00 的 page_load_event 数据...
got 64 events, saving to ./logs/page_load_event_1729440000000_1729526399999.txt
aadf32mygk6gi   6412ms
aadf32mygk6gi   5821ms
aadf32mygk6gi   8377ms
aadf32mygk6gi   6325ms
aadf32mygk6gi   4913ms
aadf32mygk6gi   6286ms
aadf32mygk6gi   70101ms
aadf32mygk6gi   5359ms
aadf32mygk6gi   4840ms
aadf32mygk6gi   4523ms
aadf32mygk6gi   7651ms
aadf32mygk6gi   20499ms
aadf32mygk6gi   37803ms
aadf32mygk6gi   8116ms
aadf32mygk6gi   12596ms
aadf32mygk6gi   9573ms
aadf32mygk6gi   8223ms
aadf32mygk6gi   8589ms
aadf32mygk6gi   10799ms
aadf32mygk6gi   2794ms
aadf32mygk6gi   6313ms
aadf32mygk6gi   4430ms
aadf32mygk6gi   6544ms
...
```