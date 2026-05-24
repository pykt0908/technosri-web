<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadFile extends Model
{
    use HasFactory;

    protected $table = 'download_files';

    protected $fillable = [
        'download_category_id',
        'title',
        'file_path',
        'file_size',
        'download_count',
        'sort_order'
    ];

    public function category()
    {
        return $this->belongsTo(DownloadCategory::class, 'download_category_id');
    }
}
