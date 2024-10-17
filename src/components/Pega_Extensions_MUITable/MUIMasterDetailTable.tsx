// @ts-nocheck
/* eslint-disable react/jsx-no-useless-fragment */
import Box from '@mui/material/Box';
/* import Grid from '@mui/material/Grid'; */
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGridPro, DataGridProProps, GridColDef, GridActionsCellItem } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomPrice,
  /* randomCurrency,
  randomCountry,
  randomCity,
  randomEmail, */
  randomInt,
  randomAddress,
  randomCommodity,
  randomUserName,
} from '@mui/x-data-grid-generator';
import { useCallback } from "react";

type Props = {
    pConnectProp: any;
    dataPageProp: string;
    paginationSizeProp: number;
}

function generateInstallOrder() {
  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    name: randomCommodity(),
    frequency: randomInt(1, 5),
    iPayDue: randomCreatedDate(),
    nPayDue: randomCreatedDate(),
    fPayDue: randomCreatedDate(),
    amount: randomPrice(),
  }));
}
const createRandomInstallOrderRow = () => {  
  return { id: randomInt(1, 5), name: '', frequency: '', iPayDue: '', nPayDue: '', fPayDue: '', amount:'' };
};
const handleInstallOrderAddRow = () => {
  setRows((prevRows) => [...prevRows, createRandomInstallOrderRow()]);
};

function generateInformantDetails() {
  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    informantId: randomInt(5, 10),
    firstName: randomUserName(),
    lastName: randomUserName(),
    age: randomInt(10, 80),
  }));
}
const createRandomInformantRow = () => {  
  return { id: randomInt(1, 5), firstName: '', lastName: '', age: randomInt(10, 80) };
};
const handleInformantAddRow = () => {
  setRows((prevRows) => [...prevRows, createRandomInformantRow()]);
};

function generateChargeDetails() {
  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    chargeId: randomInt(2, 2),
    fileDate: randomCreatedDate(),
    offenceDateFrom: randomCreatedDate(),
    offenceDateTo: randomCreatedDate(),
    indicator: randomInt(1, 2),
    sectionCode: randomInt(3, 5),
  }));
}
const createRandomChargeDetailRow = () => {  
  return { id: randomInt(1, 5), chargeId: '', fileDate: '', offenceDateFrom: '',  offenceDateTo: '', indicator: '', sectionCode: ''};
};
const handleChargeDetailAddRow = () => {
  setRows((prevRows) => [...prevRows, createRandomChargeDetailRow()]);
};

