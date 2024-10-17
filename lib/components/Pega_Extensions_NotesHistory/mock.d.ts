export declare const configProps: {
    title: string;
    dataNotesHistory: string;
    dataNotesHeaders: string;
    buttonText: string;
    modalTitle: string;
};
export declare const notesTableHeaders: {
    data: {
        CaseID: string;
        CreatedBy: string;
        DateCreated: string;
        NoteID: string;
        Subject: string;
        pxCommitDateTime: null;
        pxCreateDateTime: string;
        pxCreateOpName: string;
        pxCreateOperator: string;
        pxCreateSystemID: string;
        pxObjClass: string;
        pxSaveDateTime: null;
        pxUpdateDateTime: string;
        pxUpdateOpName: string;
        pxUpdateOperator: string;
        pxUpdateSystemID: string;
        pyGUID: string;
    }[];
};
export declare const notesHistory: {
    data: {
        NoteID: string;
        pxSaveDateTime: null;
        pxUpdateSystemID: string;
        CreatedBy: string;
        pxUpdateDateTime: string;
        DateCreated: string;
        Details: string;
        pxUpdateOpName: string;
        CaseID: string;
        pxUpdateOperator: string;
        Subject: string;
        pxObjClass: string;
        pxCreateOperator: string;
        pxCreateDateTime: string;
        pxCreateSystemID: string;
        pyGUID: string;
        pxCommitDateTime: null;
        pxCreateOpName: string;
    }[];
};
export declare const getCaseSummary: {
    content: {
        classID: string;
        pyLabel: string;
        pyID: string;
        pyViewName: string;
        pyViewContext: string;
        pxUrgencyWork: number;
        pxCreateOperator: string;
        pxUpdateDateTime: string;
        pxUpdateOperator: string;
        pxCreateDateTime: string;
        pyStatusWork: string;
        pyCaseLinks: never[];
        pyResolvedTimestamp: string;
        pyResolvedUserID: string;
    };
    caseTypeID: string;
    owner: string;
    availableActions: {
        name: string;
        links: {
            open: {
                rel: string;
                href: string;
                type: string;
                title: string;
            };
        };
        ID: string;
        type: string;
    }[];
    associations: {
        follows: boolean;
    };
    lastUpdatedBy: string;
    hasNewAttachments: boolean;
    businessID: string;
    sla: {
        goal: string;
        deadline: string;
    };
    WidgetsToRefresh: never[];
    caseTypeName: string;
    urgency: string;
    createTime: string;
    createdBy: string;
    name: string;
    stages: {
        entryTime: string;
        name: string;
        links: {
            open: {
                rel: string;
                href: string;
                type: string;
                title: string;
            };
        };
        visited_status: string;
        ID: string;
        type: string;
        transitionType: string;
    }[];
    ID: string;
    caseTypeIcon: string;
    status: string;
    stageID: string;
    stageLabel: string;
    lastUpdateTime: string;
    headers: {
        etag: string;
    };
};
//# sourceMappingURL=mock.d.ts.map