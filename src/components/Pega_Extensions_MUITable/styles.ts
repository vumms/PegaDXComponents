import styled, { css } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';

export const StyledGridContainer = styled.div(() => {
    return css`
            display: grid;
            grid-template-columns: minmax(0px, 1fr);
      `;
  });

  StyledGridContainer.defaultProps = defaultThemeProp;