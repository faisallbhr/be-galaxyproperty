import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePaymentFormStore } from '@/stores/payment-form-store';
import { useSalaryFormStore } from '@/stores/salary-form-store';
import { Salary } from '@/types/salary';
import { decimalToPercent } from '@/utils/decimalToPercent';
import { parseRupiah } from '@/utils/parseRupiah';
import { router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const columns: ColumnDef<Salary>[] = [
    {
        header: 'No',
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: 'department_name',
        header: 'Departemen',
    },
    {
        accessorKey: 'amount',
        header: 'Gaji',
        cell: ({ row }) => {
            const amount = row.original.amount;
            return <>{parseRupiah(amount)}</>;
        },
    },
    {
        accessorKey: 'bonus',
        header: 'Bonus',
        cell: ({ row }) => {
            const bonus = row.original.bonus;
            return <>{parseRupiah(bonus)}</>;
        },
    },
    {
        accessorKey: 'pph',
        header: 'PPh',
        cell: ({ row }) => {
            const pph = row.original.pph;
            return <>{decimalToPercent(pph)}</>;
        },
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => {
            const total = row.original.total;
            return <>{parseRupiah(total)}</>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            const statusColors: Record<string, string> = {
                pending: 'bg-yellow-200 text-yellow-800',
                approved: 'bg-blue-200 text-blue-800',
                rejected: 'bg-red-200 text-red-800',
                paid: 'bg-green-200 text-green-800',
            };

            return <Badge className={`${statusColors[status]} font-semibold capitalize`}>{status}</Badge>;
        },
    },
    {
        header: 'Aksi',
        cell: ({ row }) => {
            const salary = row.original;
            const { props } = usePage();
            const userRole = props.userRole as 'director' | 'manager' | 'finance';

            const { setIsOpen, setIsEdit, setFormData } = useSalaryFormStore();
            const { setIsOpen: openPaymentDialog, setSalaryId } = usePaymentFormStore();

            const handleApprove = () => {
                router.patch(`/salaries/${salary.id}/review`, {
                    status: 'approved',
                });
            };

            const handleReject = () => {
                const notes = prompt('Alasan penolakan:');
                if (notes) {
                    router.patch(`/salaries/${salary.id}/review`, {
                        status: 'rejected',
                        notes,
                    });
                }
            };

            const handlePaid = () => {
                setSalaryId(salary.id);
                openPaymentDialog(true);
            };

            const handleDelete = () => {
                if (confirm(`Yakin ingin menghapus gaji departemen ${salary.department_name}?`)) {
                    router.delete(`/salaries/${salary.id}`, {
                        preserveScroll: true,
                    });
                }
            };

            const handleEdit = () => {
                setIsEdit(true);
                setFormData(salary);
                setIsOpen(true);
            };

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.visit(`/salaries/${salary.id}`)} className="cursor-pointer">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
