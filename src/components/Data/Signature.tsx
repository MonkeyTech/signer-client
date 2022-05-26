import Image from "next/image";
import { useEffect } from "react";
import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "./Signature.style";

interface Props {
  left: number | undefined;
  bottom: number | undefined;
  width: string | undefined;
  height: string | undefined;
  onSign: (imageURL: string) => void;
}
const Signature = ({ onSign, left, bottom, width, height }: Props) => {
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
            position: "absolute",
            left: `${left}px`,
            bottom: `${bottom}px`,
            border: "solid 1px black",
            borderRadius: "10px",
            background: "white",
            height: "150px",
            width: "500px",
          },
        }}
      />
      <Button
        position="absolute"
        left={left && left - 110}
        bottom={bottom}
        width={"100"}
        onClick={save}
      >
        Send
      </Button>
    </>
  );
};

export default Signature;
