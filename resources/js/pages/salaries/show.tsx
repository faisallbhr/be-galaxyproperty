import PaymentFormDialog from '@/components/salaries/payment-form-dialog';
import SalaryFormDialog from '@/components/salaries/salary-form-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { usePaymentFormStore } from '@/stores/payment-form-store';
import { useSalaryFormStore } from '@/stores/salary-form-store';
import { type BreadcrumbItem } from '@/types';
import { Salary } from '@/types/salary';
import { decimalToPercent } from '@/utils/decimalToPercent';
import { parseRupiah } from '@/utils/parseRupiah';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    Calculator,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Gift,
    Pencil,
    Receipt,
    Trash2,
    TrendingUp,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <Clock className="h-4 w-4" />,
                    label: 'Menunggu',
                };
            case 'approved':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    label: 'Disetujui',
                };
            case 'paid':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <CreditCard className="h-4 w-4" />,
                    label: 'Dibayar',
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <XCircle className="h-4 w-4" />,
                    label: 'Ditolak',
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Clock className="h-4 w-4" />,
                    label: status,
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${config.color}`}>
            {config.icon}
            {config.label}
        </div>
    );
};

export default function Show({ salary }: { salary: { data: Salary } }) {
    const { props } = usePage();

    const userRole = props.userRole as 'director' | 'manager' | 'finance';
    const flash = (props.flash ?? {}) as { success?: string; error?: string };

    useEffect(() => {
        if (flash.success) {
            toast.success('Berhasil', {
                description: flash.success,
                style: {
                    background: '#22c55e',
                    color: '#fff',
                },
            });
        }

        if (flash.error) {
            toast.error('Gagal', {
                description: flash.error,
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
            });
        }
    }, [flash]);

    const { setIsOpen, setIsEdit, setFormData } = useSalaryFormStore();
    const { setIsOpen: openPaymentDialog, setSalaryId } = usePaymentFormStore();

    const handleApprove = () => {
        router.patch(`/salaries/${salary.data.id}/review`, {
            status: 'approved',
        });
    };

    const handleReject = () => {
        const notes = prompt('Alasan penolakan:');
        if (notes) {
            router.patch(`/salaries/${salary.data.id}/review`, {
                status: 'rejected',
                notes,
            });
        }
    };

    const handlePaid = () => {
        setSalaryId(salary.data.id);
        openPaymentDialog(true);
    };

    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus gaji departemen ${salary.data.department_name}?`)) {
            router.delete(`/salaries/${salary.data.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleEdit = () => {
        setIsEdit(true);
        setFormData(salary.data);
        setIsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Departemen ${salary.data.department_name}`} />

            <div className="space-y-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Detail Gaji Departemen {salary.data.department_name}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={salary.data.status} />
                        <div className="flex flex-wrap items-center gap-2">
                            {userRole === 'finance' && salary.data.status === 'pending' && (
                                <>
                                    <Button variant="outline" size="sm" onClick={handleEdit} className="flex cursor-pointer items-center gap-1">
                                        <Pencil className="h-4 w-4" />
                                        <span>Edit</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete}
                                        className="flex cursor-pointer items-center gap-1 text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Hapus</span>
                                    </Button>
                                </>
                            )}

                            {userRole === 'finance' && salary.data.status === 'approved' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePaid}
                                    className="flex cursor-pointer items-center gap-1 text-green-600"
                                >
                                    <DollarSign className="h-4 w-4" />
                                    <span>Bayar</span>
                                </Button>
                            )}

                            {userRole === 'manager' && salary.data.status === 'pending' && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleApprove}
                                        className="flex cursor-pointer items-center gap-1 text-blue-600"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span>Setujui</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReject}
                                        className="flex cursor-pointer items-center gap-1 text-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Tolak</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-6 shadow-sm lg:col-span-2">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                            <Banknote className="h-5 w-5 text-blue-600" />
                            Informasi Keuangan
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <Banknote className="h-4 w-4" />
                                    <span className="text-sm font-medium">Gaji Pokok</span>
                                </div>
                                <p className="text-2xl font-bold">{parseRupiah(salary.data.amount)}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <Gift className="h-4 w-4" />
                                    <span className="text-sm font-medium">Bonus</span>
                                </div>
                                <p className="text-2xl font-bold">{parseRupiah(salary.data.bonus)}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <Calculator className="h-4 w-4" />
                                    <span className="text-sm font-medium">PPH</span>
                                </div>
                                <p className="text-2xl font-bold">{decimalToPercent(salary.data.pph)}</p>
                            </div>
                            <div className="rounded-lg border-2 border-gray-200 p-4">
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">Total Gaji</span>
                                </div>
                                <p className="text-2xl font-bold">{parseRupiah(salary.data.total)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Detail
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm font-medium">Diproses oleh</span>
                                </div>
                                <p className="font-medium">{salary.data.processed_by}</p>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm font-medium">Direview oleh</span>
                                </div>
                                <p className="font-medium">{salary.data.reviewed_by}</p>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm font-medium">Tanggal Pembayaran</span>
                                </div>
                                <p className="font-medium">{salary.data.paid_at || <span className="text-gray-500 italic">Belum dibayar</span>}</p>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm font-medium">Catatan</span>
                                </div>
                                <p className="">{salary.data.notes || <span className="text-gray-500 italic">Tidak ada catatan</span>}</p>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-gray-600">
                                    <Receipt className="h-4 w-4" />
                                    <span className="text-sm font-medium">Bukti Pembayaran</span>
                                </div>
                                {salary.data.payment_proof ? (
                                    <a
                                        href={`/storage/${salary.data.payment_proof}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
                                    >
                                        <Receipt className="h-4 w-4" />
                                        Lihat Bukti Pembayaran
                                    </a>
                                ) : (
                                    <span className="text-gray-500 italic">Belum ada bukti</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">Ringkasan</h2>
                    <div className="rounded-lg border-l-4 border-gray-500 p-4">
                        <p>
                            Gaji untuk departemen <strong>{salary.data.department_name}</strong> dengan total{' '}
                            <strong className="text-green-600">{parseRupiah(salary.data.total)}</strong> saat ini berstatus{' '}
                            <strong>{salary.data.status}</strong>.
                        </p>
                    </div>
                </div>
                <SalaryFormDialog />
                <PaymentFormDialog />
            </div>
        </AppLayout>
    );
}
