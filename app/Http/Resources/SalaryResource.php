<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_name' => $this->department_name,
            'amount' => $this->amount,
            'bonus' => $this->bonus,
            'pph' => $this->pph,
            'total' => $this->total,
            'status' => $this->status,
            'processed_by' => $this->processedBy?->name,
            'reviewed_by' => $this->reviewedBy?->name,
            'payment_proof' => $this->payment_proof,
            'notes' => $this->notes,
            'processed_at' => $this->processed_at,
            'reviewed_at' => $this->reviewed_at,
            'paid_at' => $this->paid_at
        ];
    }
}
