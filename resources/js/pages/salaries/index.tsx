import PaymentFormDialog from '@/components/salaries/payment-form-dialog';
import SalaryFormDialog from '@/components/salaries/salary-form-dialog';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { SalaryPagination } from '@/types/salary';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { columns } from './_columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const filterOptions = [
    {
        value: 'pending',
        label: 'Pending',
    },
    {
        value: 'approved',
        label: 'Approved',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
    {
        value: 'paid',
        label: 'Paid',
    },
];

export default function Dashboard({ salaries }: { salaries: SalaryPagination }) {
    const { auth } = usePage<SharedData>().props;
    const { props } = usePage();
    const isFinance = Array.isArray(auth.user?.roles) && (auth.user.roles as { name: string }[])[0]?.name === 'finance';

    props.userRole as 'director' | 'manager' | 'finance';
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-center text-2xl font-bold">Data Permintaan Gaji Setiap Departemen</h1>
                <DataTable
                    columns={columns}
                    data={salaries.data}
                    filterColumn="status"
                    filterOptions={filterOptions}
                    onFilterChange={(value) => {
                        router.get(
                            '/dashboard',
                            { status: value },
                            {
                                preserveScroll: true,
                                preserveState: true,
                            },
                        );
                    }}
                    canCreate={isFinance}
                    pagination={salaries.meta}
                />

                <SalaryFormDialog />
                <PaymentFormDialog />
            </div>
        </AppLayout>
    );
}
