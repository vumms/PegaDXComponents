// @ts-nocheck
/* eslint-disable react/jsx-no-useless-fragment */
import {
  GridColDef,
  GridRowsProp,    
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { DataGridPro,   
  DataGridProProps } from '@mui/x-data-grid-pro';
import { 
  Button, 
  Flex,  
  RadioButtonGroup,
  RadioButton,
  Modal,   
  Card,
  CardContent, 
  TextArea, 
  Table,
  /* Checkbox */ } from '@pega/cosmos-react-core';
/*   import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'; */

import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { styled } from '@mui/material/styles';
  /* eslint-disable @typescript-eslint/no-unused-vars */
import { getDisbursementEmbeddedData, getDataPageResults, getDisbursementDataAsRowData } from './utils';
import { randomId } from '@mui/x-data-grid-generator';
import { Paper, Stack } from '@mui/material';


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
    embedDataPageProp?: string;    
    dataPageProp: string;
    prefillProp: string; 
    paginationSizeProp: string;
}
const closeModal = 'closeModal';
const openModal = 'newNote';

function DetailPanelContent({ row: rowProp }: { row: Orders }) {
  console.log(rowProp);    
  /* const tableColumns = [
    { renderer: 'item', label: 'Item' },
    { renderer: 'amt', label: 'Amount' },
  ];   */
  return (    
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '50%', p: 1 }}>
          <Stack direction="column" spacing={1} sx={{ height: 1 }}>
            {/* <DataGrid
                density="compact"            
                columns={[
                  { field: 'item', headerName: 'Item', flex: 0.5, minWidth: 150, },
                  { field: 'amt', headerName: 'Amount', type: 'number', flex: 0.2, minWidth: 150 },                    
                ]}
                rows={rowProp.detailsData}        
                sx={{ flex: 1 }}
                hideFooter
              />      */}        
              <Table
                title='Breakdown of amount'
                hoverHighlight='false'                
                data={rowProp.detailsData}
                columns={[
                  { renderer: 'item', label: 'Item' },
                  { renderer: 'amt', label: 'Amount' },
                ]}
              />       
        </Stack>
      </Paper>
    </Stack>
  );
   
}

