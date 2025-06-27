import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFGeneratorProps {
  contentRef: React.RefObject<HTMLElement| null>;
  fileName?: string;
}

interface PDFGeneratorResult {
  previewOpen: boolean;
  previewImage: string | null;
  isCapturing: boolean;
  handleGeneratePDF: () => Promise<void>;
  handleConfirmDownload: () => void;
  handleClosePreview: () => void;
}

export const usePDFGenerator = ({ contentRef, fileName = 'Report' }: PDFGeneratorProps): PDFGeneratorResult => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleGeneratePDF = useCallback(async () => {
    if (!contentRef.current) {
      console.error('Error: contentRef is not defined');
      alert('Error: No se pudo generar la vista previa. El contenedor de PDF no está disponible.');
      return;
    }
    

    setIsCapturing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      if (imgData) {
        setPreviewImage(imgData);
        setPreviewOpen(true);
      } else {
        alert('Error: No se pudo generar la imagen.');
      }
    } catch (error) {
      console.error('Error generando vista previa:', error);
      alert('Error al generar la vista previa. Revisa la consola para más detalles.');
    } finally {
      setIsCapturing(false);
    }
  }, [contentRef]);

  const handleConfirmDownload = useCallback(() => {
    if (!previewImage) {
      console.error('Error: No hay imagen para generar el PDF');
      alert('Error: No hay imagen disponible para generar el PDF.');
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter',
      });

      const img = new Image();
      img.src = previewImage;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.min((pdfWidth - 2 * margin) / imgWidth, (pdfHeight - 2 * margin) / imgHeight);
      const scaledWidth = imgWidth * ratio;
      let scaledHeight = imgHeight * ratio;

      const pageHeight = (pdfHeight - 2 * margin) / ratio;
      let yOffset = 0;

      while (yOffset < imgHeight) {
        if (yOffset > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          previewImage,
          'JPEG',
          margin,
          margin,
          scaledWidth,
          Math.min(scaledHeight, pdfHeight - 2 * margin),
          undefined,
          'FAST',
          0,
        );
        yOffset += pageHeight;
        scaledHeight -= (pdfHeight - 2 * margin);
      }

      pdf.save(`${fileName}.pdf`);
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    }
  }, [fileName, previewImage]);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreviewImage(null);
  }, []);

  return {
    previewOpen,
    previewImage,
    isCapturing,
    handleGeneratePDF,
    handleConfirmDownload,
    handleClosePreview,
  };
};