/* eslint-disable react/jsx-no-useless-fragment */
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRowModel,
} from '@mui/x-data-grid';

import { useEffect, useState, useCallback } from "react";
import { inspectCaseSummaryAndReturnList } from './utils';
import React from 'react';

const columns: GridColDef[] = [
  /* { field: 'id', headerName: 'ID', width: 70 }, */
  { field: 'FirstName', headerName: 'First name', width: 130, editable: true },
  { field: 'LastName', headerName: 'Last name', width: 130, editable: true },
  { field: 'DataOfBirth', headerName: 'Date of birth', width: 100, type: 'dateTime', editable: true },  
];

type Props = {
    pConnectProp: any;
    dataPageProp: string;
}

export default function MUIEditableCustomerList(props: Props) {
  const { 
      dataPageProp,
      pConnectProp
  } = props; 
  const [customerTableData, setCustomerTableData] = useState([]);
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  /* const actions = pConnectProp.getActionsApi(); */

  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {},
              ),
            }),
            {},
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {},
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    [],
  );

  const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  );

  const processRowUpdate = useCallback(
    (newRow: GridRowModel) => {
      /* const rowIndex = getSelectedRowIndex(customerTableData, newRow.id); */
      const selectedRowIndex = customerTableData.findIndex((row: any) => row.id === newRow.id)
      console.log("RowIndex=", selectedRowIndex);
      const customerObject = `CustomerList2[${selectedRowIndex}]`;
      console.log("CustomerObject with index=", customerObject);
      const cPageReference = `${pConnectProp().getPageReference()}.${customerObject}`;
      console.log("Page reference=", cPageReference);
      // Make the HTTP request to save in the backend    
      
      // Use the below code as workaround to bypass the bug in the product, INC to be raised
      pConnectProp()._pageReference = cPageReference;

      /* pConnectProp().getActionsApi().updateFieldValue('.FirstName', 'test edited', 
        {pageReference:`${pConnectProp().getPageReference()}.${customerObject}`, isArrayDeepMerge: true}); */
        pConnectProp().getActionsApi().updateFieldValue('.FirstName', newRow.FirstName, 
          {
            removePropertyFromChangedList: false,
            /* contextPageReference: `${pConnectProp().getPageReference()}.${customerObject}`, */
            skipDirtyValidation: false
          }  );
            

      /* const PCore = (window as any).PCore;
      PCore.getStateUtils().updateState(pConnectProp().getContextName(), 
        customerObject, {
              FirstName: newRow.FirstName, 
              LastName: newRow.LastName,
              DateOfBirth: newRow.DataOfBirth
        }, 
        {pageReference:pConnectProp().getPageReference(), isArrayDeepMerge: true});  */
      return newRow;
    },
    [customerTableData, pConnectProp],
  );

// Code below is a sample code on how to update the list object values
/*   PCore.getStateUtils().updateState("app/primary_1/workarea_2", 
    "CustomerList2[1]", {
         FirstName:"ConsoleTest", 
          LastName:"ConsoleLast",
          CustomerPhoto: "https://www.gstatic.com/webp/gallery/1.jpg",
          DateOfBirth: "2024-05-08"
        
    }, 
    {pageReference:"caseInfo.content", isArrayDeepMerge: true}); */

  useEffect(() => {
    inspectCaseSummaryAndReturnList(pConnectProp, dataPageProp).then(data => {                  
        /* setCustomerTableData(getMUICustomerListRowValues(data));             */
        setCustomerTableData(data);
      }); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid                     
            rows={customerTableData}       
            columns={columns}            
            processRowUpdate={processRowUpdate}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModesModelChange}
            onCellClick={handleCellClick}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
    </>
  )
}