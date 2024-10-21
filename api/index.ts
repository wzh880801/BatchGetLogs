import { EventType, IPageLoadEventDetail, IUserOpEventDetail, IWorkflowEventDetail, IQueryEventsResp } from "./data";

import * as axios from 'axios';

interface aeAuthInfo {
    cookie: string,
    x_kunlun_token: string
}

export class aeClient {
    private namespace: string;
    private domain: string = "apaas.feishuapp.cn";
    private auth: aeAuthInfo;

    constructor(namespace: string, auth: aeAuthInfo, domain: string = "apaas.feishuapp.cn") {
        if (!namespace) {
            throw new Error('namespace can not be null');
        }
        if (!auth || !auth.cookie || !auth.x_kunlun_token) {
            throw new Error('auth info is null');
        }

        console.log(`domain:\t\t${domain}\nnamespace:\t${namespace}`);

        this.namespace = namespace;
        this.domain = domain;
        this.auth = auth;

        return this;
    }

    parse<T>(event_str: string): T {
        return JSON.parse(event_str);
    }

    parse_flow_event_detail(event_str: string): IWorkflowEventDetail {
        return this.parse<IWorkflowEventDetail>(event_str);
    }

    parse_page_load_event_detail(event_str: string): IPageLoadEventDetail {
        return this.parse<IPageLoadEventDetail>(event_str);
    }

    parse_user_op_event_detail(event_str: string): IUserOpEventDetail {
        return this.parse<IUserOpEventDetail>(event_str);
    }

    async query(start_timestamp: number, end_timestamp: number, next_cursor: string | undefined | null, event_type: EventType = 'user_operation_event'): Promise<IQueryEventsResp> {
        const url = `https://${this.domain}/ae/api/v1/namespaces/${this.namespace}/events/search`;
        const headers = {
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
            "x-kunlun-language-code": "2052",
        }
        const resp = await this.get_events(url, headers, start_timestamp, end_timestamp, next_cursor, event_type);

        if (resp.status_code !== '0') {
            console.info(`\n请求错误（${resp.error_msg}），请通过以下方式之一设置身份信息。\n1. 在 config.js 中维护好身份信息\n2. 在环境变量中设置 KUNLUN_COOKIE 和 KUNLUN_TOKEN\n2. 使用带参启动: node main.js --cookie='<cookie_str>' --token='<x_kunlun_token>'\n`);
        }

        return resp;
    }

    private async get_events(url: string, headers: { [key: string]: string }, start_timestamp: number, end_timestamp: number, next_cursor: string | undefined | null, event_type: EventType = 'user_operation_event'): Promise<IQueryEventsResp> {

        if (typeof start_timestamp !== typeof 0 || typeof end_timestamp !== typeof 0) {
            throw new Error(`time range error. start_timestamp or end_timestamp is illegal.`);
        }

        if (start_timestamp >= end_timestamp) {
            throw new Error(`time range error. start_timestamp should be earlier than end_timestamp.`);
        }

        let body = {
            "start_timestamp": start_timestamp,
            "end_timestamp": end_timestamp,
            "event_type": event_type,
            "keyword_filter": {},
            "kv_filters": []
        }

        if (next_cursor) {
            body['next_cursor'] = next_cursor;
        }

        const resp = await axios.default({

            // https://apaas.feishuapp.cn/ae/api/v1/namespaces/galaxy_001__c/events/search
            // https://apaas-dev24658.aedev.feishuapp.cn/ae/api/v1/namespaces/galaxy_001__c/events/search

            url: url,
            method: 'POST',
            headers: {
                ...headers,
                "x-kunlun-language-code": "2052",
                "x-kunlun-token": this.auth.x_kunlun_token,
                "cookie": this.auth.cookie
            },
            data: body
        })
        return resp.data;
    }
}