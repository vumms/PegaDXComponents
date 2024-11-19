/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import PropTypes from 'prop-types';
import { Text, FieldGroup, Grid, withConfiguration, Banner } from '@pega/cosmos-react-core';

import { Fragment, useEffect, useState } from "react";

// Import two custom React components
import MUISimpleTable from './MUISimpleTable';
import MUIComplexTable from './MUIComplexTable';
import MUIEditableSimpleTable from './MUIEditableSimpleTable';
import MUIEditableCustomerList from './MUIEditableCustomerList';
import MUIMandatoryCell from './MUIMandatoryCell';
import MUIEmbeddedData from './MUIEmbeddedData';
import MUIMasterDetailTable from './MUIMasterDetailTable';
import { StyledGridContainer } from './styles';

// Define the props 
type PegaComponentsMUITableProps = {
  heading: string;
  NumCols: string;
  children: any;
  dataPage: string;
  embedDataPage: string;
  getPConnect: any;
  paginationSize: string;  
  prefill: any;
  disbursementDetailsDataPage: any;
  disbursementDetailsDPParams: string;
  commentsDataPage: any;
};

// This props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaComponentsMuiTable(props: PegaComponentsMUITableProps) {
   const { heading, 
          NumCols, 
          children, 
          dataPage,
          embedDataPage,
          getPConnect,
          paginationSize,  
          prefill,    
          disbursementDetailsDataPage,
          disbursementDetailsDPParams,
          commentsDataPage,    
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
          {/* I'm hiding the children display here so that embedded data model still in the case view but not visible in the web page */}
          {/* {children} */}

        </Grid>
        <br/>
        <Fragment>
            {/* MUI Editable Customer list just a test */}
            {/* <Text variant='h2' status={undefined}>
                MUI Editable customer list 
            </Text>   */}  
            {/* testing Adding comments here to test check in */}            
            {/* <MUIEditableCustomerList dataPageProp={dataPage} pConnectProp={getPConnect}/> */}
            {/* Uncomment below block to test MUI Simple table https://mui.com/x/react-data-grid/ */}
            {/* <Text variant='h2' status={undefined}>
                MUI Simple table (@mui/x-data-grid)
            </Text>                
            <MUISimpleTable dataPageProp={dataPage} pConnectProp={getPConnect}/>
            <br/> */}
            {/* Uncomment below block to test MUI Editable Simple table https://mui.com/x/react-data-grid/recipes-editing/#system-EditingWithDatePickers.tsx */}
          {/*  <Text variant='h2' status={undefined}>
                MUI Editable simple table (@mui/x-data-grid)
            </Text>                
            <MUIEditableSimpleTable dataPageProp={dataPage} pConnectProp={getPConnect}/> */}
            {/* Uncomment below block to test  MUI Complex table https://mui.com/x/react-data-grid/ */}
            {/* <br/>
            <Text variant='h2' status={undefined}>
                MUI Complex table (@mui/x-data-grid-premium)
            </Text>
            <MUIComplexTable/> */}
            {/* Uncomment below block to test  MUI Complex table https://mui.com/x/react-data-grid/recipes-editing/#conditional-validation */}
            <br/>
            {/* <Text variant='h2' status={undefined}>
                MUI Table using data reference (Directly reading from DataPage)  
            </Text>
            <MUIMandatoryCell pConnectProp={getPConnect} dataPageProp={dataPage} paginationSizeProp={paginationSize} />
            <br/><br/> */}
            <Text variant='h2' status={undefined}>
                MUI Table using Embedded data (Reading from embedded page list) 
            </Text>
            <MUIEmbeddedData pConnectProp={getPConnect} 
                              commentsDataPageProp={commentsDataPage.referenceList} 
                              embedDataPageProp={embedDataPage} 
                              paginationSizeProp={paginationSize} 
                              disbursementDetailsDataPageProp={disbursementDetailsDataPage}
                              disbursementDetailsDPParamsProps={disbursementDetailsDPParams}/>
            <br/><br/>
            {/* <Text variant='h2' status={undefined}>
                MUI Master details testing table 
            </Text>
            <MUIMasterDetailTable pConnectProp={getPConnect} dataPageProp={dataPage} paginationSizeProp={paginationSize}/> */}
        </Fragment>
    </FieldGroup>
  );
}

// Defaulting props here
PegaComponentsMuiTable.defaultProps = {
  dataPage: 'D_DisbursementList',
};
// props types are defined here for required props
PegaComponentsMuiTable.propTypes = {
  dataPage: PropTypes.string,
};

export default withConfiguration(PegaComponentsMuiTable);
