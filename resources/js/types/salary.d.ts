export interface Salary {
    id: number;
    department_name: string;
    amount: number;
    bonus: number;
    pph: number;
    total: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    processed_by: string | null;
    reviewed_by: string | null;
    payment_proof: string | null;
    notes: string | null;
    processed_at: string | null;
    reviewed_at: string | null;
    paid_at: string | null;
}

export interface SalaryPagination {
    data: Salary[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        per_page: number;
        to: number;
        total: number;
    };
}
