<?php

namespace App\Http\Controllers;

use App\Models\DownloadFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadFileController extends Controller
{
    // Public: trigger file download & increment download count
    public function download($id)
    {
        $file = DownloadFile::findOrFail($id);
        $file->increment('download_count');

        $path = Storage::disk('public')->path($file->file_path);
        if (!file_exists($path)) {
            abort(404, 'File not found on server.');
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $downloadName = $file->title . ($extension ? '.' . $extension : '');

        return response()->download($path, $downloadName);
    }

    // Admin: store a new uploaded file
    public function store(Request $request)
    {
        $validated = $request->validate([
            'download_document_id' => 'required|exists:download_documents,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:20480', // limit to 20MB
        ]);

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $originalSize = $uploadedFile->getSize();
            $friendlySize = $this->getFriendlyFileSize($originalSize);

            // Store in downloads folder in public disk
            $path = $uploadedFile->store('downloads', 'public');

            $validated['file_path'] = $path;
            $validated['file_size'] = $friendlySize;
        }

        $validated['sort_order'] = DownloadFile::where('download_document_id', $request->download_document_id)->max('sort_order') + 1;
        $validated['download_count'] = 0;

        return DownloadFile::create($validated);
    }

    // Admin: update a file record
    public function update(Request $request, $id)
    {
        $file = DownloadFile::findOrFail($id);

        $validated = $request->validate([
            'download_document_id' => 'required|exists:download_documents,id',
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|max:20480', // file is optional on update
        ]);

        if ($request->hasFile('file')) {
            // Delete old file
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }

            $uploadedFile = $request->file('file');
            $originalSize = $uploadedFile->getSize();
            $friendlySize = $this->getFriendlyFileSize($originalSize);

            $path = $uploadedFile->store('downloads', 'public');

            $validated['file_path'] = $path;
            $validated['file_size'] = $friendlySize;
        }

        $file->update($validated);
        return $file;
    }

    // Admin: delete a file
    public function destroy($id)
    {
        $file = DownloadFile::findOrFail($id);

        if ($file->file_path) {
            Storage::disk('public')->delete($file->file_path);
        }

        $file->delete();
        return response()->json(['message' => 'File deleted successfully']);
    }

    // Admin: reorder files
    public function reorder(Request $request)
    {
        $order = $request->input('order'); // Array of IDs
        if (is_array($order)) {
            foreach ($order as $index => $id) {
                $file = DownloadFile::find($id);
                if ($file) {
                    $file->sort_order = $index;
                    $file->save();
                }
            }
        }
        return response()->json(['message' => 'Order updated']);
    }

    // Helper to calculate human readable size
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
