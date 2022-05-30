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
  const [imageURL, setImageURL] = useState(null); // create a state that will contain our image url
  const [canvasheight, setCanvasheight] = useState(height);
  const [canvasWidth, setCanvasWidth] = useState(width);

  const save = () => {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    sigCanvas.current.off(['off']);
  };

  useEffect(() => {
    if (!imageURL) return;
    onSign(imageURL);
  });

  useEffect(() => {
    setCanvasheight(height);
    setCanvasWidth(width);
  }, [width, height]);

  return (
    <>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          height:canvasheight,
          width:canvasWidth,
          style: {
            position: "absolute",
            left: `${left}px`,
            bottom: `${bottom && bottom+2}px`,
            borderRadius: "5px",
            border: "solid 1px black",
            background: "white",
          },
        }}
      />
      <Button
        position="absolute"
        left={left && left - 110}
        bottom={bottom}
        width={100}
        onClick={save}
      >
        Send
      </Button>
    </>
  );
};

export default Signature;
