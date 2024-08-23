/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import PropTypes from 'prop-types';
import { Text, FieldGroup, Grid, withConfiguration, Banner } from '@pega/cosmos-react-core';

import { useEffect, useState } from "react";

// Import two custom React components
import MUISimpleTable from './MUISimpleTable';
import MUIComplexTable from './MUIComplexTable';
import MUIEditableSimpleTable from './MUIEditableSimpleTable';
import MUIEditableCustomerList from './MUIEditableCustomerList';
import { StyledGridContainer } from './styles';

// Define the props 
type PegaComponentsMUITableProps = {
  heading: string;
  NumCols: string;
  children: any;
  dataPage: string;
  getPConnect: any;
};

// This props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaComponentsMuiTable(props: PegaComponentsMUITableProps) {
   const { heading, 
          NumCols, 
          children, 
          dataPage,
          getPConnect
        } = props;            

  const nCols = parseInt(NumCols, 10);
  const context = getPConnect().getContextName();
   
  return (
    <FieldGroup name={heading}>
        <Grid
          container={{
            cols: `repeat(${nCols}, minmax(0, 1fr))`,            
            gap: 2
          }}
          as={StyledGridContainer}
        >
          {children}

        </Grid>
        <br/>
         {/* MUI Editable Customer list */}
         <Text variant='h2' status={undefined}>
            MUI Editable customer list 
        </Text>                
        <MUIEditableCustomerList dataPageProp={dataPage} pConnectProp={getPConnect}/>
        {/* MUI Simple table https://mui.com/x/react-data-grid/ */}
        {/* <Text variant='h2' status={undefined}>
            MUI Simple table (@mui/x-data-grid)
        </Text>                
        <MUISimpleTable dataPageProp={dataPage} pConnectProp={getPConnect}/>
        <br/> */}
        {/* MUI Editable Simple table https://mui.com/x/react-data-grid/recipes-editing/#system-EditingWithDatePickers.tsx */}
       {/*  <Text variant='h2' status={undefined}>
            MUI Editable simple table (@mui/x-data-grid)
        </Text>                
        <MUIEditableSimpleTable dataPageProp={dataPage} pConnectProp={getPConnect}/> */}
        {/* MUI Complex table https://mui.com/x/react-data-grid/ */}
        {/* <br/>
        <Text variant='h2' status={undefined}>
            MUI Complex table (@mui/x-data-grid-premium)
        </Text>
        <MUIComplexTable/> */}
    </FieldGroup>
  );
}

// Defaulting props here
PegaComponentsMuiTable.defaultProps = {
  dataPage: 'D_MUIsimpledataobjectList'
};
// props types are defined here for required props
PegaComponentsMuiTable.propTypes = {
  dataPage: PropTypes.string,
};

export default withConfiguration(PegaComponentsMuiTable);
