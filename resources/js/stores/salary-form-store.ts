import { Salary } from '@/types/salary';
import { create } from 'zustand';

interface SalaryFormStore {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    formData: Partial<Salary>;
    setFormData: (data: Partial<Salary>) => void;
}

const defaultValues: Partial<Salary> = {
    department_name: '',
    amount: 0,
    bonus: 0,
};

export const useSalaryFormStore = create<SalaryFormStore>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    isEdit: false,
    setIsEdit: (isEdit) => set({ isEdit }),
    formData: defaultValues,
    setFormData: (data: Partial<Salary>) =>
        set(() => ({
            formData: Object.keys(data).length === 0 ? defaultValues : { ...defaultValues, ...data },
        })),
}));
