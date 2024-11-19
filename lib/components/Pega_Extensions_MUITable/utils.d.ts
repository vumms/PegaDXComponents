export declare const getDataPageResults: (pConn: any, paramDataPage: any) => Promise<any>;
export declare const displayDPValues: (dataAsArray: []) => void;
export declare const getMUISimpleTableRowValues: (dataAsArray: []) => any;
export declare const getMUICustomerListRowValues: (dataAsArray: []) => any;
export declare const inspectCaseSummaryAndReturnList: (pConn: any, paramDataPage: string) => Promise<any>;
export declare const findUniqueId: <T>(arr1: T[], arr2: T[]) => T[];
export declare const findRowDetailById: (rowId: string, arrList: []) => undefined;
export declare const isUserSelectedRowCommentsEmpty: (arr1: [], arr2: [], sourceArrList: []) => boolean;
export declare const isEmpty: (value: any) => boolean;
export declare const getDisbursementEmbeddedData: (paramPConn: any, paramEmbedName: string) => Promise<any>;
export declare const getDisbursementDataAsRowData: (dataPageResults: []) => any;
export declare const getDisbursementDetailsDataAsRowData: (dataPageResults: []) => any;
export declare const getSelectedRowIndex: (customerTableData: any, rowId: string) => Promise<any>;
//# sourceMappingURL=utils.d.ts.map