// @ts-nocheck
/* eslint-disable react/jsx-no-useless-fragment */
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  /* GridCellModes, */
  /* GridCellModesModel, */
  GridCellParams,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
/* import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'; */
/* import { DataGridPro } from '@mui/x-data-grid-pro'; */

import { Input, Button, Flex } from '@pega/cosmos-react-core';

import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { styled } from '@mui/material/styles';
import { getDataPageResults, getDisbursementDataAsRowData } from './utils';


const StyledBox = styled('div')(({ theme }) => ({
  height: 300,
  width: '100%',
  '& .MuiDataGrid-cell--editing': {
    backgroundColor: 'rgb(255,215,115, 0.19)',
    color: '#1a3e72',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  },
  '& .Mui-error': {
    backgroundColor: 'rgb(255,18,28, 0.1)',
    color: theme.palette.error.main,
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgb(126,10,15, 0)',
    }),
  },
}));

type Props = {
    pConnectProp: any;
    dataPageProp?: string;
    embedDataPageProp?: string;
    paginationSizeProp: string;
}

export default function MUIMandatoryCell(props: Props) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { 
      dataPageProp,      
      embedDataPageProp,
      pConnectProp,
      paginationSizeProp,
  } = props;     
  const [disbursementTableData, setDisbursementTableData] = useState<GridRowsProp>([]);
  /* const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [selection, setSelection] = useState([]); */
  /* const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]); */
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  /* const [checkboxSelectionVisibleOnly, setCheckboxSelectionVisibleOnly] = useState(false); */
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);  
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [tableClass, setTableClass] = useState('');
  /* eslint-enable @typescript-eslint/no-unused-vars */

  

  const columns: GridColDef[] = [
    {
      field: 'isAccepted',
      headerName: 'Is Authorized?',
      type: 'boolean',
      width: 120,
      editable: true,
    },
    {
      field: 'comments',
      headerName: 'Comments',
      type: 'string',      
      width: 360,
      editable: true,
      preProcessEditCellProps: (params) => {
        const isAcceptedProps = params.otherFieldsProps!.isAccepted;
        const hasError = !isAcceptedProps.value && !params.props.value;
        return { ...params.props, error: hasError };
      },
    },
    { field: 'bty', headerName: 'Beneficiary type', width: 120, editable: false },
    { field: 'bnam', headerName: 'Beneficiary name', width: 120, editable: false },
    { field: 'bid', headerName: 'Beneficiary ID', width: 120, editable: false },    
    {
      field: 'amt',
      headerName: 'Amount',
      type: 'number',
      width: 120,
      editable: false,
    },
    { field: 'type', headerName: 'Type', width: 120, editable: false },    
    { field: 'did', headerName: 'Disbursement ID', width: 120, editable: false },    
    { field: 'bsts', headerName: 'Status', width: 120, editable: false },                    
  ];

  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }
      console.log(event);
      const rSelected = params.row;
      const rId = params.row.id;
      const rField = params.field; 
      console.log(rSelected, rId, rField);
      const disbursementObject = `DisbursementList[1]`;

      const cPageReference = `${pConnectProp().getPageReference()}.${disbursementObject}`;
      console.log("Page reference=", cPageReference);
      // Use the below code as workaround to bypass the bug in the product, INC to be raised
      pConnectProp()._pageReference = cPageReference;
      pConnectProp().getActionsApi().updateFieldValue('.comments', "Updated comments", 
        {
          removePropertyFromChangedList: false,
          /* contextPageReference: `${pConnectProp().getPageReference()}.${customerObject}`, */
          skipDirtyValidation: false
        }  );

      // Ignore portal
     /*  if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      } */
/* 
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
      }); */
    },
    [pConnectProp],
  );

  /* const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  );  */
  
useEffect(() => {
  /* Retrieve records from data page directly */
  getDataPageResults(pConnectProp, dataPageProp).then(data => {    
    setTableClass(data[0].pxObjClass);
    const tempTable = getDisbursementDataAsRowData(data);              
    setDisbursementTableData(tempTable);
  });
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

/* const handleBulkUpdateComments = () => {
  setRows((prevRows) => [...prevRows, createRandomInstallOrderRow()]);  
}; */

const displayAllSelectedRows = () => {
  const selectedRowsData = rowSelectionModel.map((id) => disbursementTableData.find((row) => row.id === id));
  console.log(selectedRowsData);
}
const displayAllUnSelectedRows = () => {  
  const excludeList = new Set(rowSelectionModel);
  const unSelectedRowsData = disbursementTableData.filter(e => !excludeList.has(e.id));  
  console.log(unSelectedRowsData);
}
const openModalDialog = () => {
  /* pConnectProp()
  .getActionsApi()
  .showDataObjectCreateView(tableClass)
  .then(() => {})
  .catch(error => {
    // showDataObjectCreateView failure handling
    console.log('showDataObjectCreateView failed: ', error);
  });
 */
  pConnectProp().getActionsApi().openEmbeddedDataModal('Create', pConnectProp(), 'DisbursementList[0].Comments', 1, 'EDIT').then(() => {
    // openEmbeddedDataModal success handling
   }).catch(() => {
    // openEmbeddedDataModal failure handling
   })
}

/* const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => disbursementTableData.find((row) => row.id === id));
  console.log(selectedRowsData);
  setRowSelectionModel(selectedRowsData);
  setSelectedRows(selectedRowsData);
  console.log(rowSelectionModel);
  console.log(selectedRows);
}; */

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
        <StyledBox>
            <Flex container={{ direction: 'row' }}>
              <Button variant='primary' onClick={openModalDialog}>Modal dialog</Button>
              <Button variant='secondary' onClick={displayAllSelectedRows}>Bulk update selected rows</Button>
              <Input                  
                  id='bulk-input'
                  type='text'
                  label='Comments'
                  labelHidden={false}                  
                  placeholder='Enter comments here for bulk update'
                  status={undefined}
                  required={false}
                  disabled={false}
                  readOnly={false}                  
                />
                <Button variant='secondary' onClick={displayAllUnSelectedRows}>Bulk update Unselected rows</Button>
            </Flex>
          <DataGrid 
            rows={disbursementTableData} 
            columns={columns}           
            checkboxSelection 
            onCellClick={handleCellClick}                                   
            /* initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: paginationSizeProp },
              },
            }}
            pageSizeOptions={[0]}                        */
            /* onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}   */
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              console.log(rowSelectionModel);
            }}                            
            rowSelectionModel={rowSelectionModel}
          />             
        </StyledBox>
        </div>
    </>
  )
}