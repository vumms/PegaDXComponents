// @ts-nocheck
import {
  GridColDef,
  GridRowsProp,    
  GridRowSelectionModel, 
  GridCallbackDetails, 
  GridRowId,    
  useGridApiRef,
} from '@mui/x-data-grid';
import { DataGridPro,   
  DataGridProProps } from '@mui/x-data-grid-pro'; 
import { 
  Button, 
  /* ComboBox, */
  Flex,  
  RadioButtonGroup,
  RadioButton,
  Modal,   
  Card,  
  CardContent, 
  TextArea, 
  Table,
  useModalManager,
  useModalContext,  
  /* Checkbox */ } from '@pega/cosmos-react-core';
/*   import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'; */

import { useEffect, useMemo, useState, useCallback } from "react";
// import { styled } from '@mui/material/styles';
  /* eslint-disable @typescript-eslint/no-unused-vars */
import { getDisbursementEmbeddedData, 
        getDataPageResults, 
        getDisbursementDataAsRowData, 
        findUniqueId,         
        // findRowDetailById,        
        isUserSelectedRowCommentsEmpty,
       } from './utils';

import { randomId } from '@mui/x-data-grid-generator';
import { Box, Paper, Stack } from '@mui/material';

import {  StyledBox, StyledWrapper } from './styles';

/* const StyledBox = styled('div')(({ theme }) => ({
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
})); */

type Props = {
    pConnectProp: any;
    embedDataPageProp?: string;    
    dataPageProp: string;
    prefillProp: string; 
    paginationSizeProp: string;
    commentsDataPageProp: string;
}
/* const closeModal = 'closeModal';
const openModal = 'newNote'; */
const openBulkUpdateModal = 'openBulkUpdateModal';
const closeBulkUpdateModal = 'closeBulkUpdateModal';

function DetailPanelContent({ row: rowProp }: { row: Orders }) {
  console.log(rowProp);    
  return (    
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '50%', p: 1 }}>
          <Stack direction="column" spacing={1} sx={{ height: 1 }}>            
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
 
const ShowViewMoreDetailModal = ( props ) => {
  console.log(props.selectedRowsData);    
  const { dismiss } = useModalContext();

  const actions = useMemo(() => {
    return (
      <>
        <Button
          onClick={() => {              
            dismiss();              
          }}
        >
          Close
        </Button>
       {/*  <Button variant='primary' onClick={dismiss}>
          Save
        </Button> */}
      </>
    );
  }, [dismiss]);

  return (      
    <Modal
      actions={actions}
      autoWidth={false}
      stretch={false}
      center={false}  
      heading='View details modal'   
      id='rowDetailModal'
    >
      <Card>
        <CardContent>
          <form>    
            <Flex container={{ direction: 'column', gap: 1 }}>                        
              <Table
                title='Breakdown of amount'
                hoverHighlight='false'                
                data={props.selectedRowsData?.detailsData}
                columns={[
                  { renderer: 'item', label: 'Item' },
                  { renderer: 'amt', label: 'Amount' },
                ]}
              />      
            </Flex>                  
          </form>
        </CardContent>
      </Card>
    </Modal> 
    
  );   
}

