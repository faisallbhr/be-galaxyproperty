<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    protected $guarded = ['id'];

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public static function calculatePph($amount, $bonus)
    {
        $total = $amount + $bonus;

        switch (true) {
            case $total <= 5000000:
                return 0.05;
            case $total > 5000000 && $total <= 20000000:
                return 0.1;
            default:
                return 0.15;
        }
    }

    public static function calculateTotal($amount, $bonus, $pph)
    {
        $nominalPph = ($amount + $bonus) * $pph;
        return $amount + $bonus - $nominalPph;
    }
}
