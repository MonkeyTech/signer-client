import React, { useEffect, useState } from "react";
import PdfJS from "../../../lib/PdfJS";

type ChildrenProps = {
  pages: PdfJS.PDFPageProxy[];
};

type Props = {
  url: string;
  children: (props: ChildrenProps) => any;
};

const PdfDocument = ({ url, children }: Props) => {
  const [doc, setDoc] = useState<PdfJS.PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PdfJS.PDFPageProxy[]>([]);

  useEffect(() => {
    if(!url) return;
    PdfJS.getDocument(url).promise.then((newDoc: PdfJS.PDFDocumentProxy) => {
      setDoc(newDoc);
    });
  }, [url]);

  useEffect(() => {
    if (!doc) return;

    const newPages: PdfJS.PDFPageProxy[] = [];
    console.log(doc.fingerprints[0]);
    let promise = Promise.resolve();
    for (let i = 0; i < doc.numPages; ++i) {
      promise = promise.then(() => {
        return doc.getPage(i + 1).then((page: PdfJS.PDFPageProxy) => {
          newPages.push(page);
        });
      });
    }

    promise.then(() => {
      setPages(newPages);
    });
  }, [doc]);

  return children({ pages });
};

export default PdfDocument;