const ShowBulkUpdateModalDialog = ( props ) => {
  console.log(props);    
  const { dismiss } = useModalContext();
  // TODO below const to be revisited
  const [modalFormContent, setModalFormContent] = useState({ BulkUpdateCommentsField: '',     
    rbRowSelection: '',
  });  

  // Modal action buttons function
  const actions = useMemo(() => {

    // Function to update comments using pConnect API
    /* const updateComments = async (rowIndex: number, newComment: string) => {    
      const embedObject = `${props.embedDataPageProp}[${rowIndex}]`;    
      const embedPageReference = `${props.pageRef}.${embedObject}`;
      console.log("Page reference=", embedPageReference);
      try {    
        // Use the below code as workaround to bypass the bug in the product, INC to be raised
        props.pConnectProp()._pageReference = embedPageReference;
        props.pConnectProp().getActionsApi().updateFieldValue('.Comment', newComment, 
        {
          removePropertyFromChangedList: false,
          skipDirtyValidation: false
        });
        // Reset page reference back to original reference
        props.pConnectProp()._pageReference = props.pageRef;
        // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
        props.disbursementTableData[rowIndex].comments = newComment;          
      } catch (error) {
        console.log(error);
      } 
    } */

    // Function called to collect required information before updating REDUX store
    const updateTableRows = () => {
      // Read all the modal form data
      const commentsToUpdate = modalFormContent.BulkUpdateCommentsField;
      // Default selection is all table rows
      let rowsToBeUpdated = props.disbursementTableData;
      if(modalFormContent.rbSelRows === 'on') {
        rowsToBeUpdated = props.selectedRowsParam;
      } 
      if(modalFormContent.rbUnSelRows === 'on') {
        rowsToBeUpdated = props.unSelectedRowsParam;
      } 
  
      // Update the comments to all the rows
      rowsToBeUpdated.forEach((row) => {      
        const newCommentValue = commentsToUpdate;
        const rowId = row.id;
        const indexOfRow = props.disbursementTableData.findIndex(obj => obj.id === rowId);
        console.log('Row to be updated=', row);
        console.log('New comments=', newCommentValue);
        console.log('RowId to be updated=', rowId);
        props.updateComments(indexOfRow, newCommentValue);
        // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
        // props.disbursementTableData[indexOfRow].comments = newCommentValue;              
        console.log("Successfully updated row");
      });
      props.refreshTableData();
      dismiss(); // Close the window
    }
    return (
      <>
        <Button
          onClick={() => {              
            dismiss();  // Close the window            
          }}
        >
          Close
        </Button>
        <Button variant='primary' onClick={updateTableRows} disabled={modalFormContent.BulkUpdateCommentsField === ''}>
          Update
        </Button>
      </>
    );
  }, [dismiss, modalFormContent, props]
);

  // Text and TextArea input element change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setModalFormContent({ ...modalFormContent, [event.target.id]: event.target.value });    
  };

  return ( 
    <Modal           
      actions={actions}
      autoWidth={false}
      stretch={false}
      center={false}  
      heading='Bulk update modal'   
      id='bulkUploadModalId'                   
     >
      <Card>
        <CardContent>
          <form>                    
            <TextArea
              label='Enter comments for bulk update'
              name='bulkUpdateCommentsField'                      
              defaultValue={modalFormContent.BulkUpdateCommentsField}
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
          </form>
        </CardContent>
      </Card>
    </Modal>     
  );   
}

