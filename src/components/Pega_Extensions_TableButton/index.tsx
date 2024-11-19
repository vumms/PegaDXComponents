import {  
  Button,
  withConfiguration,
  Flex
} from '@pega/cosmos-react-core';

import StyledPegaExtensionsTableButtonWrapper from './styles';

type TableButtonProps = {
  label: string;
  value: string;
  amount: string;
  localAction: string;
  getPConnect: any;
};

function PegaExtensionsTableButton(props: TableButtonProps) {
  const { getPConnect, label, value, amount, localAction } = props;  
  const launchButtonAction = () => {    
    console.log(getPConnect(), localAction); // This is just to keep the variables active from typescript warnings
    // Row id value variable is populated based on the view metadata that is custom configured on the view 
    console.log('Row id=', value, ' Amount=', amount);
  };
  return (
    <StyledPegaExtensionsTableButtonWrapper>
      <Flex container={{ direction: 'row' }}>
        <Button onClick={launchButtonAction} >{label}</Button>
        
      </Flex>
    </StyledPegaExtensionsTableButtonWrapper>
  );
}


export default withConfiguration(PegaExtensionsTableButton);
