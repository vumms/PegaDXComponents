import {
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Modal,
  withConfiguration
} from '@pega/cosmos-react-core';
import { useEffect, useState } from 'react';

import type { PConnFieldProps } from './PConnProps';

import StyledPegaExtensionsNotesHistoryWrapper, {
  StyledTable,
  StyledTableHeader,
  StyledTableHeadingCell,
  StyledTableBody,
  StyledTableBodyCell,
  StyledTableBodyRow,
  StyledModalInput,
  StyledModalTextArea
} from './styles';

/**
 * TODO:
 * 1. Connect form to Data Page - DONE
 * 2. Update table on submit - DONE
 * 3. Style table - DONE
 * 4. Connect read note link to modal read only version - DONE
 * 5. Store form data in data page
 * 6. Clean up code
 * 7. Ger Rich's blessing
 *
 * NICE TO HAVE:
 * 1. Add refresh button to table
 * 2. Add pagination to table
 * 3. Add sorting to table
 * 4. Add filtering to table
 * 5. Add search to table
 * 6. Add Rich text editor to modal
 */

// interface for props
interface PegaExtensionsNotesHistoryProps extends PConnFieldProps {
  title: string;
  dataNotesHistory: string;
  dataNotesHeaders: string;
  buttonText: string;
  testId: string;
  modalTitle: string;
  centerModal: boolean;
  columnsToHide: string;
}

// interface for table row
interface TableRow {
  [key: string]: any;
}

function filterHeader(data: any, columnsToHide: string = '', returnIndex: boolean = false) {
  const headerLabels: any[] = [];
  const headerIndexes: any[] = [];
  let columnsToHideArray: string[] = [];
  if (columnsToHide !== '') {
    columnsToHideArray = columnsToHide.split(',');
  }
  const excludeHeaders = [...columnsToHideArray, 'px', 'py', 'pz'];
  const includeHeaders = ['pyGUID'];
  console.log('Exclude Headers: ', excludeHeaders);
  console.log('Include Headers: ', includeHeaders);
  Object.keys(data).forEach((headerLabel: any) => {
    console.log('Header Label: ', headerLabel);
    let finalHeaderLabel = '';
    if (
      !new RegExp(excludeHeaders.join('|')).test(headerLabel) ||
      (new RegExp(includeHeaders.join('|')).test(headerLabel) && returnIndex)
    ) {
      if (returnIndex) {
        headerIndexes.push(headerLabel);
        return true;
      }
      const result = headerLabel.replace(/([A-Z])/g, ' $1');
      const formatedHeaderLabel = result.charAt(0).toUpperCase() + result.slice(1);
      if (formatedHeaderLabel.includes('I D')) {
        finalHeaderLabel = formatedHeaderLabel.replace('I D', 'ID');
      } else {
        finalHeaderLabel = formatedHeaderLabel;
      }
      headerLabels.push(finalHeaderLabel.trim());
    }
  });
  if (returnIndex) {
    return headerIndexes;
  }
  return headerLabels;
}

function filterData(data: any, caseID: string, columnsToHide: string) {
  const headerKeys = filterHeader(data[0], columnsToHide, true);
  console.log('Header Keys: ', headerKeys);
  const tableData: any = [];
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  console.log('Case Data: ', data);
  // const caseData = data.filter((value: any) => value.CaseID === caseID);
  const caseData = data;
  caseData.map((value: any) => {
    const row: any = {};
    headerKeys.forEach((key: any) => {
      if (row[key] instanceof Date) {
        row[key] = dateFormatter.format(new Date(value[key]));
      } else {
        row[key] = value[key];
      }
    });
    tableData.push(row);
    return null;
  });
  return tableData;
}

