<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function index()
    {
        return JobPosting::orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get();
    }

    public function active()
    {
        return JobPosting::where('is_active', true)->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|string|max:255',
            'education_level' => 'required|string|max:255',
            'qualifications' => 'required|string',
            'is_active' => 'boolean'
        ]);

        // Auto-assign last sort_order
        $lastOrder = JobPosting::max('sort_order') ?? 0;
        $validated['sort_order'] = $lastOrder + 1;

        return JobPosting::create($validated);
    }

    public function update(Request $request, JobPosting $jobPosting)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|string|max:255',
            'education_level' => 'required|string|max:255',
            'qualifications' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $jobPosting->update($validated);
        return $jobPosting;
    }

    public function destroy(JobPosting $jobPosting)
    {
        $jobPosting->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function toggleStatus(JobPosting $jobPosting)
    {
        $jobPosting->is_active = !$jobPosting->is_active;
        $jobPosting->save();
        return $jobPosting;
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:job_postings,id',
            'orders.*.sort_order' => 'required|integer'
        ]);

        foreach ($request->orders as $order) {
            JobPosting::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