export default function MUIEmbeddedData(props: Props) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { 
      embedDataPageProp,
      prefillProp,
      dataPageProp,
      pConnectProp,
      paginationSizeProp,
  } = props;     
  const [disbursementTableData, setDisbursementTableData] = useState<GridRowsProp>([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);  
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [tableClass, setTableClass] = useState('');  
  const [pageRef, setPageRef] = useState('');
  const [formContent, setFormContent] = useState({ BulkUpdateCommentsField: '', 
                                                  CheckboxIdSelectedRows: '', 
                                                  CheckboxIdUnSelectedRows: '',
                                                  rbRowSelection: '',
                                                });  
  const [showModal, setShowModal] = useState(false); // Modal dialog related state
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Text and TextArea input element change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormContent({ ...formContent, [event.target.id]: event.target.value });    
  };

  const modalVisibility = (action: string) => {
    console.log('View Note Action: ', action);    
    if (action === openModal) {
      // setFormContent(getReadOnlyData(tableNotesData, pyGUID));
      setShowModal(true);
      console.log('Show Form Content: ', formContent);
    }
    if (action === closeModal) {
      setFormContent({ BulkUpdateCommentsField: '', 
        CheckboxIdSelectedRows: '', 
        CheckboxIdUnSelectedRows: '',  
        rbRowSelection: ''
       });
      setShowModal(false);
      console.log('Hide Form Content: ', formContent);
    }
  };

  const updateComments = async (rowIndex: number, newComment: string) => {    
    const embedObject = `${embedDataPageProp}[${rowIndex}]`;    
    const embedPageReference = `${pageRef}.${embedObject}`;
    console.log("Page reference=", embedPageReference);
    try {    
      // Use the below code as workaround to bypass the bug in the product, INC to be raised
      pConnectProp()._pageReference = embedPageReference;
      pConnectProp().getActionsApi().updateFieldValue('.Comment', newComment, 
      {
        removePropertyFromChangedList: false,
        skipDirtyValidation: false
      });
      // Reset page reference back to original reference
      pConnectProp()._pageReference = pageRef;
    } catch (error) {
      console.log(error);
    } 
  }

  const columns: GridColDef[] = [
    /* {
      field: 'isAccepted',
      headerName: 'Is Authorized?',
      type: 'boolean',
      width: 120,
      editable: true,
    }, */
    {
      field: 'comments',
      headerName: 'Comments',
      type: 'string',      
      width: 360,
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        // Check if the row is selected only then check for empty comments field of the row
        if(rowSelectionModel.find((sRow) => sRow === params.id) == undefined) {
            const hasError = params.props.value.length == 0; // Empty comments check
            return { ...params.props, error: hasError };
          }   
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

  // Fetch embedded data from the case summary content
  const refreshTableData = () => {      
    // Below method call directly reads from the embedded data page
    getDisbursementEmbeddedData(pConnectProp, embedDataPageProp).then(data => {                  
      setDisbursementTableData(data);
    });

    // Below call reads from directly data page
    /* let dataPageParam = prefillProp; 
    if(!prefillProp) { // If prefill is null, then get it from the dataPage props
      dataPageParam = dataPageProp;
    } */
   // Below method will fetch directly from the data page 
   /*  getDataPageResults(pConnectProp, dataPageProp).then(data => {                  
      setDisbursementTableData(getDisbursementDataAsRowData(data));
    });  */
  }

  useEffect(() => {
    /* TODO: Do I need to check if the table is empty or can I load the data
        Retrieve embedded list of data page only once for the first time  */
    refreshTableData();
    
    
    // Set the page reference only once if its empty or undefined  
    if(!pageRef) {
      setPageRef(pConnectProp().getPageReference());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelectedRows = () => {
    const selectedRowsData = rowSelectionModel.map((id) => disbursementTableData.find((row) => row.id === id));
    return (selectedRowsData);
  }

  const getUnSelectedRows = () => {
    const excludeList = new Set(rowSelectionModel);
    const unSelectedRowsData = disbursementTableData.filter(e => !excludeList.has(e.id));  
    return (unSelectedRowsData);
  }

  const bulkUpdateAllRows = () => {
    // Read all the modal form data
    const commentsToUpdate = formContent.BulkUpdateCommentsField;
    /* const checkBoxSelectedState = formContent.CheckboxIdSelectedRows;
    const checkBoxUnSelectedState = formContent.CheckboxIdUnSelectedRows; */   

   /*  console.log(commentsToUpdate);
    console.log(checkBoxSelectedState);
    console.log(checkBoxUnSelectedState);     */   

    // Default selection is all table rows
    let rowsToBeUpdated = disbursementTableData;
   /* if(checkBoxSelectedState === 'on') {
      rowsToBeUpdated = getSelectedRows();
    } 
    if(checkBoxUnSelectedState === 'on') {
      rowsToBeUpdated = getUnSelectedRows();
    }
    if(checkBoxSelectedState === 'on' && checkBoxUnSelectedState === 'on') {
      rowsToBeUpdated = disbursementTableData;
    } */
    // Radio button selection 
    /* if(formContent.rbAllRows === 'on') {
      rowsToBeUpdated = disbursementTableData;
    }  */
    if(formContent.rbSelRows === 'on') {
      rowsToBeUpdated = getSelectedRows();
    } 
    if(formContent.rbUnSelRows === 'on') {
      rowsToBeUpdated = getUnSelectedRows();
    } 

    // Update the comments to all the rows
    rowsToBeUpdated.forEach((row) => {
      console.log(row);
      const newCommentValue = commentsToUpdate;
      const rowId = row.id;
      const embeddedRowToBeUpdated = disbursementTableData.find((mainTableRow) => mainTableRow.id === rowId);
      const indexOfRow = disbursementTableData.findIndex(obj => obj.id === rowId);
      console.log(newCommentValue);
      console.log(rowId);
      console.log(embeddedRowToBeUpdated);
      updateComments(indexOfRow, newCommentValue);
    });
    refreshTableData();
  }

  const bulkUpdateFromModal = () => {
    bulkUpdateAllRows();
    modalVisibility(closeModal); // Close the modal dialog after the update
  }
 
  const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }) => <DetailPanelContent row={row} />, []);

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
        <StyledBox>
            <Flex container={{ direction: 'row' }}>                                       
                <Button variant='secondary' onClick={refreshTableData}>Refresh embedded data</Button> 
                <Button variant='primary' onClick={() => {                            
                            modalVisibility(openModal);
                          }} >Bulk update modal</Button>    
            </Flex>
            <DataGridPro 
              rows={disbursementTableData} 
              columns={columns}           
              checkboxSelection 
              disableRowSelectionOnClick
              getDetailPanelHeight={() => 'auto'}
              getDetailPanelContent={getDetailPanelContent}
              onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
                const activeSelectedRow = params.row;
                const activeSelectedRowId = params.row.id;
                const activeSelectedRowComment = event.target.value;
                const indexOfRow = disbursementTableData.findIndex(obj => obj.id === activeSelectedRowId);
                console.log(activeSelectedRow, activeSelectedRowId, activeSelectedRowComment, indexOfRow);
                updateComments(indexOfRow, activeSelectedRowComment);
              }}   
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
                console.log(rowSelectionModel);
              }}                            
              rowSelectionModel={rowSelectionModel}
            />
            {showModal && (
              <Modal              
                heading="Bulk update modal dialog"
                onRequestDismiss={() => modalVisibility(closeModal)}
              >
                <Card>
                  <CardContent>
                    <form>                    
                      <TextArea
                        label='Enter comments for bulk update'
                        name='bulkUpdateCommentsField'                      
                        defaultValue={formContent.BulkUpdateCommentsField}
                        id="BulkUpdateCommentsField"
                        required='true'     
                        resizable='true'                                                             
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleInputChange(e)
                        }
                      />                      
                      <RadioButtonGroup                        
                        label='Select one to bulk update comments?'
                        name='typeOfUpdate'                                                                                                                        
                        info='Select one of the above item to update the comments'
                        onClick={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleInputChange(e)
                        }                               
                      >
                        <RadioButton label='All rows' id='rbAllRows' defaultChecked />
                        <RadioButton label='Selected rows' id='rbSelRows' />
                        <RadioButton label='Un-Selected rows' id='rbUnSelRows' />
                      </RadioButtonGroup>
                      {/* <Checkbox           
                          id="CheckboxIdSelectedRows"             
                          info='Select this option to update only for selected rows'                        
                          label='Selected rows only'   
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            handleInputChange(e)
                          }                                             
                        />
                        <Checkbox           
                          id="CheckboxIdUnSelectedRows"             
                          info='Select this option to update only for un-selected rows'                        
                          label='Un-Selected rows only'   
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            handleInputChange(e)
                          }                                                         
                        /> */}
                      <Button variant='secondary' onClick={() => { 
                          bulkUpdateFromModal();                                                   
                        }} >Update</Button>  
                      <Button variant='secondary' onClick={() => {                                                    
                          modalVisibility(closeModal);
                        }} >Close</Button>  
                    </form>
                  </CardContent>
                </Card>
              </Modal>
            )}             
        </StyledBox>
        </div>
    </>
  )
}