import Signature from "../src/components/Data/Signature";
import PdfViewer from "../src/components/View/PdfViewer";
import { DocumentWrapper } from "../src/components/View/PdfPageRenderer.style";
import PopUpModal from "../src/components/PopUpModal/PopUpModal";
import { useState } from "react";
import { Button } from "../src/components/Data/Signature.style";
import { PDFDocument } from "pdf-lib";
import download from "downloadjs";
import { useEffect } from "react";
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
const Home = ({ url }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [PDFSize, setPDFSize] = useState<IPDFSize>({ height: 0, width: 0 });
  const [canvasSize, setCanvasSize] = useState<IPDFSize>({
    height: 0,
    width: 0,
  });
  const [recSize, setRecSize] = useState<IRecSize>({ x: 0, y: 0, width: 150 });

  async function getPDFPosition(url: string) {
    const pdfDocPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfDocPdfBytes);
    const page = pdfDoc.getPage(0);
    const form = pdfDoc.getForm();
    const signatureFieldRect = form.getField("signature");
    const widgets = signatureFieldRect.acroField.getWidgets();

    setPDFSize(page.getSize());
    setRecSize({
      x: widgets[0].Rect()?.asRectangle().x,
      y: widgets[0].Rect()?.asRectangle().y,
      width: widgets[0].Rect()?.asRectangle().width,
    });
  }

  useEffect(() => {
    getPDFPosition("/pdfs/output.pdf");
  }, []);

  async function hadlePDFUplaod(imageURL: string | null) {
    if (!imageURL) return;
    const pdfDocPdfBytes = await fetch("/pdfs/output.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(pdfDocPdfBytes);
    const page = pdfDoc.getPage(0);
    const form = pdfDoc.getForm();
    const signatureFieldRect = form.getField("signature");
    const pngImageBytes = await fetch(imageURL).then((res) =>
      res.arrayBuffer()
    );
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    signatureFieldRect.setImage(pngImage);
    const pdfBytes = await pdfDoc.save();
  }

  useEffect(() => {
    hadlePDFUplaod(image);
  }, [image]);

  return (
    <DocumentWrapper>
      <PdfViewer
        onPageLoad={({ height, width }) => {
          setCanvasSize({ height, width });
        }}
        url={"/pdfs/output.pdf"}
      />
      <Button
        position="absolute"
        left={recSize.x && recSize.x / (PDFSize.height / canvasSize.height)}
        bottom={recSize.y && recSize.y / (PDFSize.width / canvasSize.width)}
        width={
          recSize.width && recSize.width / (PDFSize.width / canvasSize.width)
        }
        onClick={() => setOpenModal(true)}
      >
        Sign
      </Button>
      {openModal && (
        <PopUpModal onClose={() => setOpenModal(false)}>
          <Signature
            onSign={(imageURL: string) => {
              setOpenModal(false);
              setImage(imageURL);
            }}
          />
        </PopUpModal>
      )}
    </DocumentWrapper>
  );
};

export default Home;
