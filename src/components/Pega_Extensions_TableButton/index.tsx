import {  
  Button,
  withConfiguration,
  Flex
} from '@pega/cosmos-react-core';

import StyledPegaExtensionsTableButtonWrapper from './styles';

type TableButtonProps = {
  label: string;
  value: string;
  localAction: string;
  getPConnect: any;
};

function PegaExtensionsTableButton(props: TableButtonProps) {
  const { getPConnect, label, value, localAction } = props;  
  const launchButtonAction = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // const actionsAPI = getPConnect().getActionsApi();    
    console.log(getPConnect(), localAction, event); // This is just to keep the variables active from typescript warnings
    console.log('Row id=', value);
  };
  return (
    <StyledPegaExtensionsTableButtonWrapper>
      <Flex container={{ direction: 'row' }}>
        <Button onClick={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          launchButtonAction(e)
                        } >{label}</Button>
        
      </Flex>
    </StyledPegaExtensionsTableButtonWrapper>
  );
}


export default withConfiguration(PegaExtensionsTableButton);
