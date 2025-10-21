import QRPayment from '@/pages/QRPayment/QRPayment'

type PageProps = {
  params: Promise<{ appointmentId: string }>;
}

export default async function QRPaymentPage({ params }: PageProps) {
  const { appointmentId } = await params;

  return (
    <QRPayment appointmentId={appointmentId} />
  )
}