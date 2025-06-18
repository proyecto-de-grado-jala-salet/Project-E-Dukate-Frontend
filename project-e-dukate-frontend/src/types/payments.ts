import { GenericItem } from "./table";

export interface Payment extends GenericItem {
  id: string;
  patientId: string;
  firstPaymentDate: string | null;
  lastPaymentDate: string | null;
  sessionCount: number;
  sessionCost: number;
  amountPaid: number;
  pendingAmount: number;
  specialistAmount: number;
  institutionAmount: number;
  status: string;
  totalAmount: number;
}