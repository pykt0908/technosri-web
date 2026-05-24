<?php

namespace App\Http\Controllers;

use App\Models\DownloadDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadDocumentController extends Controller
{
    // Fetch all documents, optionally filtered by category
    public function index(Request $request)
    {
        $query = DownloadDocument::query();
        if ($request->has('download_category_id')) {
            $query->where('download_category_id', $request->download_category_id);
        }
        return $query->orderBy('sort_order', 'asc')->with('files')->get();
    }

    // Get single document with its files
    public function show(DownloadDocument $document)
    {
        $document->load('files');
        return response()->json($document);
    }

    // Admin: Store a new document (form container)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'download_category_id' => 'required|exists:download_categories,id',
            'title' => 'required|string|max:255',
        ]);

        $validated['sort_order'] = DownloadDocument::where('download_category_id', $request->download_category_id)->max('sort_order') + 1;

        return DownloadDocument::create($validated);
    }

    // Admin: Update a document title
    public function update(Request $request, DownloadDocument $document)
    {
        $validated = $request->validate([
            'download_category_id' => 'required|exists:download_categories,id',
            'title' => 'required|string|max:255',
        ]);

        $document->update($validated);
        return $document;
    }

    // Admin: Delete a document and physically delete all its attached files
    public function destroy(DownloadDocument $document)
    {
        $files = $document->files;
        foreach ($files as $file) {
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }
        }

        $document->delete();
        return response()->json(['message' => 'Document deleted successfully']);
    }

    // Admin: Reorder documents within a category
    public function reorder(Request $request)
    {
        $order = $request->input('order');
        if (is_array($order)) {
            foreach ($order as $index => $id) {
                $doc = DownloadDocument::find($id);
                if ($doc) {
                    $doc->sort_order = $index;
                    $doc->save();
                }
            }
        }
        return response()->json(['message' => 'Order updated']);
    }
}
