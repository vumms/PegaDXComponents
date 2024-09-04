import { Flex, Modal, Button, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';

/* import { useCallback } from "react"; */

import StyledPegaExtensionsFileUploadWrapper from './styles';

// interface for props
interface PegaExtensionsFileUploadProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here

}

// interface for StateProps object
/* interface StateProps {
  value: string;
  hasSuggestions: boolean;
} */

// Duplicated runtime code from Constellation Design System Component

const LaunchFileUpload = () => { 
  /* const { value: updatedValue } = event.target;
  actions.updateFieldValue(propName, updatedValue); */    
  /* return (      */
    <Modal heading='Header'>
      <Flex container={{ direction: 'column', alignItems: 'start', gap: 2 }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur it, sed do tempor incididunt ut labore
          magna aliqua. Nibh praesent tristique magna sit amet. Nec tincidunt praesent
          semper feugiat nibh sed pulvinar proin gravida.
        </p>
        <p>
          Pharetra pharetra massa massa ultricies mi quis hendrerit dolor. Est velit
          egestas dui id ornare arcu odio ut. Varius sit amet mattis vulputate enim nulla
          aliquet porttitor lacus.
        </p>        
      </Flex>

    </Modal>    
  /* ); */
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsFileUpload(props: PegaExtensionsFileUploadProps) {
  /* const { getPConnect, label } = props; */
  const { label } = props;

  /* const pConn = getPConnect();
  const actions = pConn.getActionsApi(); 
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value; */
  /* const LaunchFileUpload = useCallback(
    () => { */

  
  /* [], 
); */

  return (
    <StyledPegaExtensionsFileUploadWrapper>
      <Flex container={{ direction: 'row' }}>
        <Button onClick={LaunchFileUpload}>{label}</Button>
      </Flex>
    </StyledPegaExtensionsFileUploadWrapper>
  );
};


export default withConfiguration(PegaExtensionsFileUpload);
