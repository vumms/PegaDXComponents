export declare const pyReviewRaw: any;
export declare const pyReviewResolved: {
    readOnly: boolean;
    template: string;
    ruleClass: string;
    showLabel: boolean;
    label: string;
    localeReference: string;
    showHighlightedData: boolean;
    highlightedData: ({
        type: string;
        config: {
            value: string;
            label: string;
            displayMode: string;
            displayAsStatus: boolean;
            placeholder?: undefined;
        };
    } | {
        type: string;
        config: {
            value: string;
            label: string;
            displayMode: string;
            displayAsStatus?: undefined;
            placeholder?: undefined;
        };
    } | {
        type: string;
        config: {
            label: string;
            value: {
                userId: string;
                userName: string;
            };
            placeholder: string;
            displayMode: string;
            displayAsStatus?: undefined;
        };
    })[];
    displayMode: string;
};
export declare const regionChildrenResolved: ({
    readOnly: boolean;
    value: string;
    label: string;
    displayMode: string;
    key: string;
    listType?: undefined;
    datasource?: undefined;
} | {
    readOnly: boolean;
    value: string;
    label: string;
    listType: string;
    datasource: {
        key: string;
        value: string;
    }[];
    displayMode: string;
    key: string;
})[];
//# sourceMappingURL=mock.d.ts.map