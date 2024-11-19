/* eslint-disable react/jsx-no-useless-fragment */
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";

import { getDataPageResults, getMUISimpleTableRowValues } from './utils';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

/* const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]; */

type Props = {
/*     rows: []; */
    pConnectProp: any;
    dataPageProp: string;
}

export default function MUISimpleTable(props: Props) {
    const { 
        dataPageProp,
        pConnectProp
    } = props; 
    const [simpleTableData, setSimpleTableData] = useState([]);

    useEffect(() => {
      // const dpParams = {};
        getDataPageResults(pConnectProp, dataPageProp).then(data => {                  
            setSimpleTableData(getMUISimpleTableRowValues(data));            
        }); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid            
            rows={simpleTableData}
            columns={columns}
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