"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeClient = void 0;
var axios = require("axios");
axios.default.defaults.timeout = 60000;
var aeClient = /** @class */ (function () {
    function aeClient(namespace, auth, domain) {
        if (domain === void 0) { domain = "apaas.feishuapp.cn"; }
        this.domain = "apaas.feishuapp.cn";
        if (!namespace) {
            throw new Error('namespace can not be null');
        }
        if (!auth || !auth.cookie || !auth.x_kunlun_token) {
            throw new Error('auth info is null');
        }
        console.log("domain:\t\t".concat(domain, "\nnamespace:\t").concat(namespace));
        this.namespace = namespace;
        this.domain = domain;
        this.auth = auth;
        return this;
    }
    aeClient.prototype.parse = function (event_str) {
        return JSON.parse(event_str);
    };
    aeClient.prototype.parse_flow_event_detail = function (event_str) {
        return this.parse(event_str);
    };
    aeClient.prototype.parse_page_load_event_detail = function (event_str) {
        return this.parse(event_str);
    };
    aeClient.prototype.parse_user_op_event_detail = function (event_str) {
        return this.parse(event_str);
    };
    aeClient.prototype.query = function (start_timestamp_1, end_timestamp_1, next_cursor_1) {
        return __awaiter(this, arguments, void 0, function (start_timestamp, end_timestamp, next_cursor, event_type, kv_filters) {
            var url, headers, resp;
            if (event_type === void 0) { event_type = 'user_operation_event'; }
            if (kv_filters === void 0) { kv_filters = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "https://".concat(this.domain, "/ae/api/v1/namespaces/").concat(this.namespace, "/events/search");
                        headers = {
                            "content-type": "application/json",
                            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                            "x-kunlun-language-code": "2052",
                        };
                        return [4 /*yield*/, this.get_events(url, headers, start_timestamp, end_timestamp, next_cursor, event_type, kv_filters)];
                    case 1:
                        resp = _a.sent();
                        if (resp.status_code !== '0') {
                            console.info("\n\u8BF7\u6C42\u9519\u8BEF\uFF08".concat(resp.error_msg, "\uFF09\uFF0C\u8BF7\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u4E4B\u4E00\u8BBE\u7F6E\u8EAB\u4EFD\u4FE1\u606F\u3002\n1. \u5728 config.js \u4E2D\u7EF4\u62A4\u597D\u8EAB\u4EFD\u4FE1\u606F\n2. \u5728\u73AF\u5883\u53D8\u91CF\u4E2D\u8BBE\u7F6E KUNLUN_COOKIE \u548C KUNLUN_TOKEN\n2. \u4F7F\u7528\u5E26\u53C2\u542F\u52A8: node main.js --cookie='<cookie_str>' --token='<x_kunlun_token>'\n"));
                        }
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    aeClient.prototype.get_events = function (url_1, headers_1, start_timestamp_1, end_timestamp_1, next_cursor_1) {
        return __awaiter(this, arguments, void 0, function (url, headers, start_timestamp, end_timestamp, next_cursor, event_type, kv_filters) {
            var body, resp;
            if (event_type === void 0) { event_type = 'user_operation_event'; }
            if (kv_filters === void 0) { kv_filters = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof start_timestamp !== typeof 0 || typeof end_timestamp !== typeof 0) {
                            throw new Error("time range error. start_timestamp or end_timestamp is illegal.");
                        }
                        if (start_timestamp >= end_timestamp) {
                            throw new Error("time range error. start_timestamp should be earlier than end_timestamp.");
                        }
                        body = {
                            "start_timestamp": start_timestamp,
                            "end_timestamp": end_timestamp,
                            "event_type": event_type,
                            "keyword_filter": {},
                            "kv_filters": []
                        };
                        if (next_cursor) {
                            body['next_cursor'] = next_cursor;
                        }
                        if (kv_filters && kv_filters.length > 0) {
                            body['kv_filters'] = kv_filters;
                        }
                        return [4 /*yield*/, axios.default({
                                // https://apaas.feishuapp.cn/ae/api/v1/namespaces/galaxy_001__c/events/search
                                // https://apaas-dev24658.aedev.feishuapp.cn/ae/api/v1/namespaces/galaxy_001__c/events/search
                                url: url,
                                method: 'POST',
                                headers: __assign(__assign({}, headers), { "x-kunlun-language-code": "2052", "x-kunlun-token": this.auth.x_kunlun_token, "cookie": this.auth.cookie }),
                                data: body
                            })];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data];
                }
            });
        });
    };
    aeClient.prototype.query_process_logs = function (event_id, event_type, next_cursor) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event_type !== 'page_load_event' && event_type !== 'user_operation_event' && event_type !== 'invoke_function_event') {
                            throw new Error("only support page_load_event\u3001user_operation_event & invoke_function_event. Got ".concat(event_id));
                        }
                        url = "https://".concat(this.domain, "/ae/api/v1/namespaces/").concat(this.namespace, "/events/").concat(event_id, "/processlogs");
                        body = {
                            "event_id": event_id,
                            "event_type": event_type
                        };
                        if (next_cursor) {
                            body['next_cursor'] = next_cursor;
                        }
                        return [4 /*yield*/, axios.default({
                                url: url,
                                method: 'POST',
                                headers: {
                                    "content-type": "application/json",
                                    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                                    "x-kunlun-language-code": "2052",
                                    "x-kunlun-token": this.auth.x_kunlun_token,
                                    "cookie": this.auth.cookie
                                },
                                data: body
                            })];
                    case 1:
                        resp = _a.sent();
                        if (resp.data.status_code !== '0') {
                            console.info("\n\u8BF7\u6C42\u9519\u8BEF\uFF08".concat(resp.data.error_msg, "\uFF09\uFF0C\u8BF7\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u4E4B\u4E00\u8BBE\u7F6E\u8EAB\u4EFD\u4FE1\u606F\u3002\n1. \u5728 config.js \u4E2D\u7EF4\u62A4\u597D\u8EAB\u4EFD\u4FE1\u606F\n2. \u5728\u73AF\u5883\u53D8\u91CF\u4E2D\u8BBE\u7F6E KUNLUN_COOKIE \u548C KUNLUN_TOKEN\n2. \u4F7F\u7528\u5E26\u53C2\u542F\u52A8: node main.js --cookie='<cookie_str>' --token='<x_kunlun_token>'\n"));
                        }
                        return [2 /*return*/, resp.data];
                }
            });
        });
    };
    return aeClient;
}());
exports.aeClient = aeClient;
