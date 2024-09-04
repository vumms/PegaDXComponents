/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export declare function getAllFields(pConnect: Function): any;
export declare function getFilteredFields(getPConnect: Function): any[];
/**
 * Returns ConfigurableLayout mapped content. With pre-populated default layout configs.
 * @param {object[]} regionData template children item.
 * @returns {object[]} ConfigurableLayout content.
 */
export declare function getLayoutDataFromRegion(regionData: any): any;
/**
 * Determine if the current view is the view of the case step/assignment.
 * @param {Function} pConnect PConnect object for the component
 */
export declare function getIsAssignmentView(pConnect: Function): boolean;
/**
 * A hook that gets the instructions content for a view.
 * @param {Function} pConnect PConnect object for the component
 * @param {string} [instructions="casestep"] 'casestep', 'none', or the html content of a Rule-UI-Paragraph rule (processed via core's paragraph annotation handler)
 */
export declare function getInstructions(pConnect: Function, instructions?: string): any;
//# sourceMappingURL=utils.d.ts.map