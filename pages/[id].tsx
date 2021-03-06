import Signature from "../src/components/Data/Signature";
import PdfViewer from "../src/components/View/PdfViewer";
import {
  DocumentWrapper,
  PageLayout,
} from "../src/components/View/PdfPageRenderer.style";
import PopUpModal from "../src/components/PopUpModal/PopUpModal";
import { useState } from "react";
import success from "../src/assets/success.svg";
import decline from "../src/assets/decline.svg";
import { PDFDocument, PDFSignature, PDFTextField } from "pdf-lib";
import { useEffect } from "react";
import httpClient from "../classes/httpClient";
import { uploadFileV2 } from "../src/utils";
import Image from "next/image";
import { ModalText } from "../src/components/PopUpModal/PopUpModal.style";
import FingerprintJS, {
  Agent,
  Component,
  GetResult,
  UnknownComponents,
} from "@fingerprintjs/fingerprintjs";
import { IPDFSize, IRecSize } from "../src/utils/interface";
interface Props {
  url: string;
  token: string;
}

const Home = ({ url, token }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [PDFSize, setPDFSize] = useState<IPDFSize>({ height: 0, width: 0 });
  const [PDFDoc, setPDFDoc] = useState<PDFDocument>();
  const [hasError, setHasError] = useState(false);
  const [signatureFieldRect, setSignatureFieldRect] = useState<PDFTextField>();
  const [fingerprint, setFingerprint] = useState("");
  const [docFingerprint, setDocFingerprint] = useState("");
  const [timeStamp, setTimeStamp] = useState<number>();
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

  const getPDFPosition = async (url: string) => {
    const pdfDocPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfDocPdfBytes);
    const page = pdfDoc.getPage(0);
    const form = pdfDoc.getForm();
    setPDFDoc(pdfDoc);
    const signatureFieldRect: PDFTextField = form.getTextField("signature");
    setSignatureFieldRect(signatureFieldRect);
    const widgets = signatureFieldRect.acroField.getWidgets();
    setPDFSize(page.getSize());
    setRecSize({
      x: widgets[0].Rect()?.asRectangle().x,
      y: widgets[0].Rect()?.asRectangle().y,
      width: widgets[0].Rect()?.asRectangle().width,
      height: widgets[0].Rect()?.asRectangle().height,
    });
  };

  const hadlePDFUplaod = async (imageURL: string | null) => {
    if (!imageURL || !signatureFieldRect || !PDFDoc) return;
    const pngImageBytes = await fetch(imageURL).then((res) =>
      res.arrayBuffer()
    );
    const pngImage = await PDFDoc.embedPng(pngImageBytes);
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
      setTimeStamp(+new Date());
      if (response === null) setHasError(true);
    } catch (error: any) {
      setHasError(true);
      console.log(error);
    }
  };

  const handleOnSign = (imageURL: string) => {
    getFingerPrint();
    setImage(imageURL);
  };

  const getFingerPrint = () => {
    FingerprintJS.load()
      .then((fp: Agent) => {
        return fp.get({});
      })
      .then((result: GetResult) => {
        createNewFingerprint(result);
      });
  };

  const createNewFingerprint = async (result: GetResult) => {
    const extendedComponents: UnknownComponents = {
      timeStamp: { value: +new Date() } as Component<unknown>,
      docFingerprint: { value: docFingerprint } as Component<unknown>,
      visitorId: { value: result.visitorId } as Component<unknown>,
    };
    const newFingerprint = FingerprintJS.hashComponents(extendedComponents);
    console.log(newFingerprint, "sss");
  };

  useEffect(() => {
    hadlePDFUplaod(image);
  }, [image]);

  useEffect(() => {
    if (!url) return;
    getPDFPosition(url);
  }, [url]);

  useEffect(() => {
    getFingerPrint();
  }, []);

  return (
    <PageLayout>
      <DocumentWrapper>
        <PdfViewer
          getDocFingerprint={(fp: string) => setDocFingerprint(fp)}
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
            handleOnSign(imageURL);
          }}
        />
        {openModal && (
          <PopUpModal
            closeButton={hasError}
            onClose={() => setOpenModal(false)}
          >
            <>
              <Image src={hasError ? decline : success} />
              <ModalText>{`${
                hasError ? "???? ???????? ?????????? ???? ??????????" : "?????????? ???????? ????????????!"
              }`}</ModalText>
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
      revalidate: 10,
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
