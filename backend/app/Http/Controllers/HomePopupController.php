<?php

namespace App\Http\Controllers;

use App\Models\HomePopup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HomePopupController extends Controller
{
    public function index()
    {
        return HomePopup::orderBy('sort_order', 'asc')->get();
    }

    public function active()
    {
        return HomePopup::where('is_active', true)->orderBy('sort_order', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'link_target' => 'required|in:_self,_blank',
            'popup_size' => 'required|in:sm,md,lg',
            'frequency' => 'required|in:once,always',
        ]);

        $file = $request->file('image');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slugName = Str::slug($originalName);
        if (empty($slugName)) {
            $slugName = 'popup';
        }
        
        $filename = $slugName . '.webp';
        $counter = 1;

        while (Storage::disk('public')->exists('popups/' . $filename)) {
            $filename = $slugName . '-' . $counter . '.webp';
            $counter++;
        }
        $path = 'popups/' . $filename;

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

        // Handle transparency
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
        
        $lastOrder = HomePopup::max('sort_order') ?? 0;

        return HomePopup::create([
            'title' => $validated['title'],
            'image_path' => $path,
            'link_url' => $validated['link_url'],
            'link_target' => $validated['link_target'],
            'popup_size' => $validated['popup_size'],
            'frequency' => $validated['frequency'],
            'sort_order' => $lastOrder + 1,
            'is_active' => true,
        ]);
    }

    public function show(HomePopup $popup)
    {
        return $popup;
    }

    public function update(Request $request, HomePopup $popup)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'link_target' => 'required|in:_self,_blank',
            'popup_size' => 'required|in:sm,md,lg',
            'frequency' => 'required|in:once,always',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete($popup->image_path);

            $file = $request->file('image');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $slugName = Str::slug($originalName);
            if (empty($slugName)) {
                $slugName = 'popup';
            }

            $filename = $slugName . '.webp';
            $counter = 1;

            while (Storage::disk('public')->exists('popups/' . $filename)) {
                $filename = $slugName . '-' . $counter . '.webp';
                $counter++;
            }
            $path = 'popups/' . $filename;

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

            // Handle transparency
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
            
            $popup->image_path = $path;
        }

        $popup->title = $validated['title'];
        $popup->link_url = $validated['link_url'];
        $popup->link_target = $validated['link_target'];
        $popup->popup_size = $validated['popup_size'];
        $popup->frequency = $validated['frequency'];
        $popup->is_active = $validated['is_active'];
        $popup->save();

        return $popup;
    }

    public function destroy(HomePopup $popup)
    {
        Storage::disk('public')->delete($popup->image_path);
        $popup->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:home_popups,id',
            'orders.*.sort_order' => 'required|integer'
        ]);

        foreach ($request->orders as $order) {
            HomePopup::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
