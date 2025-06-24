<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->string('department_name');
            $table->integer('amount');
            $table->integer('bonus');
            $table->decimal('pph', 3, 2);
            $table->integer('total');
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->string('payment_proof')->nullable();
            $table->text('notes')->nullable();
            $table->date('processed_at')->nullable();
            $table->date('reviewed_at')->nullable();
            $table->date('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('processed_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
