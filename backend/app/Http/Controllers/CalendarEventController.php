<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use Illuminate\Http\Request;

class CalendarEventController extends Controller
{
    // API สำหรับหน้าแรก แสดงเฉพาะกิจกรรมที่เปิดใช้งาน (is_active = true) และอาจจะคัดกรองตามช่วงวันที่
    public function index(Request $request)
    {
        $query = CalendarEvent::where('is_active', true);

        if ($request->has('start') && $request->has('end')) {
            // FullCalendar queries using ISO8601 strings (e.g. 2026-06-01T00:00:00Z)
            $start = $request->query('start');
            $end = $request->query('end');

            $query->where(function($q) use ($start, $end) {
                // If event starts or ends inside the requested range, or spans it
                $q->whereBetween('start_date', [$start, $end])
                  ->orWhereBetween('end_date', [$start, $end])
                  ->orWhere(function($sub) use ($start, $end) {
                      $sub->where('start_date', '<=', $start)
                          ->where('end_date', '>=', $end);
                  });
            });
        }

        return response()->json($query->orderBy('start_date', 'asc')->get());
    }

    // API สำหรับผู้ดูแลระบบหลังบ้าน
    public function adminIndex()
    {
        return response()->json(CalendarEvent::orderBy('start_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|regex:/^#[a-fA-F0-9]{6}$/',
            'link_url' => 'nullable|url|max:255',
            'is_active' => 'required|boolean',
        ]);

        $event = CalendarEvent::create($validated);
        return response()->json($event, 201);
    }

    public function show($id)
    {
        return response()->json(CalendarEvent::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $event = CalendarEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|regex:/^#[a-fA-F0-9]{6}$/',
            'link_url' => 'nullable|url|max:255',
            'is_active' => 'required|boolean',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = CalendarEvent::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}
