import { randomId } from '@mui/x-data-grid-generator';

/* Function to retrieve datapage list */
export const getDataPageResults = async (pConn: any, paramDataPage: any) => {
    const PCore = (window as any).PCore;    
    const context = pConn().getContextName();
    const dataPage = paramDataPage?.referenceList;    
    const parameters = paramDataPage?.parameters?paramDataPage.parameters:{};

    try {
        // const getData = await PCore.getDataPageUtils().getDataAsync(paramDataPage, context);
        const getData = await PCore.getDataPageUtils().getDataAsync(dataPage, context, parameters);
        if (getData.status === 200 || getData.data.length > 0) {
            return getData.data;
        }
    }
    catch (error) {
        console.log(error);
    }
}

/* Function to display array */
export const displayDPValues = (dataAsArray: []) => {
    const tmpArray: any = [];
    dataAsArray.map(arrayData => ( 
        console.log( arrayData['Id'] + arrayData['Firstname'] + arrayData['Lastname'] + arrayData['Age'] )            
    ))
     console.log(tmpArray); 
 }

 /* Get MUI simple table row values  
    sample array format { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 } */
 export const getMUISimpleTableRowValues = (dataAsArray: []) => {
    const rowArray: any = [];
    dataAsArray.map(arrayData => (   
        rowArray.push({
            id: arrayData['Id'],            
            lastName: arrayData['Lastname'],
            firstName: arrayData['Firstname'],
            age: arrayData['Age']
        })
    ))
    console.log(rowArray); 
    return rowArray;
 }

 /* Get MUI Customer object table row values  
    sample array format { FirstName: 'Jon', LastName: 'Snow',  DataOfBirth: 35 } */
    export const getMUICustomerListRowValues = (dataAsArray: []) => {
        const rowArray: any = [];
        dataAsArray.map(arrayData => (   
            rowArray.push({         
                id: arrayData['ID'],      
                FirstName: arrayData['FirstName'],
                LastName: arrayData['LastName'],
                DateOfBirth: arrayData['DateOfBirth']
            })
        ))
        console.log(rowArray); 
        return rowArray;
     }

/* Function to lookup case summary and retrieve list objects in an array */
export const inspectCaseSummaryAndReturnList = async (pConn: any, paramDataPage: string ) => {
    /* const PCore = window.PCore;    
    const context = pConn().getContextName(); */
    /* const tempListName = "CustomerList2"; */
    console.log(paramDataPage);

    try {
        /* const listDataObject = `.{paramDataPage}`; */
        /* const caseSummaryObj = pConn().getCaseSummary();
        const caseSummaryContentObj = caseSummaryObj.content; */
        console.log("listDataObject=", paramDataPage);

        /* const arrayOfCustomerList = caseSummaryContentObj.find((content: any) => content[0] === tempListName);
        console.log(arrayOfCustomerList);

        const arrList: any = [];
        arrayOfCustomerList.map((customerList :any) => ( arrList.push(customerList)));
        console.log(arrList); */
        // e.g. to get CustomerList1 object values -> pConn().getValue(".CustomerList2")
        const arrayOfCustomerList = pConn().getValue(paramDataPage);
        // const arrayOfCustomerList = caseSummaryContentObj.CustomerList2;

        const rowArray: any = [];
        arrayOfCustomerList.map((listitem: any) => ( 
                        rowArray.push({
                            id: randomId(), // This is must to have for unique id for each row
                            FirstName: listitem["FirstName"], 
                            LastName: listitem["LastName"], 
                            DateOfBirth: listitem["DateOfBirth"]
                        })
                        )
                    );
        console.log(rowArray);     
        return(rowArray);

        /* const getData = await PCore.getDataPageUtils().getDataAsync(paramDataPage, context);
        if (getData.status === 200 || getData.data.length > 0) {
            return getData.data;
        } */
    }
    catch (error) {
        console.log(error);
    }
}

export const findUniqueId = <T>(arr1: T[], arr2: T[]): T[] => {  
    if(arr1.length > arr2.length)
      return arr1.filter(item => !arr2.includes(item));
    else
      return arr2.filter(item => !arr1.includes(item));
  }

export const findRowDetailById = (rowId: string, arrList: []) => {
    console.log("RowId=", rowId);
    console.log("Table=", arrList);
    const selectedRowsData = arrList.find((row:any) => row.id === rowId);
    console.log("SelectedRow", selectedRowsData);
    return(selectedRowsData);
  }

  export const isUserSelectedRowCommentsEmpty = (arr1: [], arr2: [], sourceArrList: []): boolean => { 
    const selectedId = findUniqueId(arr1, arr2);
    const selectedRowObject: any = findRowDetailById(selectedId.toString(), sourceArrList);
    return(selectedRowObject.comments === '');
  }

  export const isEmpty = (value: any) => {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
  }

