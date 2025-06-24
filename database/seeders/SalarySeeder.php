<?php

namespace Database\Seeders;

use App\Models\Salary;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SalarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $salaries = [
            [
                'department_name' => 'IT',
                'amount' => 21000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'HR',
                'amount' => 8000000,
                'bonus' => 400000,
            ],
            [
                'department_name' => 'Marketing',
                'amount' => 9000000,
                'bonus' => 450000,
            ],
            [
                'department_name' => 'Sales',
                'amount' => 4000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'Operations',
                'amount' => 7000000,
                'bonus' => 400000,
            ],
            [
                'department_name' => 'Legal',
                'amount' => 5000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'Customer Service',
                'amount' => 6000000,
                'bonus' => 400000,
            ],
            [
                'department_name' => 'Product Development',
                'amount' => 8000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'Research and Development',
                'amount' => 7000000,
                'bonus' => 400000,
            ],
            [
                'department_name' => 'Accounting',
                'amount' => 9000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'Sales',
                'amount' => 4000000,
                'bonus' => 500000,
            ],
            [
                'department_name' => 'Operations',
                'amount' => 7000000,
                'bonus' => 400000,
            ],
            [
                'department_name' => 'Legal',
                'amount' => 5000000,
                'bonus' => 500000,
            ],
        ];

        foreach ($salaries as $salary) {
            $pph = Salary::calculatePph($salary['amount'], $salary['bonus']);
            $total = Salary::calculateTotal($salary['amount'], $salary['bonus'], $pph);

            Salary::create([
                'department_name' => $salary['department_name'],
                'amount' => $salary['amount'],
                'bonus' => $salary['bonus'],
                'pph' => $pph,
                'total' => $total,
                'status' => 'pending',
                'processed_by' => 3,
            ]);
        }
    }
}
