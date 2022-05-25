import Signature from "../src/components/Data/Signature";
import PdfViewer from "../src/components/View/PdfViewer";
import { DocumentWrapper } from "../src/components/View/PdfPageRenderer.style";
import PopUpModal from "../src/components/PopUpModal/PopUpModal";
import { useState } from "react";
import { Button } from "../src/components/Data/Signature.style";
import { PDFDocument } from "pdf-lib";
import { useEffect } from "react";
import httpClient from "../classes/httpClient";
import { uploadFileV2 } from "../src/utils";
interface Props {
  url: string;
}
export interface IPDFSize {
  height: number;
  width: number;
}
export interface IRecSize {
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
}
const Home = () => {
  return <></>;
};

export default Home;
