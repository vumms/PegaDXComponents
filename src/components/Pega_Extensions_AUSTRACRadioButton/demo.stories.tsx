/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { configProps, rawMetadata, fieldMetadata, stateProps } from './mock';

import PegaExtensionsAustracRadioButton from './index';

const meta: Meta<typeof PegaExtensionsAustracRadioButton> = {
  title: 'PegaExtensionsAustracRadioButton',
  component: PegaExtensionsAustracRadioButton,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsAustracRadioButton>;

export const BasePegaExtensionsAustracRadioButton: Story = (args: any) => {

  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getConfigProps: () => {
          return configProps;
        },
        getStateProps: () => {
          return stateProps;
        },
        getPageReference: () => {
          return 'caseInfo.content';
        },
        getLocalizedValue: (val: any) => {
          return val;
        },
        getLocaleRuleNameFromKeys: (localeClass: string, localeContext: string, localeName: string) => {
          return `${localeClass}!${localeContext}!${localeName}`;
        },
        getCaseInfo: () => {
          return {
            getClassName: () => {
              return 'DIXL-MediaCo-Work-NewService';
            }
          };
        },
        getRawMetadata: () => {
          return rawMetadata;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: (propName: string, theValue: any) => {
              setValue(theValue);
            },
            triggerFieldChange: () => {/* nothing */}
          };
        },
        getValidationApi: () => {
          return {
            validate: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <PegaExtensionsAustracRadioButton {...props} {...args} />
    </>
  );
};

BasePegaExtensionsAustracRadioButton.args = {
  datasource: configProps.datasource,
  label: configProps.label,
  helperText: configProps.helperText,
  placeholder: configProps.placeholder,
  inline: configProps.inline,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  validatemessage: configProps.validatemessage
};
