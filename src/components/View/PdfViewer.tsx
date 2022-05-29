import React from "react";
import { IPDFSize } from "../../../pages";
import PdfDocument from "../Data/PdfDocument";
import PdfPageRenderer from "./PdfPageRenderer";

type Props = {
  url: string;
  onPageLoad: ({height, width}:IPDFSize)=> void;
  sendFingerprint: (fingerprint: string)=> void;
};

const PdfViewer = ({ url, onPageLoad, sendFingerprint }: Props) => {
  return (
    <>
      <PdfDocument sendFingerprint={(fingerprint: string)=>sendFingerprint(fingerprint)} url={url}>
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
