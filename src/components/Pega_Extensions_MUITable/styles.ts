import styled, { css } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';

export const StyledGridContainer = styled.div(() => {
    return css`
            display: grid;
            grid-template-columns: minmax(0px, 1fr);
      `;
  });

export const StyledBox = styled('div')(() => ({
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
      color: '#d32f2f',      
    },
}));

export const StyledWrapper = styled.div(() => {
    return css`
        height: 400;
        width: '100%';
        margin-bottom: 16px;
    `;
});

StyledGridContainer.defaultProps = defaultThemeProp;