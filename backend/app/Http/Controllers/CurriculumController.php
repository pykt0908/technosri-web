<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CurriculumController extends Controller
{
    public function index()
    {
        return Curriculum::orderBy('level', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function adminIndex()
    {
        return Curriculum::orderBy('created_at', 'desc')->get();
    }

    public function show($id)
    {
        return Curriculum::findOrFail($id);
    }

    public function showBySlug($slug)
    {
        return Curriculum::where('slug', $slug)->firstOrFail();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:curricula,slug',
            'level' => 'required|in:ปวช.,ปวส.',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'document' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,zip,rar|max:51200',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadImage($request->file('image'));
        }

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')->store('curricula/documents', 'public');
        }

        $curriculum = Curriculum::create($validated);
        return response()->json($curriculum, 201);
    }

    public function update(Request $request, $id)
    {
        $curriculum = Curriculum::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:curricula,slug,' . $id,
            'level' => 'required|in:ปวช.,ปวส.',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'document' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,zip,rar|max:51200',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            if ($curriculum->image) {
                Storage::disk('public')->delete($curriculum->image);
            }
            $validated['image'] = $this->uploadImage($request->file('image'));
        }

        if ($request->hasFile('document')) {
            if ($curriculum->document_path) {
                Storage::disk('public')->delete($curriculum->document_path);
            }
            $validated['document_path'] = $request->file('document')->store('curricula/documents', 'public');
        }

        $curriculum->update($validated);
        return response()->json($curriculum);
    }

    public function destroy($id)
    {
        $curriculum = Curriculum::findOrFail($id);
        if ($curriculum->image) {
            Storage::disk('public')->delete($curriculum->image);
        }
        if ($curriculum->document_path) {
            Storage::disk('public')->delete($curriculum->document_path);
        }
        $curriculum->delete();
        return response()->json(null, 204);
    }

    private function uploadImage($file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . Str::random(10) . '.webp';
        $tempPath = $file->getRealPath();
        
        $image = null;
        if ($extension === 'jpg' || $extension === 'jpeg') {
            $image = imagecreatefromjpeg($tempPath);
        } elseif ($extension === 'png') {
            $image = imagecreatefrompng($tempPath);
        } elseif ($extension === 'webp') {
            $image = imagecreatefromwebp($tempPath);
        }

        if ($image) {
            $storagePath = storage_path('app/public/curricula/' . $filename);
            if (!file_exists(dirname($storagePath))) {
                mkdir(dirname($storagePath), 0755, true);
            }
            imagewebp($image, $storagePath, 80);
            imagedestroy($image);
            return 'curricula/' . $filename;
        }

        return $file->store('curricula', 'public');
    }
}
