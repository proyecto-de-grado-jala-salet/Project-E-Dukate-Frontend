import QRPayment from '@/pages/QRPayment/QRPayment'

interface PageProps {
  params: {
    appointmentId: string
  }
}

const QRPaymentPage = ({ params }: PageProps) => {
  return (
    <QRPayment appointmentId={params.appointmentId} />
  )
}

export default QRPaymentPage