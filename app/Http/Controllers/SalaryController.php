<?php

namespace App\Http\Controllers;

use App\Http\Resources\Collections\SalaryCollection;
use App\Http\Resources\SalaryResource;
use Inertia\Inertia;
use App\Models\Salary;
use Illuminate\Http\Request;
use Storage;

class SalaryController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $status = $request->query('status');

        $salaries = Salary::with([
            'processedBy',
            'reviewedBy',
        ])
            ->when($user->hasRole('director'), function ($query) {
                return $query->where('status', 'paid');
            })
            ->when($user->hasRole('manager'), function ($query) use ($user) {
                return $query->where('reviewed_by', $user->id)
                    ->orWhere('reviewed_by', null);
            })
            ->when($user->hasRole('finance'), function ($query) use ($user) {
                return $query->where('processed_by', $user->id);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->appends([
                'status' => $status
            ]);

        return Inertia::render('salaries/index', [
            'salaries' => SalaryResource::collection($salaries),
            'userRole' => auth()->user()->getRoleNames()->first(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department_name' => 'required',
            'amount' => 'required|numeric|min:0',
            'bonus' => 'required|numeric|min:0',
        ]);

        $data['pph'] = Salary::calculatePph($data['amount'], $data['bonus']);
        $data['total'] = Salary::calculateTotal($data['amount'], $data['bonus'], $data['pph']);

        Salary::create([
            'department_name' => $data['department_name'],
            'amount' => $data['amount'],
            'bonus' => $data['bonus'],
            'pph' => $data['pph'],
            'total' => $data['total'],
            'processed_by' => auth()->user()->id,
            'processed_at' => now()
        ]);

        return redirect()->route('dashboard')->with('success', 'Berhasil menambahkan permintaan gaji.');
    }

    public function show($id)
    {
        $salary = Salary::findOrFail($id);
        return Inertia::render('salaries/show', [
            'salary' => new SalaryResource($salary),
            'userRole' => auth()->user()->getRoleNames()->first(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'department_name' => 'required',
            'amount' => 'required|numeric|min:0',
            'bonus' => 'required|numeric|min:0',
        ]);

        $salary = Salary::findOrFail($id);
        if ($salary->status != 'pending') {
            return redirect()->route('dashboard')->with('error', 'Tidak dapat mengubah gaji yang sudah diproses.');
        }

        $data['pph'] = $salary::calculatePph($data['amount'], $data['bonus']);
        $data['total'] = $salary::calculateTotal($data['amount'], $data['bonus'], $data['pph']);

        $salary->update([
            'department_name' => $data['department_name'],
            'amount' => $data['amount'],
            'bonus' => $data['bonus'],
            'pph' => $data['pph'],
            'total' => $data['total'],
            'processed_at' => now()
        ]);

        return redirect()->route('salaries.show', $id)->with('success', 'Berhasil mengubah permintaan gaji.');
    }

    public function destroy($id)
    {
        $salary = Salary::findOrFail($id);
        if ($salary->status != 'pending') {
            return redirect()->route('dashboard')->with('error', 'Tidak dapat menghapus gaji yang sudah diproses.');
        }

        $salary->delete();

        return redirect()->route('dashboard')->with('success', 'Berhasil menghapus permintaan gaji.');
    }

    public function review(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'required_if:status,rejected',
        ]);

        $salary = Salary::findOrFail($id);
        $message = $data['status'] == 'approved' ? 'menyetujui' : 'menolak';
        if ($salary->status != 'pending') {
            return redirect()->route('dashboard')->with('error', "Tidak dapat {$message} permintaan gaji yang sudah diproses.");
        }

        $salary->update([
            'status' => $data['status'],
            'reviewed_by' => auth()->user()->id,
            'reviewed_at' => now(),
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('salaries.show', $id)->with('success', "Berhasil {$message} permintaan gaji.");
    }

    public function paid(Request $request, $id)
    {
        \Log::info($request->all());
        $data = $request->validate([
            'paid_at' => 'required|date',
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $salary = Salary::findOrFail($id);
        if ($salary->status != 'approved') {
            return redirect()->route('dashboard')->with('error', 'Tidak dapat memproses permintaan gaji yang belum disetujui.');
        }

        $fileName = time() . '.' . $data['payment_proof']->getClientOriginalExtension();
        $filePath = 'salaries/' . $fileName;
        Storage::disk('public')->put($filePath, file_get_contents($data['payment_proof']));

        $salary->update([
            'status' => 'paid',
            'paid_at' => $data['paid_at'],
            'payment_proof' => $filePath,
        ]);

        return redirect()->route('salaries.show', $id)->with('success', 'Berhasil memproses permintaan gaji.');
    }
}