// Explicity button action call this function
const MoreDetailsModal = ( selectedRowsData ) => {
  /* const [name, setName] = useState(''); */
  // const { create } = useModalManager();
  const { dismiss } = useModalContext();

  const actions = useMemo(() => {
    return (
      <>
        <Button
          onClick={() => {              
            dismiss();              
          }}
        >
          Close
        </Button>
        <Button variant='primary' onClick={dismiss}>
          Save
        </Button>
      </>
    );
  }, [dismiss]);
  

  return (
    <Modal
      actions={actions}
      heading='Test modal'
      autoWidth={false}
      center={false}
      stretch={false} 
      /* onRequestDismiss={() => {
        if (name !== '') {
          create(MyAlert, { closeInitialModal: dismiss }, { alert: true });
          return false;
        }
      }} */
    >
      <Card>
        <CardContent>
          <form>    
            <TextArea
              label='Enter comments '
              name='TestField'                                    
              id="TestField"
              required='true'     
              resizable='true'                                                             
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        handleInputChange(e)
                        }
              >
              </TextArea>    
              <Button variant='secondary' onClick={() => {                                                    
                modalVisibility(closeBulkUpdateModal);
              }} >Close</Button>                
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default function MUIEmbeddedData(props: Props) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { 
      embedDataPageProp,
      prefillProp,
      dataPageProp,
      pConnectProp,
      paginationSizeProp,
      commentsDataPageProp,
  } = props;       
  const [disbursementTableData, setDisbursementTableData] = useState<GridRowsProp>([]);  
  const [commentsListData, setCommentsListData] = useState([]);
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
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false); // Modal dialog for bulk update state 
  const { create } = useModalManager(); // Modal dialog based 
  const apiRef = useGridApiRef();
  const paginationSize = Number(paginationSizeProp);
  // const { dismiss } = useModalContext();

  /* eslint-enable @typescript-eslint/no-unused-vars */

  

  const testingModalManager = () => {
    create(MoreDetailsModal, { ...props });
  }

  // Text and TextArea input element change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormContent({ ...formContent, [event.target.id]: event.target.value });    
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
      // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
      disbursementTableData[rowIndex].comments = newComment;       
    } catch (error) {
      console.log(error);
    } 
  }

  const updateSelect = async (rowIndex: number, selectState: boolean) => {    
    const embedObject = `${embedDataPageProp}[${rowIndex}]`;    
    const embedPageReference = `${pageRef}.${embedObject}`;
    console.log("Page reference=", embedPageReference);
    try {    
      // Use the below code as workaround to bypass the bug in the product, INC to be raised
      pConnectProp()._pageReference = embedPageReference;
      pConnectProp().getActionsApi().updateFieldValue('.Select', selectState, 
      {
        removePropertyFromChangedList: false,
        skipDirtyValidation: false
      });
      // Reset page reference back to original reference
      pConnectProp()._pageReference = pageRef;
      // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
      disbursementTableData[rowIndex].select = selectState;       
    } catch (error) {
      console.log(error);
    } 
  }

  
  const handleViewDetailsClick = (id: GridRowId) => () => {
    console.log(id);    
    const selectedRowsData = disbursementTableData.find((row) => row.id === id.toString());  
    create(ShowViewMoreDetailModal, { ...props, selectedRowsData });
    
    /* create (
      Modal,
      {
        autoWidth: false,
        stretch: false,
        center: false,
        dismissible: false,        
        heading: 'View details modal window',      
        children: getViewMoreDetailModalContent(selectedRowsData),
        id: 'viewDetailModal',        
      }
    ); */
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

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
    { 
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [          
          <Button variant='link'
            onClick={handleViewDetailsClick(id)}
          >
            View details
          </Button>,          
        ];
      }
    },                    
  ];

  // Fetch embedded data from the case summary content
  const refreshTableData = useCallback(() => {    
    // Below method call directly reads from the embedded data page
    getDisbursementEmbeddedData(pConnectProp, embedDataPageProp).then(data => {                  
      setDisbursementTableData(data);
    });   
    /* if(disbursementTableData) {
      console.log("disbursementTableData is Empty");
      
    } else {
      console.log("disbursementTableData is NOT Empty, refreshing from state");
      setDisbursementTableData(disbursementTableData);
    } */
    

    // Read the Comments DP list     
    /* getDataPageResults(pConnectProp, commentsDataPageProp).then(data => {
      setCommentsListData(data);
    }) */
    // Below call reads from directly data page
    /* let dataPageParam = prefillProp; 
    if(!prefillProp) { // If prefill is null, then get it from the dataPage props
      dataPageParam = dataPageProp;
    } */
   // Below method will fetch directly from the data page 
   /*  getDataPageResults(pConnectProp, dataPageProp).then(data => {                  
      setDisbursementTableData(getDisbursementDataAsRowData(data));
    });  */
  }, [pConnectProp, embedDataPageProp])


  const modalVisibility = (action: string) => {
    console.log('View Note Action: ', action);    
    /* if (action === openModal) {      
      setShowModal(true);
      console.log('Show Form Content: ', formContent);
    } */
    if (action === openBulkUpdateModal) {      
      setShowBulkUpdateModal(true); // TODO might have to remove this      
      console.log('Show bulk update modal and its Form Content: ', formContent);
    }
    if (action === closeBulkUpdateModal) {
      setFormContent({ BulkUpdateCommentsField: '', 
        CheckboxIdSelectedRows: '', 
        CheckboxIdUnSelectedRows: '',  
        rbRowSelection: ''
       });
      setShowBulkUpdateModal(false);      
      console.log('Hide bulk upload modal Form Content: ', formContent);
    }
    /* if (action === closeModal) {
      setFormContent({ BulkUpdateCommentsField: '', 
        CheckboxIdSelectedRows: '', 
        CheckboxIdUnSelectedRows: '',  
        rbRowSelection: ''
       });
      setShowModal(false);      
      console.log('Hide Form Content: ', formContent);
    } */
  };

  useEffect(() => {
    /* TODO: Do I need to check if the table is empty or can I load the data
        Retrieve embedded list of data page only once for the first time  */
    refreshTableData();
    
    
    // Set the page reference only once if its empty or undefined  
    if(!pageRef) {
      setPageRef(pConnectProp().getPageReference());
    }    
  }, [pConnectProp, pageRef, embedDataPageProp, refreshTableData]);

  const getSelectedRows = () => {
    const selectedRowsData = rowSelectionModel.map((id) => disbursementTableData.find((row) => row.id === id));
    return (selectedRowsData);
  }

  const getUnSelectedRows = () => {
    const excludeList = new Set(rowSelectionModel);
    const unSelectedRowsData = disbursementTableData.filter(e => !excludeList.has(e.id));  
    return (unSelectedRowsData);
  }
  
  const handleOpenBulkUpdateClick = () => {
    const selectedRowsParam = getSelectedRows();
    const unSelectedRowsParam = getUnSelectedRows();
    create(ShowBulkUpdateModalDialog, { ...props, selectedRowsParam, unSelectedRowsParam, disbursementTableData, pageRef, updateComments, refreshTableData });
    // refreshTableData(); // Refresh the table data to show updated values
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
      const newCommentValue = commentsToUpdate;
      const rowId = row.id;
      // const embeddedRowToBeUpdated = disbursementTableData.find((mainTableRow) => mainTableRow.id === rowId);
      const indexOfRow = disbursementTableData.findIndex(obj => obj.id === rowId);
      console.log('Row to be updated=', row);
      console.log('New comments=', newCommentValue);
      console.log('RowId to be updated=', rowId);
      // console.log(embeddedRowToBeUpdated);
      updateComments(indexOfRow, newCommentValue);
      // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
      // disbursementTableData[indexOfRow].comments = newCommentValue;      
      console.log("Successfully updated row");
    });    
    refreshTableData();  
  }

  const bulkUpdateFromModal = () => {
    bulkUpdateAllRows();
    modalVisibility(closeBulkUpdateModal); // Close the bulk update modal dialog after the update
    // showBulkUpdateModal(false);
  }

  const updateSelectState = (selectedRowIds: any) => {
    console.log(selectedRowIds);
    if(selectedRowIds.length > 0) {
      // loop thru all the selectedRowIds to update the select value to true
      selectedRowIds.forEach((rowId) => { 
        const indexOfRow = disbursementTableData.findIndex(obj => obj.id === rowId);
        updateSelect(indexOfRow, true); 
      })
    } else {
      // loop thru entire disbursementTable table rows and update the select value to false
      disbursementTableData.forEach((row) => { 
        // update select state for the row id
        const indexOfRow = disbursementTableData.findIndex(obj => obj.id === row.id);
        updateSelect(indexOfRow, false); 
      })
    }    
    console.log("After state update=", disbursementTableData);
  }

  
