// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    margin: 0px 0;
  `;
});

// nested HTML styling for radiobutton control
export const StyledRadioBtnLbl = styled.div`
  & label {
    background-color: #33C5B4;
    border-color: #33C5B4;
    width: max-content;
    min-width: 3.1rem;
    justify-content: center;
  }
  & label > div.gVodOU {
    color: #000000;
  }
  & label:has(input[type="radio"]:checked) {
    background-color: #23897d;
    border-color: #23897d;
  }
  & label:has(input[type="radio"] + div > div::after) {
    background-color: #23897d;
    border-color: #23897d;
  }
  & label:hover,
  & label:focus {
    background-color: #23897d;
    border-color: #23897d;
  }
  & label > div > div  {
    visibility: hidden;
    width: 0;
    margin-right: 0;
  }
`;

