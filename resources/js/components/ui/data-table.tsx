import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSalaryFormStore } from '@/stores/salary-form-store';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from './button';
import Pagination from './pagination';

interface FilterOption {
    value: string;
    label: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumn?: string;
    filterOptions?: FilterOption[];
    onFilterChange?: (value: string) => void;
    canCreate?: boolean;
    pagination?: {
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        from: number;
        to: number;
        total: number;
    };
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumn,
    filterOptions,
    onFilterChange,
    canCreate,
    pagination,
}: DataTableProps<TData, TValue>) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnFilters,
        },
    });

    const { setIsOpen, setIsEdit, setFormData } = useSalaryFormStore();
    return (
        <div className="space-y-4 rounded-md">
            <div className="flex items-center justify-between">
                {canCreate ? (
                    <Button
                        variant="default"
                        onClick={() => {
                            setIsEdit(false);
                            setFormData({});
                            setIsOpen(true);
                        }}
                    >
                        Tambah Permintaan Gaji
                    </Button>
                ) : (
                    <div></div>
                )}
                {filterColumn && filterOptions && (
                    <Select
                        open={isSelectOpen}
                        onOpenChange={setIsSelectOpen}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
                        onValueChange={(value) => {
                            table.getColumn(filterColumn)?.setFilterValue(value);
                            onFilterChange?.(value);
                        }}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue
                                placeholder={`Filter ${filterColumn
                                    .split('_')
                                    .join(' ')
                                    .replace(/\b\w/g, (char) => char.toUpperCase())}`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    {filterColumn
                                        .split('_')
                                        .join(' ')
                                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                                </SelectLabel>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                                <Button
                                    className="w-full"
                                    variant={'ghost'}
                                    disabled={!(table.getColumn(filterColumn)?.getFilterValue() as string)}
                                    onClick={() => {
                                        table.getColumn(filterColumn)?.setFilterValue('');
                                        onFilterChange?.('');
                                        setIsSelectOpen(false); // Close the select dropdown
                                    }}
                                >
                                    Hapus Filter
                                </Button>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-center">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-center">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {pagination && <Pagination pagination={pagination} />}
        </div>
    );
}
