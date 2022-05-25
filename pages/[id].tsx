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
    const pdfDocPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfDocPdfBytes);
    const form = pdfDoc.getForm();
    const signatureFieldRect = form.getField("signature");
    const pngImageBytes = await fetch(imageURL).then((res) =>
      res.arrayBuffer()
    );
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    //@ts-ignore
    signatureFieldRect.setImage(pngImage);
    const pdfBytes = await pdfDoc.save();
    try {
      const response = await uploadFileV2("other", pdfBytes, "output");
      console.log(response, "res");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    hadlePDFUplaod(image);
  }, [image]);

  useEffect(() => {
    if (!url) return;
    getPDFPosition(url);
  }, [url]);

  return (
    <DocumentWrapper>
      <PdfViewer
        onPageLoad={({ height, width }) => {
          setCanvasSize({ height, width });
        }}
        url={url}
      />
      <Button
        position="absolute"
        left={recSize.x && recSize.x / (PDFSize.height / canvasSize.height)}
        bottom={recSize.y && recSize.y / (PDFSize.width / canvasSize.width)}
        width={(
          recSize.width && recSize.width / (PDFSize.width / canvasSize.width)
        )?.toString()}
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

interface Params {
  params: {
    id: string;
  };
}

export async function getStaticProps({ params }: Params) {
  try {
    const { template_url } = await httpClient.GetPDF(params.id);
    return {
      props: {
        url: template_url,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data: string[] = [];
  const paths = data.map((id) => {
    return { params: { id: id } };
  });

  return {
    paths: paths,
    fallback: true,
  };
}
