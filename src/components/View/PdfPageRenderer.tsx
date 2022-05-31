import React, { useEffect, useRef, useState } from "react";
import PdfJS from "../../../lib/PdfJS";
import { IPDFSize } from "../../../pages";
import { Canvas, CanvasWrapper } from "./PdfPageRenderer.style";

type Props = {
  page: PdfJS.PDFPageProxy;
  onPageLoad: ({ height, width }: IPDFSize) => void;
};

const PdfPageRenderer = ({ page, onPageLoad }: Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const redrawRef = useRef<boolean>(true);
  const loadRef = useRef<boolean>(false);

  const [canvasBounds, setCanvasBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    drawCanvas();
  }, [page]);

  useEffect(() => {
    function handleResize() {
      drawCanvas();
    }
    window.addEventListener("resize", handleResize, { passive: false });
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, []);

  function drawCanvas() {
    if (!container.current || !canvas.current) return;

    if (loadRef.current) {
      redrawRef.current = true;
      return;
    }
    loadRef.current = true;

    const rect = container.current.getBoundingClientRect();
    const canvasContext = canvas.current.getContext("2d");
    if (!canvasContext) return;
    let viewport = page.getViewport({ scale: 1 });
    const scale = rect.width / viewport.width;
    viewport = page.getViewport({ scale });
    setCanvasBounds({
      width: viewport.width,
      height: viewport.height,
    });
    let task = page.render({
      canvasContext,
      viewport,
    });
    task.promise.then(() => {
      loadRef.current = false;
      if (redrawRef.current) {
        redrawRef.current = false;
        drawCanvas();
        return;
      }

      onPageLoad({ height: viewport.height, width: viewport.width });
    });
  }

  return (
    <CanvasWrapper ref={container}>
      <Canvas
        ref={canvas}
        width={canvasBounds.width}
        height={canvasBounds.height}
      />
    </CanvasWrapper>
  );
};

export default PdfPageRenderer;
