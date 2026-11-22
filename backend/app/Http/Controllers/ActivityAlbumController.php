<?php

namespace App\Http\Controllers;

use App\Models\ActivityAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ActivityAlbumController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityAlbum::where('status', 'published');

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('year')) {
            $query->whereYear('event_date', $request->year);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('sort_order', 'asc')
            ->orderBy('event_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function adminIndex(Request $request)
    {
        return ActivityAlbum::orderBy('sort_order', 'asc')
            ->orderBy('event_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function show($id)
    {
        return ActivityAlbum::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'google_photo_url' => 'required|url|max:2048',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'status' => 'required|in:draft,published',
            'sort_order' => 'nullable|integer',
            'cover_image' => 'nullable|image|max:10240',
        ]);

        if (empty($validated['category'])) {
            $validated['category'] = null;
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $this->uploadAndConvert($request->file('cover_image'));
        }

        $album = ActivityAlbum::create($validated);
        return response()->json($album, 201);
    }

    public function update(Request $request, $id)
    {
        $album = ActivityAlbum::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'google_photo_url' => 'required|url|max:2048',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'status' => 'required|in:draft,published',
            'sort_order' => 'nullable|integer',
            'cover_image' => 'nullable|image|max:10240',
        ]);

        if (empty($validated['category'])) {
            $validated['category'] = null;
        }

        if ($request->hasFile('cover_image')) {
            if ($album->cover_image) {
                Storage::disk('public')->delete($album->cover_image);
            }
            $validated['cover_image'] = $this->uploadAndConvert($request->file('cover_image'));
        }

        $album->update($validated);
        return response()->json($album);
    }

    public function destroy($id)
    {
        $album = ActivityAlbum::findOrFail($id);
        if ($album->cover_image) {
            Storage::disk('public')->delete($album->cover_image);
        }
        $album->delete();
        return response()->json(null, 204);
    }

    public function incrementViews($id)
    {
        $album = ActivityAlbum::findOrFail($id);
        $album->increment('views');
        return response()->json(['views' => $album->views]);
    }

    private function uploadAndConvert($file)
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . Str::random(10) . '.webp';
        $tempPath = $file->getRealPath();

        $image = null;
        if ($extension === 'jpg' || $extension === 'jpeg') {
            $image = @imagecreatefromjpeg($tempPath);
        } elseif ($extension === 'png') {
            $image = @imagecreatefrompng($tempPath);
        } elseif ($extension === 'webp') {
            $image = @imagecreatefromwebp($tempPath);
        }

        if ($image) {
            if (!imageistruecolor($image)) {
                imagepalettetotruecolor($image);
            }

            $storagePath = storage_path('app/public/albums/' . $filename);
            if (!file_exists(dirname($storagePath))) {
                mkdir(dirname($storagePath), 0755, true);
            }
            imagewebp($image, $storagePath, 82);
            imagedestroy($image);
            return 'albums/' . $filename;
        }

        return $file->store('albums', 'public');
    }
}
