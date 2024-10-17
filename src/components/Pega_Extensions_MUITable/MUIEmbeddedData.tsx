// @ts-nocheck
/* eslint-disable react/jsx-no-useless-fragment */
import {
 /*  DataGrid, */
  GridColDef,
  GridRowsProp,
  GridCellParams,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { DataGridPro, 
  DataGridProProps } from '@mui/x-data-grid-pro';
import { Input, 
  Button, 
  Flex,
  Modal, 
  Card,
  CardContent, 
  TextArea, 
  Checkbox } from '@pega/cosmos-react-core';

import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { styled } from '@mui/material/styles';
import { getDisbursementEmbeddedData } from './utils';


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
    paginationSizeProp: string;
}
const closeModal = 'closeModal';
const openModal = 'newNote';

function DetailPanelContent({ row: rowProp }: { row: Orders }) {
  console.log(rowProp);
  return (      
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      {/* First Order results child table */}
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">Detail</Typography>
              
        </Stack>
      </Paper>
    </Stack>
  );
}

export default function MUIEmbeddedData(props: Props) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { 
      embedDataPageProp,
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
  const [formContent, setFormContent] = useState({ BulkUpdateCommentsField: '', CheckboxIdSelectedRows: '', CheckboxIdUnSelectedRows: ''});  
  const [showModal, setShowModal] = useState(false); // Modal dialog related state
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Text and TextArea input element change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormContent({ ...formContent, [event.target.id]: event.target.value });    
  };

  //  Modal dialog window Checkbox selection event
  /* const handleCheckBoxSelection = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormContent({ ...formContent, [event.target.id]: event.target.value });    
  }; */
  

  const modalVisibility = (action: string) => {
    console.log('View Note Action: ', action);    
    if (action === openModal) {
      // setFormContent(getReadOnlyData(tableNotesData, pyGUID));
      setShowModal(true);
      console.log('Show Form Content: ', formContent);
    }
    if (action === closeModal) {
      setFormContent({ BulkUpdateCommentsField: '', CheckboxIdSelectedRows: '', CheckboxIdUnSelectedRows: '' });
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

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      // Check if its editable field      
      if (!params.isEditable) {
        console.log("non editable column is clicked, ignoring click handling....")
        return;
      }
      /* If checkbox is unselected by user, then comments field should show error indicator to be mandatory */
      /* if(params.field === '__check__' && params.formattedValue === 'yes') {        
        return { ...params.row.comments, error: true };
      } */
      // Check if the value has changed only then proceed to update the embed page
      if(event.target.value !== undefined) {
        console.log(event);
        const rSelected = params.row;
        const rId = params.row.id;
        const rField = params.field; 
        const rFieldValue = event.target.value;
        const indexOfRow = disbursementTableData.findIndex(obj => obj.id === rId);
        console.log(rSelected, rId, rField, rFieldValue, indexOfRow);
  
        // updateComments(indexOfRow, rFieldValue);
      }
      
      
      /* TODO : Call a function to update the comments inline edit */
      /* const disbursementObject = `${embedDataPageProp}[1]`;
      const cPageReference = `${pConnectProp().getPageReference()}.${disbursementObject}`;
      console.log("Page reference=", cPageReference);
      // Use the below code as workaround to bypass the bug in the product, INC to be raised
      pConnectProp()._pageReference = cPageReference;
      pConnectProp().getActionsApi().updateFieldValue('.comments', params.formattedValue, 
      {
        removePropertyFromChangedList: false,
        skipDirtyValidation: false
      }); */
    },    
    /* // eslint-disable-next-line react-hooks/exhaustive-deps */
    [disbursementTableData],
  );  
  /* eslint-enable @typescript-eslint/no-unused-vars */
  
  const refreshTableData = () => {      
    getDisbursementEmbeddedData(pConnectProp, embedDataPageProp).then(data => {                  
      setDisbursementTableData(data);
    }); 
  }

  const updateStore = (rowsToUpdate) => {    
    rowsToUpdate.forEach((row) => {
      console.log(row);
      const newCommentValue = row.comments;
      const rowId = row.id;
      const embeddedRowToBeUpdated = disbursementTableData.find((mainTableRow) => mainTableRow.id === rowId);
      const indexOfRow = disbursementTableData.findIndex(obj => obj.id === rowId);
      console.log(newCommentValue);
      console.log(rowId);
      console.log(embeddedRowToBeUpdated);
      updateComments(indexOfRow, newCommentValue);
    });
  }

  useEffect(() => {
    /* Retrieve embedded list of data page only once for the first time  */
    if(!disbursementTableData) {
      refreshTableData();
    }
    
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

  const bulkUpdateSelectedRows = () => {
    const selectedRowsData = getSelectedRows();
    console.log(selectedRowsData);
    updateStore(selectedRowsData);
  }

  const bulkUpdateAllRows = () => {
    // Read all the modal form data
    const commentsToUpdate = formContent.BulkUpdateCommentsField;
    const checkBoxSelectedState = formContent.CheckboxIdSelectedRows;
    const checkBoxUnSelectedState = formContent.CheckboxIdUnSelectedRows;
    console.log(commentsToUpdate);
    console.log(checkBoxSelectedState);
    console.log(checkBoxUnSelectedState);    

    // Default selection is all table rows
    let rowsToBeUpdated = disbursementTableData;
    if(checkBoxSelectedState === 'on') {
      rowsToBeUpdated = getSelectedRows();
    } 
    if(checkBoxUnSelectedState === 'on') {
      rowsToBeUpdated = getUnSelectedRows();
    }
    if(checkBoxSelectedState === 'on' && checkBoxUnSelectedState === 'on') {
      rowsToBeUpdated = disbursementTableData;
    }

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
    // TODO retrieve selection checkbox for unselected or selected rows    
    bulkUpdateAllRows();
    modalVisibility(closeModal); // Close the modal dialog after the update
  }

  
  const bulkUpdateUnSelectedRows = () => {  
    const unSelectedRowsData = getUnSelectedRows();
    console.log(unSelectedRowsData);
  }

  /* const bulkUpdateInModal = () => {  
    // TODO modal dialog 
  } */
  /* const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  ); */
  
  const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }) => <DetailPanelContent row={row} />, []);

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
        <StyledBox>
            <Flex container={{ direction: 'row' }}>
              <Button variant='secondary' onClick={bulkUpdateSelectedRows}>Bulk update selected rows</Button>
              <Input                  
                  id='BulkUpdateCommentsField'
                  type='text'
                  label='Comments'
                  labelHidden={false}                  
                  placeholder='Enter comments here for bulk update'
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleInputChange(e)
                  }
                  defaultValue={formContent.BulkUpdateComments}
                  status={undefined}
                  required={false}
                  disabled={false}
                  readOnly={false}                  
                />
                <Button variant='primary' onClick={bulkUpdateAllRows}>Bulk update</Button>
                <Button variant='secondary' onClick={bulkUpdateUnSelectedRows}>Bulk update Unselected rows</Button>
                <Button variant='secondary' onClick={refreshTableData}>Refresh embedded data</Button> 
                <Button variant='secondary' onClick={() => {                            
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
            /* onCellModesModelChange={handleCellModesModelChange} */
            /* onCellClick={handleCellClick}  */
            onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
              const activeSelectedRow = params.row;
              const activeSelectedRowId = params.row.id;
              const activeSelectedRowComment = event.target.value;
              const indexOfRow = disbursementTableData.findIndex(obj => obj.id === activeSelectedRowId);
              console.log(activeSelectedRow, activeSelectedRowId, activeSelectedRowComment, indexOfRow);
              updateComments(indexOfRow, activeSelectedRowComment);
              /* if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                event.defaultMuiPrevented = true;
              } */
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
                    <Checkbox           
                        id="CheckboxIdSelectedRows"             
                        info='Select this to update only for selected rows'                        
                        label='Selected rows only'   
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleInputChange(e)
                        }                                             
                      />
                      <Checkbox           
                        id="CheckboxIdUnSelectedRows"             
                        info='Select this to update only for un-selected rows'                        
                        label='Un-Selected rows only'   
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleInputChange(e)
                        }                                                         
                      />
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