import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSalaryFormStore } from '@/stores/salary-form-store';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function SalaryFormDialog() {
    const { isEdit, setIsOpen, isOpen, formData: initialData } = useSalaryFormStore();

    const {
        data: formData,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        department_name: '',
        amount: 0,
        bonus: 0,
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setData({
                department_name: initialData.department_name || '',
                amount: initialData.amount || 0,
                bonus: initialData.bonus || 0,
            });
        } else if (isOpen) {
            reset();
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            reset();
            setIsOpen(false);
        };

        if (isEdit && initialData?.id) {
            put(`/salaries/${initialData.id}`, {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post('/salaries', {
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    const handleCancel = () => {
        reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-center">{isEdit ? 'Edit Data Permintaan Gaji' : 'Tambah Data Permintaan Gaji'}</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="department_name">Departemen</Label>
                            <Input
                                id="department_name"
                                value={formData.department_name}
                                onChange={(e) => setData('department_name', e.target.value)}
                                className="mt-2"
                            />
                            {errors.department_name && <p className="text-sm text-red-500">{errors.department_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="amount">Gaji Pokok</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setData('amount', Number(e.target.value))}
                                className="mt-2"
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>
                        <div>
                            <Label htmlFor="bonus">Bonus</Label>
                            <Input
                                id="bonus"
                                type="number"
                                value={formData.bonus}
                                onChange={(e) => setData('bonus', Number(e.target.value))}
                                className="mt-2"
                            />
                            {errors.bonus && <p className="text-sm text-red-500">{errors.bonus}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