function DetailPanelContent({ row: rowProp }: { row: Orders }) {
  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      {/* First Order results child table */}
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">Installment orders</Typography>
          <DataGridPro
            density="compact"            
            columns={[
              { field: 'name', headerName: 'Stay type', flex: 0.5, minWidth: 150, },
              { field: 'frequency', headerName: 'Frequency', align: 'center', type: 'number', flex: 0.2, minWidth: 150, editable: true },
              { field: 'iPayDue', headerName: 'Initial payment due', type: 'date', flex: 0.3, minWidth: 150, editable: true },
              { field: 'fPayDue', headerName: 'First payment due', type: 'date', flex: 0.3, minWidth: 150, editable: true },
              { field: 'nPayDue', headerName: 'Next payment due', type: 'date', flex: 0.3, minWidth: 150, editable: true },
              { field: 'amount', headerName: 'Installment amount', type: 'number', flex: 0.3, minWidth: 150, editable: true },
              {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: () => [
                  <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
                  <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
                ],
              },
            ]}
            rows={rowProp.installOrder}
            initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
            sx={{ flex: 1 }}
            hideFooter
          />
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={handleInstallOrderAddRow}>
                Add installment order
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {/* Below is Informant details child table */}
      <br/>
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">Informant details</Typography>
          <DataGridPro
            density="compact"
            columns={[
              { field: 'informantId', headerName: 'Informant Id', },
              { field: 'firstName', headerName: 'FirstName', align: 'center', editable: true  },
              { field: 'lastName', headerName: 'LastName', editable: true },
              { field: 'age', headerName: 'Age', editable: true },
              {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: () => [
                  <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
                  <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
                ],
              },
            ]}            
            rows={rowProp.informantDetails}
            /* initialState={{ pinnedColumns: { left: ['informantId'], right: ['actions'] },
                            pagination: { paginationModel: { pageSize: paginationSizeProp } }, }}
            pageSizeOptions={[5, 10]}   */
            pagination
            sx={{ flex: 1 }}
            hideFooter
          />
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={handleInformantAddRow}>
                Add informant detail
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {/* Below is Charge details child table */}
      <br/>
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">Charge details</Typography>
          <DataGridPro
            density="compact"
            columns={[
              { field: 'chargeId', headerName: 'Charge number', },
              { field: 'fileDate', headerName: 'File date', editable: true  },
              { field: 'offenceDateFrom', headerName: 'Offence date from', editable: true },
              { field: 'offenceDateTo', headerName: 'Offence date to', editable: true },
              { field: 'indicator', headerName: 'On or about indicator', editable: true },
              { field: 'sectionCode', headerName: 'Act and section code', editable: true },

              {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: () => [
                  <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
                  <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
                ],
              },
            ]}
            rows={rowProp.chargeDetails}
            initialState={{ pinnedColumns: { left: ['chargeId'], right: ['actions'] } }}
            sx={{ flex: 1 }}
            hideFooter
          />
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={handleChargeDetailAddRow}>
                Add charge detail
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

const orderColumns: GridColDef<(typeof orderRows)[number]>[] = [
  { field: 'id', headerName: 'Order Id' },
  { field: 'resultId', headerName: 'Result number', editable: true },
  { field: 'resultDate', headerName: 'Result Date', editable: true },
  { field: 'chargeDate', headerName: 'Charge Date', editable: true },
  { field: 'summaryNumber', headerName: 'Summary number', editable: true },
  { field: 'resultAmount', headerName: 'Result amount', editable: true },
  { field: 'courtLocation', headerName: 'Court location', editable: true },
  { field: 'typeOfFines', headerName: 'Type of fines', editable: true },
  { field: 'dueDate', headerName: 'Fine Due date', editable: true },
];

const orderRows = [
  {
    id: 1,
    resultId: randomInt(10, 30),
    resultDate: randomCreatedDate(),
    chargeDate: randomCreatedDate(),
    summaryNumber: randomInt(100, 200),
    resultAmount: randomPrice(),
    courtLocation: randomAddress(),
    typeOfFines: randomUserName(),
    dueDate: randomCreatedDate(),
    installOrder: generateInstallOrder(),
    informantDetails: generateInformantDetails(),
    chargeDetails: generateChargeDetails(),
  },
  {
    id: 2,
    resultId: randomInt(10, 30),
    resultDate: randomCreatedDate(),
    chargeDate: randomCreatedDate(),
    summaryNumber: randomInt(100, 200),
    resultAmount: randomPrice(),
    courtLocation: randomAddress(),
    typeOfFines: randomUserName(),
    dueDate: randomCreatedDate(),
    installOrder: generateInstallOrder(),
    informantDetails: generateInformantDetails(),
    chargeDetails: generateChargeDetails(),
  },
  {
    id: 3,
    resultId: randomInt(10, 30),
    resultDate: randomCreatedDate(),
    chargeDate: randomCreatedDate(),
    summaryNumber: randomInt(100, 200),
    resultAmount: randomPrice(),
    courtLocation: randomAddress(),
    typeOfFines: randomUserName(),
    dueDate: randomCreatedDate(),
    installOrder: generateInstallOrder(),
    informantDetails: generateInformantDetails(),
    chargeDetails: generateChargeDetails(),
  },
  {
    id: 4,
    resultId: randomInt(10, 30),
    resultDate: randomCreatedDate(),
    chargeDate: randomCreatedDate(),
    summaryNumber: randomInt(100, 200),
    resultAmount: randomPrice(),
    courtLocation: randomAddress(),
    typeOfFines: randomUserName(),
    dueDate: randomCreatedDate(),
    installOrder: generateInstallOrder(),
    informantDetails: generateInformantDetails(),
    chargeDetails: generateChargeDetails(),
  },
  {
    id: 5,
    resultId: randomInt(10, 30),
    resultDate: randomCreatedDate(),
    chargeDate: randomCreatedDate(),
    summaryNumber: randomInt(100, 200),
    resultAmount: randomPrice(),
    courtLocation: randomAddress(),
    typeOfFines: randomUserName(),
    dueDate: randomCreatedDate(),
    installOrder: generateInstallOrder(),
    informantDetails: generateInformantDetails(),
    chargeDetails: generateChargeDetails(),
  },
];

type Orders = (typeof orderRows)[number];

export default function MUIMasterDetailTable(props: Props) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { 
      dataPageProp,
      pConnectProp,
      paginationSizeProp,
  } = props;   
  const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }) => <DetailPanelContent row={row} />, []);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
        <Box sx={{ width: '100%', height: 400 }}>
          <DataGridPro
            columns={orderColumns}
            rows={orderRows}
            checkboxSelection 
            getDetailPanelHeight={() => 'auto'}
            getDetailPanelContent={getDetailPanelContent}
            pagination
            /* initialState={{ pagination: { paginationModel: { pageSize: paginationSizeProp } }, }} */
            autoPageSize 
          />
        </Box>
        </div>
    </>
  )
}