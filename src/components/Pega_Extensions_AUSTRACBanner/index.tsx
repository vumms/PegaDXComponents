import { withConfiguration, Icon, registerIcon } from '@pega/cosmos-react-core';
// import { TextArea as CosmosTextArea, FieldValueList, ParagraphDisplay, Text, EmailDisplay, PhoneDisplay, URLDisplay, withConfiguration } from '@pega/cosmos-react-core';
import { useTheme } from 'styled-components';
import * as warnSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/warn-solid.icon';
import * as flagWaveSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/flag-wave-solid.icon';
import * as checkIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
import * as informationSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information-solid.icon';

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';
import { StyledBanner, StyledBannerStatus, StyledBannerText } from './styles';

registerIcon(warnSolidIcon, flagWaveSolidIcon, checkIcon, informationSolidIcon);

// interface for props
interface PegaExtensionsAustracBannerProps extends PConnFieldProps {    
  // hasSuggestions?: boolean;    

  /**  The value to display in the banner input */
  content: string;
  /** variant of the banner input
   * @default 'success'
   */
  variant?: 'success' | 'urgent' | 'info' | 'warn' | 'pending';
  /** icon to use
   * @default 'warn-solid'
   */
  icon?: 'warn-solid' | 'flag-wave-solid' | 'check' | 'information-solid';
}

// interface for StateProps object
/* interface StateProps {
  value: string;
  hasSuggestions: boolean;
} */

export const formatExists = (formatterVal: string) => {
    const formatterValues = [
      "TextInput",
      "WorkStatus",
      "RichText",
      "Email",
      "Phone",
      "URL",
      "Operator"
    ];
    let isformatter = false;
    if (formatterValues.includes(formatterVal)) {
      isformatter = true;
    }
    return isformatter;
  };


/* export const textFormatter = (formatter: string, value: any) => {
  let displayComponent:any = null;
  switch(formatter){
    case "TextInput" : {
      displayComponent = value;
      break;
    }
    case "Email" : {
      displayComponent = (<EmailDisplay value={value} displayText={value} variant="link" />);
      break;
    }
    case "Phone" : {
      displayComponent = (<PhoneDisplay value={value} variant="link" />);
      break;
    }
    case "URL" : {
      displayComponent = (<URLDisplay target="_blank" value={value} displayText={value} variant="link" />);
      break;
    }
    // no default
  }
  return displayComponent;
}; */


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsAustracBanner(props: PegaExtensionsAustracBannerProps) {
  const { content = '', variant = 'success', icon = 'clipboard' } = props;
  const theme = useTheme();
  const bannerMsg = `Banner ${variant} - ${content}`;
  /* const {
    getPConnect,    
  } = props;
   */
  // const pConn = getPConnect();
  // const actions = pConn.getActionsApi();
  // const stateProps = pConn.getStateProps() as StateProps;
  /* const propName: string = stateProps.value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false); */

 // BUG-547602: Temporary type coercion for 8.5 until DXAPIs are enhanced to pass original pxViewMetadata JSON, respecting boolean primitives
  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  // const [inputValue, setInputValue] = useState(value);
  // const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);



  return (
    <StyledBanner theme={theme} role='alert' tabIndex={0} aria-label={bannerMsg} aria-live='polite'>
      <StyledBannerStatus variant={variant} theme={theme}>
        <Icon name={icon} />
      </StyledBannerStatus>
      <StyledBannerText variant={variant} theme={theme}>
        {content}
      </StyledBannerText>
    </StyledBanner>
  );
}

export default withConfiguration(PegaExtensionsAustracBanner);
