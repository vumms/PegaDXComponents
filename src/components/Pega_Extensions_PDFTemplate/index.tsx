import { Children, type ReactElement, useEffect, useRef } from 'react';
import { Button, Grid, Flex, FieldGroup, withConfiguration, type GridContainerProps } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';
import DetailsRender from './DetailsRender';
// import html2canvas from "html2canvas";
// import { toCanvas } from "html-to-image";
import { snapdom } from "@zumer/snapdom";
import jsPDF from "jspdf"; 

import StyledPegaExtensionsPdfTemplateWrapper, { StyledDetailsGridContainer } from './styles';

// includes in bundle
import { getAllFields } from './utils';

// interface for props
interface PegaExtensionsPdfTemplateProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  base64String: string;
  showPDFDownloadButton: boolean;
  children: ReactElement[];
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsPdfTemplate(props: PegaExtensionsPdfTemplateProps) {

  const { getPConnect, label, children, showLabel = true, base64String, showPDFDownloadButton = true  } = props;
  const propsToUse = { label, showLabel, base64String, ...getPConnect().getInheritedProps() };
  const contentRef = useRef<HTMLDivElement>(null);  

  // update children with readonly
  Children.toArray(children).forEach((child : any) => {
    child.props.getPConnect().setInheritedProp('readOnly', true);
    child.props.getPConnect().setInheritedProp('displayMode', 'DISPLAY_ONLY');
  });

  const numRegions = getAllFields(getPConnect)?.length;
  const gridRepeat = "repeat(".concat(numRegions).concat(", 1fr)");

  const gridContainer: GridContainerProps = { colGap: 6 };
  gridContainer.cols = gridRepeat;
  gridContainer.alignItems = 'start';

  useEffect(() => {
    // some code here
    console.log(getPConnect().getCaseSummary());        
  }, [getPConnect]);

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  const generatePDF = async () => {
    const content = contentRef.current;
    if (!content) return;

    if ((document as any).fonts?.ready) await (document as any).fonts.ready;

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();   // pt
    const pageHeight = pdf.internal.pageSize.getHeight(); // pt

    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 40;

    const headerHeight = 80;

    const headerImg = await loadImage(propsToUse.base64String);

    /**
     * --------- RASTERIZE DOM with snapDOM ----------
     * Approach A: reusable capture object + toCanvas()
     * (keeps your existing cropping code unchanged)
     */
    const capture = await snapdom(content, {
      // Similar to html2canvas scale: higher = crisper output, more memory.
      scale: 2,

      // Inline web fonts for fidelity (optional; increases output size)
      embedFonts: true,

      // If you rely on cross-origin images or styles and cannot set CORS headers,
      // snapDOM offers a proxy mode. Leave disabled unless needed.
      // useProxy: true,   // see docs before enabling

      // You can force a fixed capture box if required:
      // width: content.scrollWidth,
      // height: content.scrollHeight,
    });
    const srcCanvas = await capture.toCanvas(); 
    const srcWpx = srcCanvas.width;
    const srcHpx = srcCanvas.height;

    // Target width in PDF (points) and corresponding pixel→point conversion
    const targetWidthPts = pageWidth - marginLeft - marginRight;
    const pxPerPt = srcWpx / targetWidthPts;
    const ptsPerPx = 1 / pxPerPt;

    // First page: available area in points/pixels
    const firstTopPts = headerHeight + 20 + 50; // header + details spacing (same as Method A)
    const firstUsablePts = pageHeight - firstTopPts - marginBottom;
    const firstSlicePx = Math.max(0, Math.floor(firstUsablePts * pxPerPt));

    // Subsequent pages: constant usable area per page
    const subsequentUsablePts = pageHeight - marginTop - marginBottom;
    const subsequentSlicePx = Math.floor(subsequentUsablePts * pxPerPt);

    // Helper to crop a vertical slice
    const cropSlice = (startYpx: number, heightPx: number): string => {
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = srcWpx;
      sliceCanvas.height = heightPx;

      const ctx = sliceCanvas.getContext("2d")!;
      ctx.drawImage(srcCanvas, 0, startYpx, srcWpx, heightPx, 0, 0, srcWpx, heightPx);
      return sliceCanvas.toDataURL("image/png");
    };

    let printedPx = 0;
    let pageNo = 1;

    // ---------- FIRST PAGE ----------
    pdf.addImage(headerImg, "PNG", 0, 0, pageWidth, headerHeight);

    // Case details
    const infoStartY = headerHeight + 20;
    pdf.setFontSize(20);
    pdf.text("AUSTRAC Update Business Profile Form", pageWidth - marginRight, infoStartY, { align: "right" });
    pdf.setFontSize(10);
    pdf.text(`Receipt number: ${getPConnect().getCaseSummary().caseTypeID}`, pageWidth - marginRight, infoStartY + 20, { align: "right" });
    pdf.text(`Case submitted on ${getPConnect().getCaseSummary().lastUpdateTime}`, pageWidth - marginRight, infoStartY + 35, { align: "right" });

    // Crop and add first slice
    const firstDataUrl = cropSlice(printedPx, Math.min(firstSlicePx, srcHpx - printedPx));
    const firstSlicePtsHeight = Math.min(firstSlicePx, srcHpx - printedPx) * ptsPerPx;

    pdf.addImage(firstDataUrl, "PNG", marginLeft, firstTopPts, targetWidthPts, firstSlicePtsHeight);
    printedPx += firstSlicePx;

    // Footer
    pdf.setFontSize(10);
    pdf.text(`Page ${pageNo}`, pageWidth - marginRight, pageHeight - marginBottom / 2, { align: "right" });

    // ---------- SUBSEQUENT PAGES ----------
    while (printedPx < srcHpx) {
      pdf.addPage();
      pageNo += 1;

      const slicePx = Math.min(subsequentSlicePx, srcHpx - printedPx);
      const dataUrl = cropSlice(printedPx, slicePx);
      const slicePtsHeight = slicePx * ptsPerPx;

      pdf.addImage(dataUrl, "PNG", marginLeft, marginTop, targetWidthPts, slicePtsHeight);

      printedPx += slicePx;

      pdf.setFontSize(10);
      pdf.text(`Page ${pageNo}`, pageWidth - marginRight, pageHeight - marginBottom / 2, { align: "right" });
    }

    pdf.save("document.pdf");
  };

  return (        
    <div data-identifier="orbit-pdf_wrapper">           
      <div ref={contentRef}>
        <StyledPegaExtensionsPdfTemplateWrapper>
          <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>      
            <Grid 
              as={StyledDetailsGridContainer}
              container={gridContainer}
              data-testid={`column-count-${numRegions}`} >
                {children.map((child: any, i: number) => (
                  <Flex
                    // @ts-ignore
                    container={{ direction: 'column', alignItems: 'normal', colGap: 1, rowGap: 1.5 }}
                    key={`r-${i + 1}`}
                  >
                    <DetailsRender child={child} />
                  </Flex>
                ))}
            </Grid>
          </FieldGroup>          
        </StyledPegaExtensionsPdfTemplateWrapper>
      </div>
      {/* Keep the PDF download button UI element outside contentRef ref, so it doesn't get used inside PDF generation  */} 
      {showPDFDownloadButton && (      
          <Button onClick={generatePDF}>Download PDF</Button>                   
      )}   
    </div>
  );

}

export default withConfiguration(PegaExtensionsPdfTemplate);
