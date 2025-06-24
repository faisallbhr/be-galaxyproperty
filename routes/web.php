<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [SalaryController::class, 'index'])->name('dashboard');
    Route::prefix('salaries')->group(function () {
        Route::get('/{id}', [SalaryController::class, 'show'])->name('salaries.show');
        Route::post('/', [SalaryController::class, 'store'])->name('salaries.store');
        Route::put('/{id}', [SalaryController::class, 'update'])->name('salaries.update');
        Route::delete('/{id}', [SalaryController::class, 'destroy'])->name('salaries.destroy');
        Route::patch('/{id}/review', [SalaryController::class, 'review'])->name('salaries.review');
        Route::patch('/{id}/paid', [SalaryController::class, 'paid'])->name('salaries.paid');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
