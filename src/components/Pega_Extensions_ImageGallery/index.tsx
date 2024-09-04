import { Fragment } from 'react';
import { Grid, Flex, FieldGroup, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

import StyledPegaExtensionsImageGalleryWrapper from './styles';

// includes in bundle
import { getAllFields } from './utils';

// interface for props
interface PegaExtensionsImageGalleryProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  showHighlightedData: boolean;
  children: any;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsImageGallery(props: PegaExtensionsImageGalleryProps) {

  const { getPConnect, children, label, showLabel = true, showHighlightedData = false  } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const numRegions = getAllFields(getPConnect)?.length;
  const gridRepeat = "repeat(".concat(numRegions).concat(", 1fr)");
  const gridContainer = { "colGap": 1};
  // @ts-ignore
  gridContainer.cols = gridRepeat;
  // @ts-ignore
  gridContainer.alignItems = 'start';

  const gridHighlightContainer = { "gap": 2};
  // @ts-ignore
  gridHighlightContainer.cols = gridRepeat;
  // @ts-ignore
  gridHighlightContainer.alignItems = 'start';
  // @ts-ignore
  gridHighlightContainer.pad = [0, 0, 2, 0];

  // Set up highlighted data to pass in return if is set to show, need raw metadata to pass to createComponent
  let highlightedDataArr = [];
  if (showHighlightedData) {
    // @ts-ignore
    const { highlightedData = [] } = getPConnect().getRawMetadata().config;
    // @ts-ignore
    highlightedDataArr = highlightedData.map((field) => {
      field.config.displayMode = 'STACKED_LARGE_VAL';

      // Mark as status display when using pyStatusWork
      if (field.config.value === '@P .pyStatusWork') {
        field.type = 'TextInput';
        field.config.displayAsStatus = true;
      }
      // @ts-ignore
      return getPConnect().createComponent(field);
    });
  }

  return (
    <StyledPegaExtensionsImageGalleryWrapper>
    <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
      {showHighlightedData && highlightedDataArr.length > 0 && (
        <Grid container={gridHighlightContainer}
          data-testid={`highlighted-column-count-${numRegions}`}>
          {highlightedDataArr.map((child: any, i: number) => (
            <Fragment key={`hf-${i + 1}`}>{child}</Fragment>
          ))}
        </Grid>
      )}
      <Grid container={gridContainer} data-testid={`column-count-${numRegions}`} >
       {children.map((child: any, i: number) => (
        <Flex container={{ direction: 'column'}} key={`r-${i + 1}`}>
        {child}
        </Flex>
       ))}
      </Grid>
    </FieldGroup>
    </StyledPegaExtensionsImageGalleryWrapper>
  );

}

export default withConfiguration(PegaExtensionsImageGallery);
