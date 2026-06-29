<?php

namespace App\Http\Controllers;

use App\Models\Sar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SarController extends Controller
{
    /**
     * Display a listing of the resource.
     * Accessible by both admin (all) and public (depending on route filters, we can just return all or active).
     */
    public function index(Request $request)
    {
        $query = Sar::orderBy('year', 'desc')->orderBy('title', 'asc');
        
        // If not authenticated (or requesting public view), return only active ones
        if ($request->has('public') || !$request->user()) {
            $query->where('is_active', true);
        }

        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2400|max:2700',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,zip,rar|max:20480', // limit to 20MB
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $originalSize = $uploadedFile->getSize();
            $friendlySize = $this->getFriendlyFileSize($originalSize);

            // Store in sars folder in public disk
            $path = $uploadedFile->store('sars', 'public');

            $validated['file_path'] = $path;
            $validated['file_size'] = $friendlySize;
        }

        $validated['is_active'] = $request->input('is_active', true);

        $sar = Sar::create($validated);

        return response()->json($sar, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Sar::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sar = Sar::findOrFail($id);

        $validated = $request->validate([
            'year' => 'required|integer|min:2400|max:2700',
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:20480', // optional on update
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file
            if ($sar->file_path) {
                Storage::disk('public')->delete($sar->file_path);
            }

            $uploadedFile = $request->file('file');
            $originalSize = $uploadedFile->getSize();
            $friendlySize = $this->getFriendlyFileSize($originalSize);

            $path = $uploadedFile->store('sars', 'public');

            $validated['file_path'] = $path;
            $validated['file_size'] = $friendlySize;
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $sar->update($validated);

        return response()->json($sar);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sar = Sar::findOrFail($id);

        // Delete file from disk
        if ($sar->file_path) {
            Storage::disk('public')->delete($sar->file_path);
        }

        $sar->delete();

        return response()->json(['message' => 'รายงาน SAR ถูกลบสำเร็จแล้ว']);
    }

    /**
     * Helper to calculate human readable size
     */
    private function getFriendlyFileSize($bytes)
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 1) . ' KB';
        } elseif ($bytes > 1) {
            return $bytes . ' bytes';
        } elseif ($bytes == 1) {
            return '1 byte';
        } else {
            return '0 bytes';
        }
    }
}
