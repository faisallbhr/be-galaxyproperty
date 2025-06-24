import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentFormStore } from '@/stores/payment-form-store';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function PaymentFormDialog() {
    const { isOpen, setIsOpen, salaryId } = usePaymentFormStore();
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, reset, errors } = useForm({
        salary_id: salaryId,
        paid_at: '',
        notes: '',
        payment_proof: null as File | null,
    });

    useEffect(() => {
        if (isOpen && salaryId) {
            setData('salary_id', salaryId);
        }
    }, [isOpen, salaryId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.paid_at || !data.payment_proof) {
            alert('Harap isi semua field');
            return;
        }
        const formDataObj = new FormData();

        formDataObj.append('_method', 'PATCH');
        formDataObj.append('paid_at', data.paid_at);
        formDataObj.append('payment_proof', data.payment_proof);
        console.log(data);
        router.post(`/salaries/${salaryId}/paid`, formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileRef.current) fileRef.current.value = '';
                setIsOpen(false);
            },
        });
    };

    const handleClose = () => {
        reset();
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
                        <DialogDescription>Isi informasi dan unggah bukti pembayaran gaji</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="paid_at">Tanggal Pembayaran</Label>
                            <Input id="paid_at" type="date" value={data.paid_at} onChange={(e) => setData('paid_at', e.target.value)} />
                            {errors.paid_at && <p className="text-sm text-red-500">{errors.paid_at}</p>}
                        </div>

                        <div>
                            <Label htmlFor="payment_proof">Bukti Pembayaran (JPEG/JPG/PNG)</Label>
                            <Input
                                id="payment_proof"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={fileRef}
                                onChange={(e) => setData('payment_proof', e.target.files?.[0] ?? null)}
                            />
                            {errors.payment_proof && <p className="text-sm text-red-500">{errors.payment_proof}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
