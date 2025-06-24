import { create } from 'zustand';

interface PaymentFormStore {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    salaryId: number | null;
    setSalaryId: (id: number | null) => void;
}

export const usePaymentFormStore = create<PaymentFormStore>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    salaryId: null,
    setSalaryId: (id) => set({ salaryId: id }),
}));
