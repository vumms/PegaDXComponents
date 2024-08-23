import { randomId } from '@mui/x-data-grid-generator';

/* Function to retrieve datapage list */
export const getDataPageResults = async (pConn: any, paramDataPage: string ) => {
    const PCore = (window as any).PCore;    
    const context = pConn().getContextName();

    try {
        const getData = await PCore.getDataPageUtils().getDataAsync(paramDataPage, context);
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
        const caseSummaryObj = pConn().getCaseSummary();
        const caseSummaryContentObj = caseSummaryObj.content;
        console.log(caseSummaryContentObj);

        /* const arrayOfCustomerList = caseSummaryContentObj.find((content: any) => content[0] === tempListName);
        console.log(arrayOfCustomerList);

        const arrList: any = [];
        arrayOfCustomerList.map((customerList :any) => ( arrList.push(customerList)));
        console.log(arrList); */
        const arrayOfCustomerList = caseSummaryContentObj.CustomerList2;

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

export const getSelectedRowIndex = async (customerTableData: any, rowId: string ) => {
    /* const caseSummaryObj = pConn().getCaseSummary();
    const caseSummaryContentObj = caseSummaryObj.content;
    const arrayOfCustomerList = caseSummaryContentObj.CustomerList2; */
    const selectedRowIndex = customerTableData.findIndex((row: any) => row.id === rowId);

    return(selectedRowIndex);
}
