/// <reference types="react" />
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';
interface PegaExtensionsAustracBannerProps extends PConnFieldProps {
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
export declare const formatExists: (formatterVal: string) => boolean;
declare const _default: (props: PegaExtensionsAustracBannerProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map