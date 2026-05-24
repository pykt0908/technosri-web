<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        return News::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get();
    }

    public function adminIndex()
    {
        return News::with('author:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function showBySlug($slug)
    {
        $news = News::where('slug', $slug)->firstOrFail();
        return response()->json($news);
    }

    public function show($id)
    {
        return News::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:news,slug',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|image|max:10240',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|max:10240',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        }

        $validated['author_id'] = $request->user()->id;

        // Default published_at if published but no date provided
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $this->uploadAndConvert($request->file('featured_image'));
        }

        // Handle gallery images
        $galleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $imageFile) {
                $path = $this->uploadAndConvert($imageFile);
                $galleryPaths[] = $path;
            }
        }
        $validated['gallery'] = count($galleryPaths) > 0 ? $galleryPaths : null;

        $news = News::create($validated);
        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:news,slug,' . $id,
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|image|max:10240',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|max:10240',
            'existing_gallery' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        if ($validated['status'] === 'published' && empty($validated['published_at']) && !$news->published_at) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            if ($news->featured_image) {
                Storage::disk('public')->delete($news->featured_image);
            }
            $validated['featured_image'] = $this->uploadAndConvert($request->file('featured_image'));
        }

        // Handle gallery updates
        $existingGallery = [];
        if ($request->filled('existing_gallery')) {
            $existingGallery = json_decode($request->input('existing_gallery'), true) ?? [];
        }

        // Delete removed gallery images from storage
        if (is_array($news->gallery)) {
            $deletedImages = array_diff($news->gallery, $existingGallery);
            foreach ($deletedImages as $deletedImage) {
                Storage::disk('public')->delete($deletedImage);
            }
        }

        // Upload new images
        $newGalleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $imageFile) {
                $path = $this->uploadAndConvert($imageFile);
                $newGalleryPaths[] = $path;
            }
        }

        $finalGallery = array_merge($existingGallery, $newGalleryPaths);
        $validated['gallery'] = count($finalGallery) > 0 ? $finalGallery : null;

        $news->update($validated);
        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        if ($news->featured_image) {
            Storage::disk('public')->delete($news->featured_image);
        }
        if (is_array($news->gallery)) {
            foreach ($news->gallery as $galleryImage) {
                Storage::disk('public')->delete($galleryImage);
            }
        }
        $news->delete();
        return response()->json(null, 204);
    }

    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|max:5120']);
        $path = $this->uploadAndConvert($request->file('image'));
        return response()->json(['url' => 'http://localhost:8000/storage/' . $path]);
    }

    private function uploadAndConvert($file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . Str::random(10) . '.webp';
        $tempPath = $file->getRealPath();
        
        // Native GD conversion to WebP
        $image = null;
        if ($extension === 'jpg' || $extension === 'jpeg') {
            $image = imagecreatefromjpeg($tempPath);
        } elseif ($extension === 'png') {
            $image = imagecreatefrompng($tempPath);
        } elseif ($extension === 'webp') {
            $image = imagecreatefromwebp($tempPath);
        }

        if ($image) {
            // Convert palette/indexed images (e.g. PNG-8) to truecolor to avoid "Palette image not supported by webp" error
            if (!imageistruecolor($image)) {
                imagepalettetotruecolor($image);
            }

            $storagePath = storage_path('app/public/news/' . $filename);
            if (!file_exists(dirname($storagePath))) {
                mkdir(dirname($storagePath), 0755, true);
            }
            imagewebp($image, $storagePath, 80);
            imagedestroy($image);
            return 'news/' . $filename;
        }

        return $file->store('news', 'public');
    }
}
