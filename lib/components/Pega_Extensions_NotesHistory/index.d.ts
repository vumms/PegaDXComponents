/// <reference types="react" />
import type { PConnFieldProps } from './PConnProps';
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
declare const _default: (props: PegaExtensionsNotesHistoryProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map