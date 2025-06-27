/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { usePaymentMetrics } from '@/hooks/usePaymentMetrics';
import {
  MetricCard,
  TotalIncomeChart,
  StatusCountsChart,
  PendingVsCompletedChart,
} from '@/components/Metrics/PaymentMetrics';
import { GenericFilterContainer } from '@/components/GenericFilters';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export const PaymentMetrics: React.FC = () => {
  const {
    availableYears,
    totalIncomeData,
    pendingVsCompletedData,
    statusCountsData,
    institutionEarningsData,
    error,
    totalIncomePeriodType,
    totalIncomeFilters,
    statusCountsFilters,
    institutionEarningsFilters,
    resetTotalIncomeFilters,
    resetStatusCountsFilters,
    resetInstitutionEarningsFilters,
    retryFetch,
  } = usePaymentMetrics();

  const componentRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const chartDataPendingVsCompleted = pendingVsCompletedData
    ? [
        { status: 'Pending', count: pendingVsCompletedData.pendingAmount ?? 0 },
        { status: 'Completed', count: pendingVsCompletedData.completedAmount ?? 0 },
      ]
    : null;

  const chartDataStatusCounts = statusCountsData
    ? [
        { status: 'Pending', count: statusCountsData.pendingCount },
        { status: 'Completed', count: statusCountsData.completedCount },
      ]
    : null;

  const chartDataTotalIncome = totalIncomeData
    ? totalIncomeData.map((item) => ({
        status: item.period,
        count: item.totalIncome,
      }))
    : [];
  
  useEffect(() => {
    if (pdfContentRef.current) {
      console.log('Contenido de pdfContentRef:', pdfContentRef.current.innerHTML);
    }
  }, [availableYears, pendingVsCompletedData, institutionEarningsData]);

  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current) {
      console.error('Error: pdfContentRef no está definido');
      alert('Error: No se pudo generar la vista previa. El contenedor de PDF no está disponible.');
      return;
    }

    setIsCapturing(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
        windowWidth: 612,
        windowHeight: pdfContentRef.current.scrollHeight,
      });
      console.log('Dimensiones del canvas:', canvas.width, 'x', canvas.height);
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Imagen generada:', imgData ? 'Éxito' : 'Vacía');
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
  };

  const handleConfirmDownload = () => {
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
      let pageCount = 1;

      while (yOffset < imgHeight) {
        if (yOffset > 0) {
          pdf.addPage();
          pageCount++;
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

      console.log('PDF generado con', pageCount, 'páginas');
      pdf.save('PaymentMetrics_Report.pdf');
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Box sx={{ p: 3 }} ref={componentRef}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000" }}>
            Métricas de Pagos
          </Typography>
          <Button
            variant="contained"
            onClick={handleDownloadPDF}
            sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: "10px" }}
          >
            Descargar en PDF
          </Button>
        </Box>
        {error && (
          <Box
            sx={{
              mt: 2,
              bgcolor: "error.light",
              p: 2,
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Typography color="error">{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={retryFetch}
            >
              Reintentar
            </Button>
          </Box>
        )}
        {availableYears.length === 0 && !error && (
          <Typography color="textSecondary" sx={{ mt: 2, textAlign: "center" }}>
            No hay datos de pagos registrados.
          </Typography>
        )}
        {(availableYears.length > 0 || pendingVsCompletedData) && (
          <>
            <Box sx={{ mt: 3 }}>
              {institutionEarningsFilters.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <GenericFilterContainer
                    filters={institutionEarningsFilters}
                    onResetFilters={resetInstitutionEarningsFilters}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {pendingVsCompletedData ? (
                  <>
                    <MetricCard
                      label="Monto Pendiente"
                      value={pendingVsCompletedData.pendingAmount}
                    />
                    <MetricCard
                      label="Monto Completado"
                      value={pendingVsCompletedData.completedAmount}
                    />
                  </>
                ) : (
                  <Typography
                    color="textSecondary"
                    align="center"
                    sx={{ width: "100%" }}
                  >
                    No hay datos disponibles para los montos.
                  </Typography>
                )}
                {institutionEarningsData ? (
                  <MetricCard
                    label="Ganancias Totales"
                    value={institutionEarningsData.totalInstitutionEarnings}
                  />
                ) : (
                  <Typography
                    color="textSecondary"
                    align="center"
                    sx={{ width: "100%" }}
                  >
                    No hay datos disponibles para las ganancias.
                  </Typography>
                )}
              </Box>
            </Box>
            {availableYears.length > 0 && (
              <>
                <TotalIncomeChart
                  filters={totalIncomeFilters}
                  data={chartDataTotalIncome}
                  periodType={totalIncomePeriodType}
                  onResetFilters={resetTotalIncomeFilters}
                  showFilters={true}
                />
                <StatusCountsChart
                  filters={statusCountsFilters}
                  data={chartDataStatusCounts || []}
                  onResetFilters={resetStatusCountsFilters}
                  showFilters={true}
                />
              </>
            )}
            {pendingVsCompletedData && (
              <PendingVsCompletedChart
                data={chartDataPendingVsCompleted || []}
              />
            )}
          </>
        )}
      </Box>
      <Box
        ref={pdfContentRef}
        sx={{
          display: isCapturing ? "block" : "none",
          position: isCapturing ? "absolute" : "static",
          left: isCapturing ? "-9999px" : "auto",
          top: isCapturing ? "-9999px" : "auto",
          width: isCapturing ? "1612px" : "auto",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000" }}>
              Métricas de Pagos
            </Typography>
          </Box>
          {error && (
            <Box
              sx={{
                mt: 2,
                bgcolor: "error.light",
                p: 2,
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography color="error">{error}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                onClick={retryFetch}
              >
                Reintentar
              </Button>
            </Box>
          )}
          {availableYears.length === 0 && !error && (
            <Typography
              color="textSecondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              No hay datos de pagos registrados.
            </Typography>
          )}
          {(availableYears.length > 0 || pendingVsCompletedData) && (
            <>
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {pendingVsCompletedData ? (
                    <>
                      <MetricCard
                        label="Monto Pendiente"
                        value={pendingVsCompletedData.pendingAmount}
                      />
                      <MetricCard
                        label="Monto Completado"
                        value={pendingVsCompletedData.completedAmount}
                      />
                    </>
                  ) : (
                    <Typography
                      color="textSecondary"
                      align="center"
                      sx={{ width: "100%" }}
                    >
                      No hay datos disponibles para los montos.
                    </Typography>
                  )}
                  {institutionEarningsData ? (
                    <MetricCard
                      label="Ganancias Totales"
                      value={institutionEarningsData.totalInstitutionEarnings}
                    />
                  ) : (
                    <Typography
                      color="textSecondary"
                      align="center"
                      sx={{ width: "100%" }}
                    >
                      No hay datos disponibles para las ganancias.
                    </Typography>
                  )}
                </Box>
              </Box>
              {availableYears.length > 0 && (
                <>
                  <TotalIncomeChart
                    filters={totalIncomeFilters}
                    data={chartDataTotalIncome}
                    periodType={totalIncomePeriodType}
                    onResetFilters={resetTotalIncomeFilters}
                    showFilters={false}
                  />
                  <StatusCountsChart
                    filters={statusCountsFilters}
                    data={chartDataStatusCounts || []}
                    onResetFilters={resetStatusCountsFilters}
                    showFilters={false}
                  />
                </>
              )}
              {pendingVsCompletedData && (
                <PendingVsCompletedChart
                  data={chartDataPendingVsCompleted || []}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth={false}
        disableEnforceFocus
        sx={{
          "& .MuiDialog-paper": {
            width: "612px",
            maxHeight: "90vh",
            bgcolor: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#000" }}>Vista Previa del PDF</DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          {previewImage ? (
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              wheel={{ step: 0.1 }}
              doubleClick={{ mode: "toggle" }}
            >
              <TransformComponent>
                <Box
                  sx={{
                    width: "652px",
                    height: "auto",
                    bgcolor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Vista previa del PDF"
                    style={{
                      width: "100%",
                      maxHeight: "73vh",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <Typography color="error" align="center">
              No se pudo generar la vista previa.
            </Typography>
          )}
          <Typography
            variant="body2"
            sx={{ mt: 1, display: "block", textAlign: "center" }}
          >
            Usa la rueda del ratón para hacer zoom y arrastra para desplazarte.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePreview}
            variant="outlined"
            sx={{
              color: "red",
              borderColor: "red",
              borderRadius: "10px",
              "&:hover": {
                borderColor: "darkred",
                color: "darkred",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDownload}
            variant="contained"
            sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: "10px" }}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentMetrics;