<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::with('personnel')->orderBy('sort_order', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Auto set sort_order to last + 1
        $validated['sort_order'] = Department::max('sort_order') + 1;

        return Department::create($validated);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department->update($validated);
        return $department;
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function updateOrder(Request $request)
    {
        $order = $request->input('order'); // Array of IDs in new order
        if (is_array($order)) {
            foreach ($order as $index => $id) {
                $d = Department::find($id);
                if ($d) {
                    $d->sort_order = $index;
                    $d->save();
                }
            }
        }
        return response()->json(['message' => 'Order updated']);
    }
}
