// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';

import { TextArea, Flex, Input } from '@pega/cosmos-react-core';

const styleRoot = {
  border: '1px solid #cfcfcf'
};

export default styled.div(() => {
  return css`
    margin: 0px 0;
  `;
});

export const StyledTable = styled.table(() => {
  return css`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: ${styleRoot.border};
    margin-top: 10px;
    margin-bottom: 10px;
  `;
});

export const StyledTableHeader = styled.thead(() => {
  return css`
    background-color: #f5f5f5;
    color: #000000;
    font-weight: 600;
    line-height: 40px;
    font-size: 13px;
    border: ${styleRoot.border};
  `;
});

export const StyledTableBody = styled.tbody(() => {
  return css`
    border: ${styleRoot.border};
  `;
});

export const StyledTableHeadingCell = styled.th(() => {
  return css`
    padding: 0 1.92px 0 8px;
    border: ${styleRoot.border};
    text-align: left;
  `;
});

export const StyledTableBodyRow = styled.tr(() => {
  return css`
    border: ${styleRoot.border};
    line-height: 25px;
    font-size: 14px;
  `;
});

export const StyledTableBodyCell = styled.td(() => {
  return css`
    padding: 0 1.92px 0 8px;
    border: ${styleRoot.border};
    text-align: left;
  `;
});

export const StyledModalInput = styled(Input)(() => {
  return css`
    width: 100%;
    margin-bottom: 10px;
  `;
});

export const StyledModalTextArea = styled(TextArea)(() => {
  return css`
    width: 100%;
    height: 200px;
  `;
});

export const StyledFlex = styled(Flex)(() => {
  return css`
    margin-top: 10px;
  `;
});