function getReadOnlyData(tableData: any, pyGUID: string = '') {
  if (pyGUID === '') return { Subject: '', Details: '' };
  const record = tableData.find((row: any) => row.pyGUID === pyGUID);
  return record;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsNotesHistory(props: PegaExtensionsNotesHistoryProps) {
  const {
    title,
    dataNotesHistory,
    dataNotesHeaders,
    getPConnect,
    buttonText,
    testId,
    modalTitle,
    centerModal,
    columnsToHide
  } = props;

  const pConnObject = getPConnect();
  const caseSummary = pConnObject.getCaseSummary();
  const context = pConnObject.getContextName();
  const assignmentID = pConnObject.getCaseInfo().getAssignmentID();
  const caseInfo = pConnObject.getCaseInfo();
  const caseTypeID = caseSummary?.caseTypeID;
  const caseID = caseSummary?.businessID;
  const activeFlowActionID = pConnObject.getCaseInfo().getActiveFlowActionID();

  const [tableColumns, setTableColumns] = useState([]);
  const [tableNotesData, setTableNotesData] = useState<TableRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formContent, setFormContent] = useState({ Subject: '', Details: '' });
  const [tableClass, setTableClass] = useState('');

  // Gets the table headers and content
  useEffect(() => {
    const fetchTableData = async () => {
      const tableData: any = await PCore.getDataPageUtils().getDataAsync(
        `${dataNotesHistory}List`,
        context,
        (resp: any) => {
          return resp;
        }
      );
      // @ts-ignore
      setTableColumns(filterHeader(tableData.data[0], columnsToHide));
      setTableClass(tableData.data[0].pxObjClass);
      setTableNotesData(filterData(tableData.data, columnsToHide, caseID));
    };
    const store = PCore.getStore();
    console.log('store: ', store);
    fetchTableData();
  }, [
    caseID,
    caseSummary.ID,
    caseSummary.caseTypeID,
    columnsToHide,
    context,
    dataNotesHeaders,
    dataNotesHistory,
    getPConnect
  ]);

  const openModal = 'newNote';
  const closeModal = 'closeModal';

  const newNote = () => {
    getPConnect()
      .getActionsApi()
      .showDataObjectCreateView(tableClass)
      .then(() => {})
      .catch(error => {
        // showDataObjectCreateView failure handling
        console.log('showDataObjectCreateView failed: ', error);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormContent({ ...formContent, [event.target.name]: event.target.value });
  };

  const modalVisibility = (action: string, pyGUID: string = '') => {
    console.log('View Note Action: ', action);
    console.log('View Note Note ID: ', pyGUID);
    if (action === openModal) {
      setFormContent(getReadOnlyData(tableNotesData, pyGUID));
      setShowModal(true);
      console.log('Show Form Content: ', formContent);
    }
    if (action === closeModal) {
      setFormContent({ Subject: '', Details: '' });
      setShowModal(false);
      console.log('Hide Form Content: ', formContent);
    }
  };

  const metadata = getPConnect().getRawMetadata();

  console.log('Active Flow Action ID: ', activeFlowActionID);
  console.log('assignmentID: ', assignmentID);
  console.log('caseInfo: ', caseInfo);
  console.log('caseTypeID: ', caseTypeID);
  console.log('pConnObject: ', pConnObject);
  console.log('caseSummary: ', caseSummary);
  console.log('context: ', context);
  console.log('tableNotesData: ', tableNotesData);
  console.log('tableClass: ', tableClass);
  console.log('metadata: ', metadata);

  const logoff = () => {
    /* @ts-ignore */
    getPConnect.getActionsApi().logout();
  };

  return (
    <StyledPegaExtensionsNotesHistoryWrapper>
      <Card>
        <CardHeader>
          <strong>
            {tableNotesData.length === 1
              ? `${tableNotesData.length} result`
              : `${tableNotesData.length} results`}
          </strong>
          {title}
          <Button variant='primary' compact={false} onClick={() => newNote()} data-test-id={testId}>
            {buttonText}
          </Button>
          <Button variant='secondary' onClick={() => logoff()}>
            Log Off
          </Button>
        </CardHeader>
        <CardContent>
          <StyledTable>
            <StyledTableHeader>
              <tr>
                {Object.keys(tableColumns).map((key: any) => {
                  if (tableColumns[key] !== 'pyGUID') {
                    return (
                      <StyledTableHeadingCell key={key}>
                        <span>{tableColumns[key]}</span>
                      </StyledTableHeadingCell>
                    );
                  } else {
                    return null;
                  }
                })}
                <StyledTableHeadingCell></StyledTableHeadingCell>
              </tr>
            </StyledTableHeader>
            <StyledTableBody>
              {tableNotesData.length >= 1 ? (
                tableNotesData.map((row: TableRow) => {
                  return (
                    <StyledTableBodyRow
                      key={`tableRow-${row.pyGUID}`}
                      data-row={row.pyGUID}
                      className='cat-1'
                    >
                      {Object.keys(row).map((key: string) => {
                        if (!columnsToHide.includes(key) && key !== 'pyGUID') {
                          return <StyledTableBodyCell key={key}>{row[key]}</StyledTableBodyCell>;
                        }
                        return null;
                      })}
                      <StyledTableBodyCell>
                        <Button
                          variant='link'
                          onClick={() => {
                            console.log('View Note pyGUID: ', row.pyGUID);
                            modalVisibility(openModal, row.pyGUID);
                          }}
                        >
                          View Note
                        </Button>
                      </StyledTableBodyCell>
                    </StyledTableBodyRow>
                  );
                })
              ) : (
                <StyledTableBodyRow>
                  <StyledTableBodyCell colSpan={Object.keys(tableColumns).length + 1}>
                    <EmptyState message='No items' />
                  </StyledTableBodyCell>
                </StyledTableBodyRow>
              )}
            </StyledTableBody>
          </StyledTable>
        </CardContent>
      </Card>
      {showModal && (
        <Modal
          center={centerModal}
          heading={modalTitle}
          onRequestDismiss={() => modalVisibility(closeModal)}
        >
          <Card>
            <CardContent>
              <form>
                <StyledModalInput
                  label='Subject'
                  name='subject'
                  readOnly='true'
                  defaultValue={formContent.Subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleChange(e)
                  }
                />
                <StyledModalTextArea
                  label='Details'
                  name='details'
                  readOnly='true'
                  defaultValue={formContent.Details}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleChange(e)
                  }
                />
              </form>
            </CardContent>
          </Card>
        </Modal>
      )}
    </StyledPegaExtensionsNotesHistoryWrapper>
  );
}

export default withConfiguration(PegaExtensionsNotesHistory);

// as objects are there in props, shallow comparision fails & re-rendering of comp happens even with
// same key value pairs in obj. hence using custom comparison function on when to re-render
// const comparisonFn = (prevProps, nextProps) => {
//   return prevProps.updateDateTime === nextProps.updateDateTime;
// };
