/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsNotesHistory from './index';

import { configProps, notesTableHeaders, notesHistory, getCaseSummary } from './mock';

const meta: Meta<typeof PegaExtensionsNotesHistory> = {
  title: 'Widgets/PegaExtensionsNotesHistory',
  component: PegaExtensionsNotesHistory,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsNotesHistory>;

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getDataPageUtils = () => {
  return {
    getDataAsync: dataPage => {
      return dataPage === 'D_NotesHeaders' ? notesTableHeaders : notesHistory;
    }
  };
};

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      AVAIABLE_ACTIONS: 'caseInfo.availableActions'
    }
  };
};

window.PCore.getEnvironmentInfo = () => {
  return {
    getOperatorName: () => {
      return 'renzo.gaspary';
    }
  };
};

export const BasePegaExtensionsNotesHistory: Story = args => {
  const props = {
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        },
        getContextName: () => {
          return 'app/modal_1';
        },
        getValue: () => {
          return [
            {
              name: 'Edit details',
              links: {
                open: {
                  rel: 'self',
                  href: '/cases/O9MZHU-ITSERVICE-WORK T-1001/actions/pyUpdateCaseDetails',
                  type: 'GET',
                  title: 'Get case action details'
                }
              },
              ID: 'pyUpdateCaseDetails',
              type: 'Case'
            },
            {
              name: 'Change stage',
              links: {
                open: {
                  rel: 'self',
                  href: '/cases/O9MZHU-ITSERVICE-WORK T-1001/actions/pyChangeStage',
                  type: 'GET',
                  title: 'Get case action details'
                }
              },
              ID: 'pyChangeStage',
              type: 'Case'
            }
          ];
        },
        getCaseSummary: () => {
          return getCaseSummary;
        }
      };
    }
  };

  return (
    <>
      <PegaExtensionsNotesHistory {...props} {...args} />
    </>
  );
};

BasePegaExtensionsNotesHistory.args = {
  title: configProps.title,
  dataNotesHistory: configProps.dataNotesHistory,
  dataNotesHeaders: configProps.dataNotesHeaders,
  buttonText: configProps.buttonText,
  modalTitle: configProps.modalTitle
};
