/* eslint-disable react/jsx-no-useless-fragment */
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
} from '@mui/x-data-grid';

import { useEffect, useState, useCallback } from "react";

import { getDataPageResults, getMUISimpleTableRowValues } from './utils';
import React from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
    editable: true,
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

type Props = {
    pConnectProp: any;
    dataPageProp: string;
}

export default function MUIEditableSimpleTable(props: Props) {
    const { 
        dataPageProp,
        pConnectProp
    } = props; 
    const [simpleTableData, setSimpleTableData] = useState([]);
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



    useEffect(() => {
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