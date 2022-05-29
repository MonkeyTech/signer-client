import Signature from "../src/components/Data/Signature";
import PdfViewer from "../src/components/View/PdfViewer";
import { DocumentWrapper, PageLayout } from "../src/components/View/PdfPageRenderer.style";
import PopUpModal from "../src/components/PopUpModal/PopUpModal";
import { useState } from "react";
import success from "../src/assets/success.svg";
import { PDFDocument, PDFField, PDFForm } from "pdf-lib";
import { useEffect } from "react";
import httpClient from "../classes/httpClient";
import { uploadFileV2 } from "../src/utils";
import Image from "next/image";
import { ModalText } from "../src/components/PopUpModal/PopUpModal.style";
interface Props {
  url: string;
  token: string;
}
export interface IPDFSize {
  height: number;
  width: number;
}
export interface IRecSize {
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
  height: number | undefined;
}

const Home = ({ url, token }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [PDFSize, setPDFSize] = useState<IPDFSize>({ height: 0, width: 0 });
  const [PDFDoc, setPDFDoc] = useState<PDFDocument>();
  const [signatureFieldRect, setSignatureFieldRect] = useState<PDFField>();
  const [fingerprint, setFingerprint] = useState("");
  const [canvasSize, setCanvasSize] = useState<IPDFSize>({
    height: 0,
    width: 0,
  });
  const [recSize, setRecSize] = useState<IRecSize>({
    x: 0,
    y: 0,
    width: 150,
    height: 0,
  });

  async function getPDFPosition(url: string) {
    const pdfDocPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfDocPdfBytes);
    const page = pdfDoc.getPage(0);
    const form = pdfDoc.getForm();
    setPDFDoc(pdfDoc);
    const signatureFieldRect = form.getField("signature");
    setSignatureFieldRect(signatureFieldRect);
    const widgets = signatureFieldRect.acroField.getWidgets();
    setPDFSize(page.getSize());
    setRecSize({
      x: widgets[0].Rect()?.asRectangle().x,
      y: widgets[0].Rect()?.asRectangle().y,
      width: widgets[0].Rect()?.asRectangle().width,
      height: widgets[0].Rect()?.asRectangle().height,
    });
  }

  async function hadlePDFUplaod(imageURL: string | null) {
    if (!imageURL || !signatureFieldRect || !PDFDoc) return;
    const pngImageBytes = await fetch(imageURL).then((res) =>
      res.arrayBuffer()
    );
    const pngImage = await PDFDoc.embedPng(pngImageBytes);
    //@ts-ignore
    signatureFieldRect.setImage(pngImage);
    const pdfBytes = await PDFDoc.save();
    try {
      const response = await uploadFileV2(
        "other",
        pdfBytes,
        "output",
        token,
        fingerprint
      );
      setOpenModal(true);
      console.log("response", response);
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
    <PageLayout>
      <DocumentWrapper>
        <PdfViewer
          sendFingerprint={(fingerprint: string) => setFingerprint(fingerprint)}
          onPageLoad={({ height, width }) => {
            setCanvasSize({ height, width });
          }}
          url={url}
        />
        <Signature
          width={(
            recSize.width && recSize.width / (PDFSize.width / canvasSize.width)
          )?.toString()}
          height={(
            recSize.height &&
            recSize.height / (PDFSize.width / canvasSize.width)
          )?.toString()}
          left={recSize.x && recSize.x / (PDFSize.height / canvasSize.height)}
          bottom={recSize.y && recSize.y / (PDFSize.width / canvasSize.width)}
          onSign={(imageURL: string) => {
            setImage(imageURL);
          }}
        />
        {openModal && (
          <PopUpModal>
            <>
              <Image src={success} />
              <ModalText>הטופס נשלח בהצלחה!</ModalText>
            </>
          </PopUpModal>
        )}
      </DocumentWrapper>
    </PageLayout>
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
        token: params.id,
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
