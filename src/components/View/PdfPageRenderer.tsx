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

  const [load, setLoad] = useState(false);
  const [width, setWidth] = useState(0);
  const [canvasBounds, setCanvasBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!container.current) return;

    const rect = container.current.getBoundingClientRect();
    setWidth(rect.width);
    setLoad(true);

    return () => {
      setLoad(false);
    };
  }, [page]);

  useEffect(() => {
    if (!load || !canvas.current) return;
    let viewport = page.getViewport({ scale: 1 });

    const canvasContext = canvas.current.getContext("2d");
    if (!canvasContext) return;

    const scale = width / viewport.width;
    viewport = page.getViewport({ scale });
    page.render({
      canvasContext,
      viewport,
    });
    setCanvasBounds({
      width: viewport.width,
      height: viewport.height,
    });

    onPageLoad({ height: viewport.height, width: viewport.width });
  }, [load]);

  useEffect(() => {
    function handleResize() {
      drewCanvas();
    }
    window.addEventListener("resize", handleResize, { passive: false });
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, []);

  function drewCanvas() {
    if (!container.current || !canvas.current) return;
    const rect = container.current.getBoundingClientRect();
    const canvasContext = canvas.current.getContext("2d");
    if (!canvasContext) return;
    setWidth(rect.width);
    let viewport = page.getViewport({ scale: 1 });
    const scale = rect.width / viewport.width;
    viewport = page.getViewport({ scale });
    setCanvasBounds({
      width: viewport.width,
      height: viewport.height,
    });
    page.render({
      canvasContext,
      viewport,
    });

    onPageLoad({ height: viewport.height, width: viewport.width });
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
