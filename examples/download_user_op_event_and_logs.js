const { aeClient } = require('../api/index');
const fs = require('fs');
const path = require('path');
const { x_kunlun_token, cookie } = require('../config');
const { getArgV, isHasArg } = require('../common');
const moment = require('moment-timezone');

const authObj = parseAuthInfo();

// 注意
// 「dev 环境」和「生产环境」的身份信息是不同的，需要分别获取
// 「dev 环境」的域名类似这样：apaas-dev24658.aedev.feishuapp.cn
// const client = new aeClient('galaxy_001__c', authObj, 'apaas.feishuapp.cn');
// const client = new aeClient('galaxy_001__c', authObj, 'apaas-dev24658.aedev.feishuapp.cn');
const client = new aeClient('package_7a2002__c', authObj, 'apaas.feishuapp.cn');


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
    const query_event_type = 'user_operation_event';

    const now = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
    // 如果是昨天的可以
    // const now = moment().tz('Asia/Shanghai').add(-1, 'd').format('YYYY-MM-DD');

    const start_str = `${now}T00:00:00.000+08:00`;
    const end_str = `${now}T23:59:59.999+08:00`;

    const start = moment(start_str).toDate().getTime();
    const end = moment(end_str).toDate().getTime();

    console.log(`\n获取 ${start_str} - ${end_str} 的 ${query_event_type} 数据...`);

    const is_download_logs = isHasArg('--logs');

    const kv_filters = [{ "key": "operation_type", "operator": "IS", "values": ["click"], "type": "STRING" }];

    let resp = await client.query(start, end, null, query_event_type, kv_filters);
    if (!resp || resp.status_code !== '0') {
        return;
    }

    await process_data(resp.data, start, end, query_event_type, is_download_logs);

    while (resp.data.has_more) {
        console.log('loading more events...');
        await sleep(2000);

        resp = await client.query(start, end, resp.data.next_cursor, query_event_type, kv_filters);

        if (resp.data && resp.data.events) {
            await process_data(resp.data, start, end, query_event_type, is_download_logs);
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
 * @param {import('../api/data').IRespData} resp 
 * @param {number} start 
 * @param {number} end 
 * @param {string} query_event_type 
 * @param {boolean} is_download_logs
 */
async function process_data(resp, start, end, query_event_type, is_download_logs = false) {

    const file = `./logs/${query_event_type}_${start}_${end}.txt`;

    console.log(`\ngot ${resp.events.length} events, saving to ${file}`);

    const save_dir = path.dirname(file);
    if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir);
    }

    for (const e of resp.events) {
        // TODO
        // 这里增加你的处理逻辑
        // 下面这里演示获取页面的加载时间
        // const d = client.parse_page_load_event_detail(e.event_detail);
        // console.log(`${d.page_api_name}\t${d.cost}ms`);

        const d = client.parse_user_op_event_detail(e.event_detail);

        let logs;

        if (is_download_logs) {
            logs = await get_all_logs(d);
        }  

        // 保存到本地
        // 依次为 开始时间 结束时间 事件ID TraceId 事件类型 操作人姓名 事件上下文 事件详情 日志详情
        if ((is_download_logs && logs.length > 0) || !is_download_logs) {
            console.log(`${d.start_timestamp}\t${d.event_id}\t${d.event_trace_id}\t${d.page_api_name}\t${d.operation_type}\t${d.component_api_name}\t${resp.context.users[d.operator_uid].name}`);
            fs.appendFileSync(file, `${e.start_timestamp}\t${e.end_timestamp}\t${e.event_id}\t${d.event_trace_id}\t${e.event_type}\t${resp.context.users[d.operator_uid].name}\t${JSON.stringify(resp.context)}\t${JSON.stringify({ ...e, event_detail: JSON.parse(e.event_detail) })}\t${logs ? JSON.stringify(logs) : ''}\n`);
        }
    }
}

/**
 * 
 * @param {import('../api/data').IUserOpEventDetail} event 
 * @param {string | undefined | null} next_cursor 
 * @returns {Promise<Array<import('./api/data').ILog>>}
 */
async function get_all_logs(event, next_cursor) {
    let logs = [];
    let _resp = await client.query_process_logs(event.event_id, event.event_type, next_cursor);
    if (_resp.status_code !== '0') {
        throw new Error(`获取日志数据错误. event_id=${event.event_id} ${_resp.error_msg}`);
    }
    const keyword = getArgV('--keyword');
    if (keyword) {
        for (const l of _resp.data.logs) {
            if (l.content.indexOf(keyword) !== -1) {
                logs.push(l);
            }
        }
    }
    else {
        logs.push(..._resp.data.logs);
    }

    while (_resp && _resp.data.has_more) {
        console.log(`loading more logs for event_id ${event_id}...`);
        await sleep(2000);

        logs.push(...(await get_all_logs(event, _resp.data.next_cursor)));
    }

    return logs;
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