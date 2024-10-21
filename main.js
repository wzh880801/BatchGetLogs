const { aeClient } = require('./api/index');
const fs = require('fs');
const path = require('path');
const { x_kunlun_token, cookie } = require('./config');
const { getArgV, isHasArg } = require('./common');
const moment = require('moment-timezone');

const authObj = parseAuthInfo();

// 注意
// 「dev 环境」和「生产环境」的身份信息是不同的，需要分别获取
// 「dev 环境」的域名类似这样：apaas-dev24658.aedev.feishuapp.cn
// const client = new aeClient('galaxy_001__c', authObj, 'apaas.feishuapp.cn');
// const client = new aeClient('galaxy_001__c', authObj, 'apaas-dev24658.aedev.feishuapp.cn');
const client = new aeClient('package_acdcc4__c', authObj, 'devopstestpre.fsapp.kundou.cn');


async function main() {

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

    let resp = await client.query(start, end, null, query_event_type);
    if (!resp || resp.status_code !== '0') {
        return;
    }

    process_data(resp.data.events, start, end, query_event_type);

    while (resp.data.has_more) {
        console.log('loading more events...');
        await sleep(2000);

        resp = await client.query(start, end, resp.data.next_cursor, query_event_type);

        if (resp.data && resp.data.events) {
            process_data(resp.data.events, start, end, query_event_type);
        }
    }

    console.log('All done!');
}

function parseAuthInfo() {
    const authObj = {
        x_kunlun_token: x_kunlun_token,
        cookie: cookie
    };

    if (process.env['KUNLUN_COOKIE']) {
        authObj.cookie = process.env['KUNLUN_COOKIE'];
    }
    if (process.env['KUNLUN_TOKEN']) {
        authObj.x_kunlun_token = process.env['KUNLUN_TOKEN'];
    }

    if (isHasArg('--cookie')) {
        authObj.cookie = getArgV('--cookie');
    }
    if (isHasArg('--token')) {
        authObj.x_kunlun_token = getArgV('--token');
    }
    return authObj;
}

/**
 * 
 * @param {Array<import('./api/data').IEvent>} events 
 * @param {number} start 
 * @param {number} end 
 * @param {string} query_event_type 
 */
function process_data(events, start, end, query_event_type) {

    const file = `./logs/${query_event_type}_${start}_${end}.txt`;

    console.log(`got ${events.length} events, saving to ${file}`);

    const save_dir = path.dirname(file);
    if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir);
    }

    for (const e of events) {
        // TODO
        // 这里增加你的处理逻辑
        // 下面这里演示获取页面的加载时间
        const d = client.parse_page_load_event_detail(e.event_detail);
        console.log(`${d.page_api_name}\t${d.cost}ms`);

        // 保存到本地
        // 依次为 开始时间 结束时间 事件ID 事件类型 事件详情
        fs.appendFileSync(file, `${e.start_timestamp}\t${e.end_timestamp}\t${e.event_id}\t${e.event_type}\t${JSON.stringify({ ...e, event_detail: JSON.parse(e.event_detail) })}\n`);
    }
}

/**
 * 
 * @param {number} ms 
 * @returns 
 */
async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

main()