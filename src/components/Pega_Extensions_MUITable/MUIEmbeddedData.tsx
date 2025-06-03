// @ts-nocheck
import {
  GridColDef,
  GridRowsProp,    
  GridRowSelectionModel, 
  // GridCallbackDetails, 
  GridRowId,  
  DataGrid,  
  useGridApiRef,
  GridToolbar,
} from '@mui/x-data-grid';
/* import { DataGridPro,     
  DataGridProProps } from '@mui/x-data-grid-pro';  */
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
  Banner,
  useModalManager,
  useModalContext,  
  /* Checkbox */ } from '@pega/cosmos-react-core';
/*   import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'; */
/* import Modal from '@mui/material/Modal'; */

import { useEffect, useMemo, useState, useCallback } from "react";
// import { styled } from '@mui/material/styles';
  /* eslint-disable @typescript-eslint/no-unused-vars */
import { getDisbursementEmbeddedData, 
        getDataPageResults, 
        getDisbursementDataAsRowData,
        getDisbursementDetailsDataAsRowData, 
        findUniqueId,         
        isEmpty,
        // findRowDetailById,        
        isUserSelectedRowCommentsEmpty,
        getPreSelectedTableDataListIds,
        getPreSelectedTableDataList,
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
    disbursementDetailsDataPageProp: any;
    disbursementDetailsDPParamsProps: string;
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

const ShowMUIModal = ( props ) => {
  console.log(props);    
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    handleOpen();
  });
  
  return (          

    <div>      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );   
}

const ShowDummyDetailsModal = ( props ) => {
  console.log(props);    
  const [disbursementDetails, setDisbursementDetails] = useState(); 
  const [emptyData, setEmptyData] = useState(false); 
  const { dismiss } = useModalContext();
  
  const columns: GridColDef[] = [
    { field: 'item', headerName: 'Item', width: 120, editable: false },
    { field: 'amt', headerName: 'Amount', width: 120, editable: false },    
  ];

  const actions = useMemo(() => {
    return (
      
        <Button
          onClick={() => {              
            dismiss();              
          }}
        >
          Close
        </Button>
      
    );
  }, [dismiss]);
  
  useEffect(() => {    

  }, []);
  
  return (          
    <Modal
      actions={actions}
      autoWidth={false}
      stretch={false}
      center={false}  
      heading='View details modal'   
      id='rowDetailModal'
    >
          <form>    
           <Box sx={{ height: 400, width: '100%' }}>                                      
              <div style={{ height: 300, width: '100%' }}>
                <h1>Disbursement details</h1>                
                { emptyData? (
                  <Banner
                    variant='urgent'
                    messages={['No details record found.']}
                    // onDismiss={dismiss()}
                    // handle={bannerHandleRef}
                  />
                  ) : (
                    <DataGrid
                      rows={props.selectedRowsData?.detailsData}
                      columns={columns}
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />
                  )
                }
                <br></br><br></br>
                <h2>Disbursement details Pega Table component</h2>
                <Table
                      title='Breakdown of amount'
                      hoverHighlight='false'                                
                      data={props.selectedRowsData?.detailsData}
                      columns={[
                        { renderer: 'item', label: 'Item' },
                        { renderer: 'amt', label: 'Amount' },
                      ]}

                    /> 
              </div>
            </Box>                  
          </form>          
    </Modal> 
  );   
}


