import Image from "next/image";
import { useEffect } from "react";
import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "./Signature.style";

interface Props {
  onSign: (imageURL: string) => void;
}
const Signature = ({ onSign }: Props) => {
  const sigCanvas = useRef() as React.MutableRefObject<any>;
  const [openSig, setOpenSig] = useState(false);
  const [imageURL, setImageURL] = useState(null); // create a state that will contain our image url

  const save = () => {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  useEffect(() => {
    if (!imageURL) return;
    onSign(imageURL);
  });

  return (
    <>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          style: {
            border: "solid 1px black",
            borderRadius: "10px",
            background: "white",
            height: "100px",
            width: "250px",
            marginBottom: "10px",
          },
        }}
      />
      <Button
        onClick={() => {
          save();
        }}
      >
        Sign
      </Button>
    </>
  );
};

export default Signature;
