import { pdfjs as PdfJS } from "react-pdf";

PdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PdfJS.version}/pdf.worker.min.js`;

export default PdfJS;