/* Function to lookup embedded data for Disbursement Object and retrieve list objects in an array */
export const getDisbursementEmbeddedData = async (paramPConn: any, paramEmbedName: string ) => {

    try {
        const caseSummaryObj = paramPConn().getCaseSummary();
        const caseSummaryContentObj = caseSummaryObj.content;    
        console.log(caseSummaryContentObj);   
        /* const embedDataPageList =  `${caseSummaryObj.content}.${paramEmbedName}`;
        console.log(embedDataPageList);   */
        // e.g. to get DisbursementList object values -> pConn().getValue(".DJCSEmbeddedPage")
        const arrayOfEmbeddedList = paramPConn().getValue(`.${paramEmbedName}`);
        // const cPageReference = `${pConnectProp().getPageReference()}.${disbursementObject}`;
        const rowArray: any = [];        
        arrayOfEmbeddedList?.map((listitem: any) => ( 
            rowArray.push({
                id: listitem['pyGUID'], // Unique-id is mandatory for Table rows
                // id: randomId(),
                Beneficiary_type: listitem['Beneficiary_type'],
                Beneficiary_name: listitem['Beneficiary_name'],
                Beneficiary_id: listitem['Beneficiary_id'],
                Amount: listitem['Amount'],
                Type: listitem['Type'],
                Disbursement_id: listitem['Disbursement_id'],
                Status_x: listitem['Status'],   // Status has some special keyword in MUI library so had to store it under different variable name                                
                Comments: listitem['Comments'], 
                Select: listitem['Select'],  // boolean select state of each row                   
                detailsData: [
                    { id: randomId(), item: 'detailsField1', amt: '100' },
                    { id: randomId(), item: 'detailsField2', amt: '100' },
                    { id: randomId(), item: 'detailsField3', amt: '100' }, 
                    { id: randomId(), item: 'detailsField4', amt: '100' },
                    { id: randomId(), item: 'detailsField5', amt: '100' },
                ],
            })                       
            )
        );
        // TODO for each row add the context tree manager
        // (window as any).PCore.getContextTreeManager().addFieldNode("app/primary_1/workarea_1", "caseInfo.content.DisbursementList", "", "");
        // (window as any).PCore.getContextTreeManager().addFieldNode(paramPConn().getContextName(), paramPConn().getPageReference(), "", "");
        console.log(rowArray);     
        return(rowArray);
    }
    catch (error) {
        console.log(error);
    }
}

/* Function to lookup select state TRUE to return list of pre-selected rows ids ONLY */
export const getPreSelectedTableDataListIds = (disbursementTableData: any) => {        
    const preSelectedRowsIds = disbursementTableData.filter((row: any) => row.Select === true).map((row: any) => row.id);
    return (preSelectedRowsIds);
}

/* Function to lookup select state TRUE to return list of pre-selected rows */
export const getPreSelectedTableDataList = (disbursementTableData: any) => {        
    const preSelectedRows = disbursementTableData.filter((row: any) => row.Select === true).map((row: any) => row);
    return (preSelectedRows);
}

/* Function to read disbursement datapage results and put them in a row array for Table component to render */
/* sample array format {id: 1, bty: 'Debtor refunds', bnam: 'Virgel', bid: '9988768789', amt: 100.00,
    type: 'Irregular', did: '2345',bsts: 'Fixed-Reissue',  isAccepted: true, comments: '', */
export const getDisbursementDataAsRowData = (dataPageResults: []) => {
    const rowArray: any = [];
    dataPageResults.map(arrayData => (   
        rowArray.push({                     
            id: arrayData['pyGUID'], // Unique-id is mandatory for Table rows
            bty: arrayData['BeneficiaryType'],
            bnam: arrayData['BeneficiaryName'],
            bid: arrayData['BeneficiaryID'],
            amt: arrayData['Amount'],
            type: arrayData['Type'],
            did: arrayData['DisbursementID'],
            bsts: 'Fixed-Reissue',
            /* isAccepted: true, */
            comments: arrayData['Comment'],
            detailsData: [
                { id: randomId(), item: 'detailsField1', amt: '100' },
                { id: randomId(), item: 'detailsField2', amt: '100' },
                { id: randomId(), item: 'detailsField3', amt: '100' },
                { id: randomId(), item: 'detailsField4', amt: '100' },
                { id: randomId(), item: 'detailsField5', amt: '100' },
            ],
        })
    ))
    console.log(rowArray); 
    return rowArray;
}

/*
{
    "transaction_date": null,
    "batch_id": null,
    "difference_in_days": null,
    "disbursement_id": null,
    "mdm_golden_id": null,
    "registration_fee": 30,
    "issuing_agency_code": null,
    "warrant_cost": null,
    "prn_amount": 40,
    "obligation_number": "3232323232",
    "pxObjClass": "DJCS-Data-ObligationStore-DisbursementDetails",
    "actual_payment_date": null,
    "total_paid": 100,
    "infringement_number": "3232323232",
    "court_cost_amount": null,
    "enforcement_fee": 60,
    "fine_amount": 20,
    "disbursement_type": null,
    "infringement_issue_date": null,
    "collection_statement_issue_date": null
}
*/
export const getDisbursementDetailsDataAsRowData = (dataPageResults: []) => {
    const rowArray: any = [];        
    dataPageResults?.map((listitem: any) => ( 
            rowArray.push({
                id: (randomId()), // unique row id
                disbursementId: listitem['DisbursementId'],
                enforcementFee: listitem['EnforcementFee'],
                fineAmount: listitem['FineAmount'],
                infringementNumber: listitem['InfringementNumber'],
                obligationNumber: listitem['ObligationNumber'],
                prnAmount: listitem['PrnAmount'],
                registrationFee: listitem['RegistrationFee'],
                totalPaid: listitem['TotalPaid'],                
            })
    ))
    console.log(rowArray); 
    return rowArray;
}

export const getSelectedRowIndex = async (customerTableData: any, rowId: string ) => {
    /* const caseSummaryObj = pConn().getCaseSummary();
    const caseSummaryContentObj = caseSummaryObj.content;
    const arrayOfCustomerList = caseSummaryContentObj.CustomerList2; */
    const selectedRowIndex = customerTableData.findIndex((row: any) => row.id === rowId);

    return(selectedRowIndex);
}
