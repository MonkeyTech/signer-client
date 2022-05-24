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
const Home = ({ url }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [PDFSize, setPDFSize] = useState<IPDFSize>({ height: 0, width: 0 });
  const [canvasSize, setCanvasSize] = useState<IPDFSize>({
    height: 0,
    width: 0,
  });
  const [recSize, setRecSize] = useState<IRecSize>({ x: 0, y: 0, width: 150 });
  const [signedPDF, setSignedPDF] = useState();

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
    try {
      const response = await uploadFileV2(
        'other',
        pdfBytes,
        "output",
      );
      console.log(response,'res');
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    hadlePDFUplaod(image);
  }, [image]);

  useEffect(() => {
    getPDFPosition("/pdfs/output.pdf");
  }, []);

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

export async function getStaticProps() {
  try {
    const { template_url } = await httpClient.GetPDF(
      "da1652330dd51d4253231b79b59b05699da45ae07799822f6bd58b00c0f16f2201da78ac50bcf80ec7821b0566c1bd5b860dddde5f8a06ec73014a89284d416de57ec0f2b99768c4a51cb47e60e052bcdc281a851b2a23777adc1169aabe945b2efa2ef2f05cc1b512a050c110a3ae18bcc8b335714be3cf4109d165c2c7d9e9f94bf6c148c1382c5549a31537c08ec77f5463ee6428861637b7c266a4cd4044c13cb15cbc9ddbb61f0b5e0c2872db7116224632f4570aa99a86c09d9dcd2f6cdb230d8d5bfa636b485ec16e164fccfa2eb8f13c5154e217a689d6ca8057f16c7cece06a7f845863e3749ea7c24ab59a96a0d07623dbe5733850fe46fb596757"
    );
    return {
      props: {
        url: template_url,
      },
    };
  } catch (err) {
    console.log(err);

    return { notFound: true };
  }
}
