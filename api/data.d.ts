export interface IQueryEventsResp {
    data: IRespData;

    /**
     * '0' 表示成功
     */
    status_code: string;

    error_msg?: string,

    /**
     * 2052 中文
     */
    lang_id?: number
}

export interface IRespData {
    has_more: boolean;
    events: IEvent[];
    context: IContext;
    event_type: EventType;
    next_cursor: string;
}

export interface IContext {
    users: IUsers;
}

export interface IUsers {
    [user_id: string]: IUser;
}

export interface IUser {
    id: number;
    avatar: IAvatar;
    name: string;
}

export interface IAvatar {
    source: string;
    image: IImage;
    color_id: string;
}

export interface IImage {
    large: string;
}

export type EventType = 'all_event' | "user_operation_event" | "page_load_event" | 'invoke_workflow_event' | 'invoke_dataflow_event' | 'access_control_event' | 'invoke_openapi_event' | 'page_error_event' | 'invoke_function_event';

export interface IEvent {
    event_detail: string;
    event_id: string;
    event_traces: IEventTrace[];
    app_version: string;
    start_timestamp: number;
    is_finished: boolean;
    end_timestamp: number;
    event_type: EventType;
    app_branch: AppBranch;
}

export type AppBranch = "develop" | "";

export interface IEventTrace {
    event_trace_id: string;
}

export interface INextCursor {
    has_more: boolean,
    next_page_token: string,
    excluded_event_id: string
}

export interface IUserOpEventDetail {
    app_version: string;
    is_finished: boolean;
    event_type: EventType;
    is_root: boolean;
    namespace: string;
    tenant_id: number;
    app_branch: string;
    update_timestamp: number;
    start_timestamp: number;
    component_api_name: string;
    end_timestamp: number;
    page_api_name: string;
    operation_type: string;
    operator_uid: string;
    event_id: string;
    traces: ITrace[];
    action: string;
    event_trace_id: string;
    page_name: Ii18nObj[];
}

export interface IWorkflowEventDetail {
    start_timestamp: number;
    update_timestamp: number;
    end_timestamp: number;
    app_branch: string;
    is_finished: boolean;

    /**
     * 耗时，单位毫秒
     */
    cost: number;
    workflow_name: Ii18nObj[];
    trigger_type: string;
    namespace: string;
    automation_id: number;
    invoke_id: string;
    is_root: boolean;
    event_type: string;
    source_workflow_id: string;
    error_code: string;
    invoke_origin_type: string;
    traces: ITrace[];
    event_id: string;
    action: string;
    invoker_uid: string;
    workflow_api_name: string;
    tenant_id: number;
    state: string;
    error_msg: Ii18nObj[];
    event_trace_id: string;
}

export interface IPageLoadEventDetail {
    operator_uid: string;
    app_branch: string;
    page_api_name: string;
    app_version: string;

    /**
     * 加载耗时，单位毫秒
     */
    cost: number;
    is_root: boolean;
    update_timestamp: number;
    start_timestamp: number;
    end_timestamp: number;
    namespace: string;
    page_name: Ii18nObj[];
    traces: ITrace[];
    event_id: string;
    is_finished: boolean;
    event_type: string;
    tenant_id: number;
    event_trace_id: string;
    action: string;
}

export interface Ii18nObj {
    language_code: number;
    text: string;
}

export interface ITrace {
    parent_event_id: string | undefined | null;
    event_trace_id: string;
}