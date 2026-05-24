<?php

namespace App\Http\Controllers;

use App\Models\DownloadCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DownloadCategoryController extends Controller
{
    // Public: list all categories
    public function index()
    {
        return DownloadCategory::orderBy('sort_order', 'asc')->get();
    }

    // Public: show category by slug with its files
    public function showBySlug($slug)
    {
        $category = DownloadCategory::where('slug', $slug)->firstOrFail();
        $category->load('documents.files');
        return response()->json($category);
    }

    // Public: show category by ID
    public function show(DownloadCategory $category)
    {
        $category->load('documents.files');
        return response()->json($category);
    }

    // Admin: create category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:download_categories,slug',
        ]);

        if (empty($validated['slug'])) {
            // Generate simple slug (supports Thai characters using Str::slug fallback or manual sanitizer)
            $baseSlug = Str::slug($validated['name'], '-', 'th');
            if (empty($baseSlug)) {
                $baseSlug = 'category';
            }
            $slug = $baseSlug;
            $count = 1;
            while (DownloadCategory::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $count;
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $validated['sort_order'] = DownloadCategory::max('sort_order') + 1;

        return DownloadCategory::create($validated);
    }

    // Admin: update category
    public function update(Request $request, DownloadCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:download_categories,slug,' . $category->id,
            'sort_order' => 'nullable|integer',
        ]);

        $category->update($validated);
        return $category;
    }

    // Admin: delete category (will cascade delete files, but we also want to clean up storage!)
    public function destroy(DownloadCategory $category)
    {
        $documents = $category->documents;
        foreach ($documents as $doc) {
            $files = $doc->files;
            foreach ($files as $file) {
                if ($file->file_path) {
                    Storage::disk('public')->delete($file->file_path);
                }
            }
        }
        
        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // Admin: reorder categories
    public function reorder(Request $request)
    {
        $order = $request->input('order');
        if (is_array($order)) {
            foreach ($order as $index => $id) {
                $cat = DownloadCategory::find($id);
                if ($cat) {
                    $cat->sort_order = $index;
                    $cat->save();
                }
            }
        }
        return response()->json(['message' => 'Order updated']);
    }
}
