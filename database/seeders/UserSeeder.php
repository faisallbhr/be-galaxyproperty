<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $directorRole = Role::create([
            'name' => 'director'
        ]);

        $managerRole = Role::create([
            'name' => 'manager'
        ]);

        $financeRole = Role::create([
            'name' => 'finance'
        ]);

        $director = User::create([
            'name' => 'Director',
            'email' => 'director@mail.com',
            'password' => bcrypt('password'),
        ]);

        $manager = User::create([
            'name' => 'Manager',
            'email' => 'manager@mail.com',
            'password' => bcrypt('password'),
        ]);

        $finance = User::create([
            'name' => 'Finance',
            'email' => 'finance@mail.com',
            'password' => bcrypt('password'),
        ]);

        $director->assignRole($directorRole);
        $manager->assignRole($managerRole);
        $finance->assignRole($financeRole);
    }
}
