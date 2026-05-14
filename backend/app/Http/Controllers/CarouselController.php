<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CarouselController extends Controller
{
    public function index()
    {
        return Carousel::orderBy('sort_order', 'asc')->get();
    }

    public function active()
    {
        return Carousel::where('is_active', true)->orderBy('sort_order', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'link_target' => 'required|in:_self,_blank',
        ]);

        $file = $request->file('image');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slugName = Str::slug($originalName);
        if (empty($slugName)) {
            $slugName = 'carousel';
        }
        
        $filename = $slugName . '.webp';
        $counter = 1;

        while (Storage::disk('public')->exists('carousels/' . $filename)) {
            $filename = $slugName . '-' . $counter . '.webp';
            $counter++;
        }
        $path = 'carousels/' . $filename;

        // Process with native PHP GD
        $imageInfo = getimagesize($file);
        $mime = $imageInfo['mime'];

        switch ($mime) {
            case 'image/jpeg': $image = imagecreatefromjpeg($file); break;
            case 'image/png': $image = imagecreatefrompng($file); break;
            case 'image/webp': $image = imagecreatefromwebp($file); break;
            case 'image/gif': $image = imagecreatefromgif($file); break;
            default: return response()->json(['message' => 'Unsupported image type'], 422);
        }

        // Handle transparency for PNG
        if ($mime === 'image/png' || $mime === 'image/webp') {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        // Save as WebP to temporary path first
        $tempPath = tempnam(sys_get_temp_dir(), 'webp');
        imagewebp($image, $tempPath, 80);
        imagedestroy($image);

        // Upload to storage
        Storage::disk('public')->put($path, file_get_contents($tempPath));
        unlink($tempPath);
        
        $lastOrder = Carousel::max('sort_order') ?? 0;

        return Carousel::create([
            'image_path' => $path,
            'link_url' => $validated['link_url'],
            'link_target' => $validated['link_target'],
            'sort_order' => $lastOrder + 1,
            'is_active' => true,
        ]);
    }

    public function update(Request $request, Carousel $carousel)
    {
        $validated = $request->validate([
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'link_target' => 'required|in:_self,_blank',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete($carousel->image_path);

            $file = $request->file('image');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $slugName = Str::slug($originalName);
            if (empty($slugName)) {
                $slugName = 'carousel';
            }

            $filename = $slugName . '.webp';
            $counter = 1;

            while (Storage::disk('public')->exists('carousels/' . $filename)) {
                $filename = $slugName . '-' . $counter . '.webp';
                $counter++;
            }
            $path = 'carousels/' . $filename;

            // Process with native PHP GD
            $imageInfo = getimagesize($file);
            $mime = $imageInfo['mime'];

            switch ($mime) {
                case 'image/jpeg': $image = imagecreatefromjpeg($file); break;
                case 'image/png': $image = imagecreatefrompng($file); break;
                case 'image/webp': $image = imagecreatefromwebp($file); break;
                case 'image/gif': $image = imagecreatefromgif($file); break;
                default: return response()->json(['message' => 'Unsupported image type'], 422);
            }

            // Handle transparency for PNG
            if ($mime === 'image/png' || $mime === 'image/webp') {
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            }

            // Save as WebP to temporary path first
            $tempPath = tempnam(sys_get_temp_dir(), 'webp');
            imagewebp($image, $tempPath, 80);
            imagedestroy($image);

            // Upload to storage
            Storage::disk('public')->put($path, file_get_contents($tempPath));
            unlink($tempPath);
            
            $carousel->image_path = $path;
        }

        $carousel->link_url = $validated['link_url'];
        $carousel->link_target = $validated['link_target'];
        $carousel->is_active = $validated['is_active'];
        $carousel->save();

        return $carousel;
    }

    public function destroy(Carousel $carousel)
    {
        Storage::disk('public')->delete($carousel->image_path);
        $carousel->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:carousels,id',
            'orders.*.sort_order' => 'required|integer'
        ]);

        foreach ($request->orders as $order) {
            Carousel::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
