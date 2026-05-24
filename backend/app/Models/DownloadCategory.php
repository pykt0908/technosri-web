<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadCategory extends Model
{
    use HasFactory;

    protected $table = 'download_categories';

    protected $fillable = [
        'name',
        'slug',
        'sort_order'
    ];

    public function files()
    {
        return $this->hasMany(DownloadFile::class, 'download_category_id')->orderBy('sort_order', 'asc');
    }
}
