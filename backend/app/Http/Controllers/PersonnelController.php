<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonnelController extends Controller
{
    public function index(Request $request)
    {
        $query = Personnel::query();
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        return $query->orderBy('sort_order', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('personnel', 'public');
            $validated['image'] = $path;
        }

        $validated['sort_order'] = Personnel::where('department_id', $request->department_id)->max('sort_order') + 1;

        return Personnel::create($validated);
    }

    public function update(Request $request, Personnel $personnel)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($personnel->image) {
                Storage::disk('public')->delete($personnel->image);
            }
            $path = $request->file('image')->store('personnel', 'public');
            $validated['image'] = $path;
        }

        $personnel->update($validated);
        return $personnel;
    }

    public function destroy(Personnel $personnel)
    {
        if ($personnel->image) {
            Storage::disk('public')->delete($personnel->image);
        }
        $personnel->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function updateOrder(Request $request)
    {
        $order = $request->input('order'); // Array of IDs in new order
        if (is_array($order)) {
            foreach ($order as $index => $id) {
                $p = Personnel::find($id);
                if ($p) {
                    $p->sort_order = $index;
                    $p->save();
                }
            }
        }
        return response()->json(['message' => 'Order updated']);
    }
}
