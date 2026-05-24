<?php

namespace App\Http\Controllers;

use App\Models\SchoolStatistic;
use Illuminate\Http\Request;

class SchoolStatisticController extends Controller
{
    // Public: List all academic years
    public function index()
    {
        return SchoolStatistic::orderBy('year', 'desc')->get();
    }

    // Public: Show statistic by Year
    public function showByYear($year)
    {
        $statistic = SchoolStatistic::where('year', $year)->firstOrFail();
        return response()->json($statistic);
    }

    // Admin: Store new year statistics
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2400|max:2700|unique:school_statistics,year',
            'students_pvc' => 'required|integer|min:0',
            'students_pvs' => 'required|integer|min:0',
            'classrooms' => 'required|integer|min:0',
            'executives' => 'required|integer|min:0',
            'teachers' => 'required|integer|min:0',
            'academic_staff' => 'required|integer|min:0',
            'other_staff' => 'required|integer|min:0',
            'as_of_date' => 'required|date',
        ]);

        return SchoolStatistic::create($validated);
    }

    // Admin: Update statistics
    public function update(Request $request, $id)
    {
        $statistic = SchoolStatistic::findOrFail($id);

        $validated = $request->validate([
            'year' => 'required|integer|min:2400|max:2700|unique:school_statistics,year,' . $statistic->id,
            'students_pvc' => 'required|integer|min:0',
            'students_pvs' => 'required|integer|min:0',
            'classrooms' => 'required|integer|min:0',
            'executives' => 'required|integer|min:0',
            'teachers' => 'required|integer|min:0',
            'academic_staff' => 'required|integer|min:0',
            'other_staff' => 'required|integer|min:0',
            'as_of_date' => 'required|date',
        ]);

        $statistic->update($validated);
        return response()->json($statistic);
    }

    // Admin: Delete statistics
    public function destroy($id)
    {
        $statistic = SchoolStatistic::findOrFail($id);
        $statistic->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
