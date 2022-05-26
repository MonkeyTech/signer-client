import React from "react";
import { IPDFSize } from "../../../pages";
import PdfDocument from "../Data/PdfDocument";
import PdfPageRenderer from "./PdfPageRenderer";

type Props = {
  url: string;
  onPageLoad: ({height, width}:IPDFSize)=> void;
};

const PdfViewer = ({ url, onPageLoad }: Props) => {
  return (
    <>
      <PdfDocument url={url}>
        {({ pages }) => {
          return pages.map((page, index) => {
            return (
              <PdfPageRenderer
                onPageLoad={({height, width}) => onPageLoad({height, width})}
                key={index.toString()}
                page={page}
              />
            );
          });
        }}
      </PdfDocument>
    </>
  );
};

export default PdfViewer;