const ShowViewMoreDetailModal = ( props ) => {
  console.log(props);    
  const [disbursementDetails, setDisbursementDetails] = useState(); 
  const [emptyData, setEmptyData] = useState(false); 
  const { dismiss } = useModalContext();
  
  const columns: GridColDef[] = [
    { field: 'disbursementId', headerName: 'Disbursement ID', width: 120, editable: false },
    { field: 'enforcementFee', headerName: 'Enforcement fee', width: 120, editable: false },
    { field: 'fineAmount', headerName: 'Fine Amount', width: 120, editable: false },
    { field: 'infringementAmount', headerName: 'Infringement amount', width: 120, editable: false },                               
    { field: 'obligationNumber', headerName: 'Obligation number', width: 120, editable: false },
    { field: 'prnAmount', headerName: 'Prn amount', width: 120, editable: false },
    { field: 'registrationFee', headerName: 'Registration fee', width: 120, editable: false },
    { field: 'totalPaid', headerName: 'Total Paid', width: 120, editable: false },
  ];

  const actions = useMemo(() => {
    return (
      
        <Button
          onClick={() => {              
            dismiss();              
          }}
        >
          Close
        </Button>
      
    );
  }, [dismiss]);

  const getDisbursementDetailsTableData = useCallback(() => {    
    props.disbursementDetailsDataPageProp.parameters['DisbursementID'] = props.selectedRowsData['Disbursement_id'];    
    getDataPageResults(props.pConnectProp, props.disbursementDetailsDataPageProp).then(data => {                  
      setDisbursementDetails(getDisbursementDetailsDataAsRowData(data));
      console.log(data);
    });  
  }, [props.pConnectProp, props.disbursementDetailsDataPageProp, props.selectedRowsData]);

  useEffect(() => {
    console.log('Inside showviewmoredetailsmodal useeffect');
    // Check if a valid id exist before calling dataPage
    if(isEmpty(props.selectedRowsData['Disbursement_id'])) {
      setEmptyData(true);
    } else {
      getDisbursementDetailsTableData();
      setEmptyData(false);
    }
    console.log('Empty data state=', emptyData);
    // console.log(disbursementDetails); 
  }, [props.pConnectProp, getDisbursementDetailsTableData, props.selectedRowsData, emptyData]);
  
  return (          
    <Modal
      actions={actions}
      autoWidth={false}
      stretch={false}
      center={false}  
      heading='View details modal'   
      id='rowDetailModal'
    >
      {/* <Card>
        <CardContent> */}        
          <form>    
           <Box sx={{ height: 400, width: '100%' }}>                       
               {/* <Table
                title='Breakdown of amount'
                hoverHighlight='false'                                
                data={props.selectedRowsData?.detailsData}
                columns={[
                  { renderer: 'item', label: 'Item' },
                  { renderer: 'amt', label: 'Amount' },
                ]}

              /> */}
              <div style={{ height: 300, width: '100%' }}>
                <h1>Disbursement details</h1>                
                { emptyData? (
                  <Banner
                    variant='urgent'
                    messages={['No details record found.']}
                    // onDismiss={dismiss()}
                    // handle={bannerHandleRef}
                  />
                  ) : (
                    <DataGrid
                      rows={disbursementDetails}
                      columns={columns}
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />   
                  )
                }
              </div>
            </Box>                  
          </form>          
        
  {/*       </CardContent>
      </Card> */}
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
    // Function called to collect required information before updating REDUX store
    const updateTableRows = () => {
      // Read all the modal form data
      const commentsToUpdate = modalFormContent.BulkUpdateCommentsField;
      // Default selection is all table rows
      let rowsToBeUpdated = props.disbursementTableData;
      if(modalFormContent.rbSelRows === 'on') {
        rowsToBeUpdated = props.disbursementTableData.filter(obj => obj.Select === true)
      } 
      if(modalFormContent.rbUnSelRows === 'on') {        
        rowsToBeUpdated = props.disbursementTableData.filter(obj => obj.Select === false)
      } 
  
      // Update the comments field based on the radio button selection all/selected/unselected rows
      rowsToBeUpdated.forEach((row) => {      
        const rowId = row.id;
        const indexOfRow = props.disbursementTableData.findIndex(obj => obj.id === rowId);
        console.log('Row to be updated=', row);
        console.log('Comments value to be updated=', commentsToUpdate);
        console.log('RowId to be updated=', rowId);
        // This method also updates the disbursementTable redux Store 
        props.updateComments(indexOfRow, commentsToUpdate);         
        console.log("Successfully updated row");
      });
      props.refreshTableData(); // TODO find out why props disbursementTable is not getting refreshed if we don't all this method?
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
      disbursementDetailsDataPageProp,
      disbursementDetailsDPParamsProps,      
      displayMode,
  } = props;       
  const [disbursementTableData, setDisbursementTableData] = useState<GridRowsProp>([]);  
  const [preSelectedTabledDataIds, setPreSelectedTabledDataIds] = useState<GridSelectionModel>([]); // Preselect selectable rows
  const [preSelectedTabledData, setPreSelectedTabledData] = useState<GridRowsProp>([]); // Preselect selectable rows
  const [selectedRowIds, setSelectedRowsIds] = useState([]);  // User selected row Ids are stored in this props
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
      pConnectProp().getActionsApi().updateFieldValue('.Comments', newComment);
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
      pConnectProp().getActionsApi().updateFieldValue('.Select', selectState);      
      // This line works same as above API call -> pConnectProp().setValue('.Select', selectState);     
      // Reset page reference back to original reference
      pConnectProp()._pageReference = pageRef;
      // Lets update the state disbursementTableData with new comments value to reflect the changes in the rendered table
      // disbursementTableData[rowIndex].Select = selectState;       
    } catch (error) {
      console.log(error);
    } 
  }
 
  const handleViewDetailsClick = (id: GridRowId) => () => {
    console.log(id);    
    const selectedRowsData = disbursementTableData.find((row) => row.id === id.toString()); 
    console.log(selectedRowsData);    
    // Below line of code is for DJCS data model
    // create(ShowViewMoreDetailModal, { ...props, selectedRowsData });    
    // Below line of code is for Local dummy data model
    create(ShowDummyDetailsModal, { ...props, selectedRowsData });    
  };

  const columns: GridColDef[] = [
    /* {
      field: 'isAccepted',
      headerName: 'Is Authorized?',
      type: 'boolean',
      width: 120,
      editable: true,
    }, */
    { field: 'Select', headerName: 'Select state', type: 'boolean', width: 150 },
    {
      field: 'Comments',
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
    { field: 'Beneficiary_type', headerName: 'Beneficiary type', width: 120, editable: false },
    { field: 'Beneficiary_name', headerName: 'Beneficiary name', width: 120, editable: false },
    { field: 'Beneficiary_id', headerName: 'Beneficiary ID', width: 120, editable: false },    
    {
      field: 'Amount',
      headerName: 'Amount',
      type: 'number',
      width: 120,
      editable: false,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        }).format(params);
      }
    },
    { field: 'Type', headerName: 'Type', width: 120, editable: false },    
    { field: 'Disbursement_id', headerName: 'Disbursement ID', width: 120, editable: false },    
    { field: 'Status_x', headerName: 'Status', width: 120, editable: false },                    
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

  // Set the updated disbursementTableData to the state variable
  /* const updateDisbursementTableData = (updatedDisbursementTableData: any) => {
    setDisbursementTableData(updatedDisbursementTableData);
  } */

  // Fetch embedded data from the case summary content
  const refreshTableData = useCallback(() => {    
    console.log('DisplayMode=', displayMode);
    // Below method call directly reads from the embedded data page
    getDisbursementEmbeddedData(pConnectProp, embedDataPageProp).then(data => {                  
      setDisbursementTableData(data);
      // Set preselected table checkbox column
      const preSelectedTableTableDataListIds = getPreSelectedTableDataListIds(data);
      setPreSelectedTabledDataIds(preSelectedTableTableDataListIds);
      // Always set SelectionModel with preselected ids so when the page is reloaded or  it retains the checked status
      setSelectionModel(preSelectedTableTableDataListIds);  
      setPreSelectedTabledData(getPreSelectedTableDataList(data));
    });       
  }, [pConnectProp, embedDataPageProp, displayMode])


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
  };

  useEffect(() => {
    /* TODO: Do I need to check if the table is empty or can I load the data
        Retrieve embedded list of data page only once for the first time  */
    refreshTableData();        
    
    // Set the page reference only once if its empty or undefined  
    if(!pageRef) {
      setPageRef(pConnectProp().getPageReference());
      // Set the tree manager context once
      // (window as any).PCore.getContextTreeManager().addFieldNode(pConnectProp().getContextName(), `${pConnectProp().getPageReference()}.${embedDataPageProp}`, "", "");
      (window as any).PCore.getContextTreeManager().addPageListNode(pConnectProp().getContextName(), pConnectProp().getPageReference(), pConnectProp().viewName, `.${embedDataPageProp}`);

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
    create(ShowBulkUpdateModalDialog, { ...props, disbursementTableData, updateComments, refreshTableData });        
  }
  
  const bulkUpdateAllRows = () => {
    // Read all the modal form data
    const commentsToUpdate = formContent.BulkUpdateCommentsField;    
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
  
  const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }) => <DetailPanelContent row={row} />, []);

  // This method is triggered from onRowSelectionModelChange 
  const handleSelectionChange = (newSelection: any) => {
    let selectedState = true; // defaulted
    let indexOfSelectedRow = 0; // defaulted

    // Determine if a row was selected or unselected
    if (newSelection.length > selectionModel.length) {
      // Row selected, select state should be set to TRUE
      const added = newSelection.filter(id => !selectionModel.includes(id));
      // console.log('Selected row ID(s):', added);      
      indexOfSelectedRow = disbursementTableData.findIndex(obj => obj.id === added.toString());
      // console.log('Index of Selected row ID(s):', indexOfSelectedRow);
      selectedState = true;  // Set selected state to true      

    } else if (newSelection.length < selectionModel.length) {
      // Row unselected, select state should be set to FALSE
      const removed = selectionModel.filter(id => !newSelection.includes(id));
      // console.log('Unselected row ID(s):', removed);
      indexOfSelectedRow = disbursementTableData.findIndex(obj => obj.id === removed.toString());
      // console.log('Index of Unselected row ID(s):', indexOfSelectedRow);
      selectedState = false;  // Set selected state to false
    }
    console.log('Selected state: ', selectedState, ' Index of row: ', indexOfSelectedRow);
    // Call function to update case embedded data using PConnect API and construct page instructions
    updateSelect(indexOfSelectedRow, selectedState);
    // Lets update the disbursementTableData
    disbursementTableData[indexOfSelectedRow].Select = selectedState;  
    setSelectionModel(newSelection);
  };

  return (        
      <StyledWrapper>
      {/* <div style={{ height: 400, width: '100%' }}> */}
        <StyledBox>
            {displayMode.toLowerCase() === 'edit' && ( 
              <Flex container={{ direction: 'row', gap: 1, pad: 1 }}>                                       
                  <Button variant='secondary' onClick={refreshTableData}>Refresh embedded data</Button>                  
                  <Button variant='primary' onClick={() => {                            
                              handleOpenBulkUpdateClick();
                            }} >Bulk update - multi modal dialog</Button>    
                 <Button variant='secondary' disabled onClick={() => {                            
                              modalVisibility(openBulkUpdateModal);
                            }} >Bulk update - single modal dialog</Button>    
                  <Button variant='secondary' disabled onClick={() => {                            
                              testingModalManager();
                            }} >Test ModalManager</Button>                              
                  <Button variant='secondary' disabled onClick={() => {                               
                              ShowMUIModal(props);
                            }} >Open MUI Dialog</Button>    
                                                                                 
              </Flex>
            )} 
            <Box sx={{ height: 370, width: '100%' }}>  
              {displayMode.toLowerCase() === 'view' && (
                <DataGrid
                  rows={preSelectedTabledData} 
                  columns={columns}   
                  pagination
                  initialState={{                  
                    pagination: { paginationModel: { pageSize: 5 } }, // TODO paginationSizeProp to be used here, there is some warning and error generated when props are used
                  }}
                  pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}        
                />
              )}   
              {displayMode.toLowerCase() === 'edit' && (    
                <DataGrid
                  rows={disbursementTableData} 
                  columns={columns}   
                  pagination
                  initialState={{                  
                    pagination: { paginationModel: { pageSize: 5 } }, // TODO paginationSizeProp to be used here, there is some warning and error generated when props are used
                  }}
                  pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}      
                  checkboxSelection 
                  disableRowSelectionOnClick                  
                  rowSelectionModel={selectionModel}
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
                  onRowSelectionModelChange={handleSelectionChange}                                               
                />   
              )}           
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