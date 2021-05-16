declare module "store" {
    export default store;
    const store: any;
}
declare module "actions/types" {
    export const API_GET_POLICY: "API_GET_POLICY";
    export const API_GET_POLICIES: "API_GET_POLICIES";
    export const API_GET_POLICY_INSTANCE: "API_GET_POLICY_INSTANCE";
    export const API_GET_CODING: "API_GET_CODING";
    export const API_GET_CODING_PROGRESS: "API_GET_CODING_PROGRESS";
    export const API_POST_CODING_INSTANCE: "API_POST_CODING_INSTANCE";
    export const API_GET_CODING_INSTANCE: "API_GET_CODING_INSTANCE";
    export const API_AUTO_SAVE: "API_AUTO_SAVE";
    export const API_GET_ALL_CODING_INSTANCE: "API_GET_ALL_CODING_INSTANCE";
    export const USER_SELECT_QUESTION: "USER_SELECT_QUESTION";
    export const USER_CHANGE_VALUE: "USER_CHANGE_VALUE";
    export const USER_TOGGLE_SENTENCE: "USER_TOGGLE_SENTENCE";
    export const USER_CLICK_SAVE: "USER_CLICK_SAVE";
    export const USER_CLICK_RESET: "USER_CLICK_RESET";
    export const USER_CHANGE_QUESTION_META: "USER_CHANGE_QUESTION_META";
    export const APP_SET_CURRENT_VIEW: "APP_SET_CURRENT_VIEW";
    export const APP_SET_CODING_MODE: "APP_SET_MODE";
    export const NULL_OP: "NULL_OP";
}
declare module "actions/api" {
    export function apiGetPolicies(): (dispatch: any) => Promise<void>;
    export function apiGetPolicyInstance(policy_instance_id: any): (dispatch: any) => Promise<void>;
    export function apiGetCoding(coding_id: any): (dispatch: any) => Promise<void>;
    export function apiGetCodingProgress(): (dispatch: any) => Promise<void>;
    export function apiGetCodingInstance(policy_instance_id: any, coding_id: any): (dispatch: any) => Promise<void>;
    export function apiGetAllCodingInstances(policy_instance_id: any, coding_id: any): (dispatch: any) => Promise<void>;
    export function apiPostCodingInstance(): (dispatch: any) => Promise<void>;
    export function apiAutoSave(override?: boolean): (dispatch: any) => Promise<void>;
}
declare module "components/widgets/PersonalProgressView" {
    var _default: import("react-redux").ConnectedComponent<typeof PersonalProgress, import("react-redux").Omit<any, "apiGetCodingProgress" | "codingProgress">>;
    export default _default;
    class PersonalProgress extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/CoderStatusApp" {
    var _default: import("react-redux").ConnectedComponent<typeof CoderStatusApp, import("react-redux").Omit<any, "apiGetCoding" | "model">>;
    export default _default;
    class CoderStatusApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/CodingApp" {
    var _default: import("react-redux").ConnectedComponent<typeof CoderStatusApp, import("react-redux").Omit<any, "apiGetCoding" | "model">>;
    export default _default;
    class CoderStatusApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/CodingEditorApp" {
    var _default: import("react-redux").ConnectedComponent<typeof CodingEditorApp, import("react-redux").Omit<any, "apiGetCoding" | "model">>;
    export default _default;
    class CodingEditorApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "actions/userActions" {
    export function userSelectQuestion(question_idx: any, question_identifier: any): (dispatch: any) => Promise<void>;
    export function userChangeValue(question_idx: any, question_identifier: any, values: any): (dispatch: any) => Promise<void>;
    export function userToggleSentence(policy_type: any, paragraph_idx: any, sentence_idx: any): (dispatch: any) => Promise<void>;
    export function userChangeQuestionMeta(question_idx: any, question_identifier: any, field: any, value: any): (dispatch: any) => Promise<void>;
    export function userClickSave(): (dispatch: any) => Promise<void>;
    export function userClickReset(): (dispatch: any) => Promise<void>;
    export function userNullOp(): (dispatch: any) => Promise<void>;
}
declare module "components/utils/displayUtils" {
    export function stringifySentences(sentences: any): {
        pretty_string: string;
        policy_type: string;
        paragraph_idx: string;
    }[];
    export function scrollToSentenceTarget(e: any): void;
    export function sentenceCount(sentences_by_doc: any): any;
}
declare module "components/coding_interface/coding-form/MergeElements" {
    export const MergeTool: import("react-redux").ConnectedComponent<{
        new (props: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        new (props: any, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState">>;
    export class MergeItem extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
    }
    export class MergeBoxHeader extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
    }
    import React from "react";
}
declare module "components/coding_interface/coding-form/QuestionBoxHeader" {
    /**
     * shows the various searchable status information about the question box
     * (answer, sentences highlighted, ect.)
     */
    export default class _default extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
    }
    import React from "react";
    import QuestionBoxHeader from "components/coding_interface/coding-form/QuestionBoxHeader";
}
declare module "components/coding_interface/coding-form/QuestionValueCommentBox" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            commentChanged(comment: any): void;
            handleCommentChange(e: any): void;
            confidenceChanged(confidence_level: any): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "userChangeQuestionMeta" | "apiAutoSave">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/QuestionValueSelector" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            toggle(value: any, is_selected: any): void;
            silence(value: any, selected: any): void;
            otherChanged(value: any): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "apiAutoSave" | "userChangeValue">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/MultiselectActiveArea" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        new (props: any, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "userSelectQuestion">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/QuestionBox" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            handleClick(): void;
            getMergeData(): {
                responses: any[];
                authors: any[];
            };
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "userSelectQuestion">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/FloatingControls" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            scroll_to_current: any;
            scroll_to_next_disagreement: any;
            scroll_to_next_unanswered: any;
            _scroll_to_current(): void;
            _scroll_to_next_disagreement(): void;
            _scroll_to_next_unanswered(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState">>;
    export default _default;
    import { default as React } from "react";
}
declare module "components/coding_interface/coding-form/CodingOverview" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        new (props: any, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/BreakoutOption" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            handleClick(): void;
            getMergeData(): {
                responses: any[];
                authors: any[];
            };
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "userSelectQuestion">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/coding-form/BreakoutHeader" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            handleClick(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "userSelectQuestion">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/CodingForm" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            userSave(): void;
            userSubmit(): void;
            localStore(): void;
            restoreStore(): void;
            fun(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "apiPostCodingInstance" | "userNullOp">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/policy-browser/PolicySentence" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            handleClick(): void;
            _checkSentence(selected_sentences: any): boolean;
            _get_selected_sentences(coding_instance: any, policy_type: any): any;
            _basicHighlightTest(): string;
            _mergeHighlightTest(): string;
            _highlightTest(): string;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "apiAutoSave" | "userToggleSentence">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/policy-browser/PolicyParagraph" {
    export default class PolicyParagraph extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
    }
    import React from "react";
}
declare module "components/coding_interface/policy-browser/PolicyPage" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState" | "apiAutoSave">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/policy-browser/PolicyOverview" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        new (props: any, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState">>;
    export default _default;
    import React from "react";
}
declare module "components/coding_interface/PolicyBrowser" {
    var _default: import("react-redux").ConnectedComponent<{
        new (props: any): {
            componentDidMount(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        new (props: any, context: any): {
            componentDidMount(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<any> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<any>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        };
        contextType?: React.Context<any>;
    }, import("react-redux").Omit<any, "model" | "localState">>;
    export default _default;
    import React from "react";
}
declare module "actions/appActions" {
    export function appSetCurrentView(policy_instance_id: any, coding_id: any, merge_mode: any): (dispatch: any) => Promise<void>;
}
declare module "components/utils/SessionTimer" {
    export default class SessionTimer {
        constructor(user_email: any, coding_id: any, policy_instance_id: any);
        coding_id: any;
        policy_instance_id: any;
        session: {};
        running_timer_id: any;
        post_update: any;
        post_update_async: any;
        run_timer: any;
        _get_post_values(): {
            coder_email: any;
            coding_id: any;
            policy_instance_id: any;
            session_timing: {
                total_blur: any;
                total_focus: any;
                start_ts: any;
            };
            question_timings: any;
            session_identifier: any;
        };
        _blur(e: any): void;
        _focus(e: any): void;
        _unload(e: any): void;
        _run_timer(timer_id: any): void;
        _post_update(): void;
        _post_update_async(): Promise<void>;
    }
}
declare module "components/CodingInterfaceApp" {
    var _default: import("react-redux").ConnectedComponent<typeof CodingInterfaceApp, import("react-redux").Omit<any, "apiGetCoding" | "model" | "apiGetPolicyInstance" | "apiGetCodingInstance" | "appSetCurrentView" | "apiGetAllCodingInstances">>;
    export default _default;
    class CodingInterfaceApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/HomeApp" {
    var _default: import("react-redux").ConnectedComponent<typeof HomeApp, import("react-redux").Omit<any, "apiGetCoding" | "model" | "route">>;
    export default _default;
    class HomeApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/PolicyApp" {
    var _default: import("react-redux").ConnectedComponent<typeof PolicyApp, import("react-redux").Omit<any, "apiGetCoding" | "model">>;
    export default _default;
    class PolicyApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/PolicyInstanceApp" {
    var _default: import("react-redux").ConnectedComponent<typeof PolicyInstanceApp, import("react-redux").Omit<any, "apiGetCoding" | "model">>;
    export default _default;
    class PolicyInstanceApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/ProgressViewApp" {
    var _default: import("react-redux").ConnectedComponent<typeof ProgressViewApp, import("react-redux").Omit<any, "apiGetCodingProgress" | "codingProgress">>;
    export default _default;
    class ProgressViewApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/App" {
    export {};
}
declare module "index" {
    export {};
}
declare module "components/UploadApp" {
    export default class UploadApp extends React.Component<any, any, any> {
        constructor(props: any);
    }
    import React from "react";
}
declare module "components/utils/mapStateToProps" {
    function _default(state: any): {
        model: any;
        codingProgress: any;
        localState: any;
        route: any;
    };
    export default _default;
}
declare module "components/widgets/TestDiv" {
    export default class _default extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
    }
    import React from "react";
}
declare module "reducers/codingProgressStore" {
    function _default(state: {}, action: any): any;
    export default _default;
}
declare module "reducers/model" {
    function _default(state: {
        policies: {};
        policy_instances: {};
        codings: {};
        coding_instances: {};
    }, action: any): {
        policies: {};
        policy_instances: {};
        codings: {};
        coding_instances: {};
    };
    export default _default;
}
declare module "reducers/localState" {
    function _default(state: {
        selectedQuestion: string;
        selectedQuestionIdentifier: string;
        localCoding: {};
        updateSinceLastSave: boolean;
    }, action: any): any;
    export default _default;
}
declare module "reducers/index" {
    var _default: any;
    export default _default;
}
//# sourceMappingURL=main.d.ts.map