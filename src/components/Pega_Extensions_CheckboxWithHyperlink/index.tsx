import {
  Checkbox as CosmosCheckbox,
  CheckboxGroup,
  Link,
  FieldValueList,
  Text,
  withConfiguration,
  BooleanDisplay
} from "@pega/cosmos-react-core";

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

// includes in bundle
import handleEvent from "./event-utils";
import StyledPegaExtensionsCheckboxWithHyperlinkWrapper from './styles';
import { useState, useEffect, useCallback } from "react";

// interface for props
interface PegaExtensionsCheckboxWithHyperlinkProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  caption: string;
  trueLabel: string;
  falseLabel: string;
  preCaptionText?: string;
  postCaptionText?: string;
  linkText?: string;
  linkUrl?: string;
  linkTarget?: string;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsCheckboxWithHyperlink(props: PegaExtensionsCheckboxWithHyperlinkProps) {
  const {
    getPConnect,
    preCaptionText = '',
    postCaptionText = '',
    linkText = 'NO LINK TEXT FOUND',
    linkUrl = '#',
    linkTarget = '_blank',
    value = false,
    helperText = '',
    caption,
    validatemessage,
    hideLabel,
    testId,
    additionalProps = {},
    displayMode,
    variant = 'inline',
    trueLabel,
    falseLabel
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const [checkboxCaptionValue, setCheckboxCaptionValue] = useState<React.ReactNode>(null);
  
  // Get the actual checkbox value from the state
  const checkboxValue = value === 'true' || value === true || value === 'True';

  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  let status: "error" | "success" | "warning" | "pending" | undefined;
  if (validatemessage !== "") {
    status = "error";
  }

  // Memoize handleLinkClick to prevent unnecessary re-renders
  const handleLinkClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Open the link
    if (linkUrl && linkUrl !== '#') {
      window.open(linkUrl, linkTarget, linkTarget === '_blank' ? 'noopener,noreferrer' : '');
    }
  }, [linkUrl, linkTarget]);

  // Handle checkbox change - REMOVED checkboxCaptionValue from dependencies
  useEffect(() => {
    const captionText = (
      <span>
        {preCaptionText}{' '}
        <Link
          href={linkUrl}
          target={linkTarget}
          onClick={handleLinkClick}
          rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {linkText}
        </Link>
        {' '}{postCaptionText}
      </span>
    );
    setCheckboxCaptionValue(captionText);
  }, [postCaptionText, preCaptionText, handleLinkClick, linkText, linkUrl, linkTarget]);

  const aCosmosCheckbox = (
    <CosmosCheckbox
      {...additionalProps}
      className="standard"
      checked={checkboxValue}
      label={checkboxCaptionValue}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onChange={(event) => {
        console.log('Checkbox onChange fired:', event.target.checked);
        handleEvent(actions, "changeNblur", propName, event.target.checked);
      }}
      onBlur={(event: { target: { checked: any; }; }) => {
        pConn.getValidationApi().validate(event.target.checked);
      }}
      data-testid={testId}
    />
  );

  const parentTestId = testId === '' ? `${testId}-parent` : testId;

  let displayComponent;
  if (displayMode) {
    displayComponent = (
      <BooleanDisplay value={value} trueLabel={trueLabel} falseLabel={falseLabel} />
    );
  }

  if (displayMode === 'DISPLAY_ONLY') {
    return (
      <StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
       {displayComponent}
      </StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
    );
  }

  if (displayMode === "LABELS_LEFT") {
    return (
      <StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : caption, value: displayComponent }]}
      />
     </StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
    );
  }

  if (displayMode === "STACKED_LARGE_VAL") {
    return (
      <StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[
          {
            id: '2',
            name: hideLabel ? '' : caption,
            value: (
              <Text variant='h1' as='span'>
                {displayComponent}
              </Text>
            )
          }
        ]}
      />
      </StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
    );
  }

  return (
    <StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
    <CheckboxGroup
      label={checkboxCaptionValue}
      labelHidden={hideLabel}
      data-testid={parentTestId}
      info={validatemessage || helperText}
      status={status}
    >
      {aCosmosCheckbox}
    </CheckboxGroup>
    </StyledPegaExtensionsCheckboxWithHyperlinkWrapper>
  );
}

export default withConfiguration(PegaExtensionsCheckboxWithHyperlink);