const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }) => <DetailPanelContent row={row} />, []);

  return (        
      <StyledWrapper>
      {/* <div style={{ height: 400, width: '100%' }}> */}
        <StyledBox>
            <Flex container={{ direction: 'row', gap: 1, pad: 1 }}>                                       
                <Button variant='secondary' onClick={refreshTableData}>Refresh embedded data</Button> 
                <Button variant='primary' onClick={() => {                            
                            modalVisibility(openBulkUpdateModal);
                          }} >Bulk update modal using single modal dialog</Button>    
                <Button variant='primary' onClick={() => {                            
                            handleOpenBulkUpdateClick();
                          }} >Bulk update modal using multi modal dialog</Button>    

                <Button variant='secondary' onClick={() => {                            
                            testingModalManager();
                          }} >Test ModalManager</Button>                              
            </Flex>
            <Box sx={{ height: 370, width: '100%' }}>
              <DataGridPro
                rows={disbursementTableData} 
                columns={columns}   
                pagination
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } }, // TODO paginationSizeProp to be used here, there is some warning and error generated when props are used
                }}
                pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}      
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
                onRowSelectionModelChange={(newRowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
                  // TODO
                  // If newRowSelectionModel is Empty { Set all disbursement table rows select value to false }
                  // else { set all selected rows id relevant disbursement table rows select value to true }
                  updateSelectState(newRowSelectionModel); // Update row select status
                  setRowSelectionModel(newRowSelectionModel);                  
                  console.log(details);
                  console.log("SelectedRows=", rowSelectionModel, " Newly selected rows=", newRowSelectionModel);
                  console.log('isRowSelectable=', details.api.isRowSelectable(), ' isRowSelected=', details.api.isRowSelected());
                  // Check if the comments field is empty 
                  console.log(apiRef);
                  const userSelectedRowId = findUniqueId(newRowSelectionModel, rowSelectionModel);
                  const userSelectedRow = details.api.getRow(userSelectedRowId);
                  // if(isUserSelectedRowCommentsEmpty(newRowSelectionModel, rowSelectionModel, disbursementTableData)) {
                  if(userSelectedRow?.comments) {
                    console.log("Comments not empty");
                  } else {
                    console.log("Comments empty"); 
                  }
                  // disbursementTableData[4].comments = {...disbursementTableData[4].comments, error: false};
                  console.log(rowSelectionModel);
                }}                            
                rowSelectionModel={rowSelectionModel}                
              />
            </Box>
          {showBulkUpdateModal && (
              <Modal              
                heading="Bulk update modal dialog"
                onRequestDismiss={() => modalVisibility(closeBulkUpdateModal)}
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
                      <Button variant='primary' onClick={() => { 
                          bulkUpdateFromModal();                                                   
                        }} disabled={'BulkUpdateCommentsField' === ''}>Update</Button>  
                      <Button variant='secondary' onClick={() => {                                                    
                          modalVisibility(closeBulkUpdateModal);
                        }} >Close</Button>  
                    </form>
                  </CardContent>
                </Card>
              </Modal>
            )}                        
        </StyledBox>
        {/* </div> */}
      </StyledWrapper>      
  )
}