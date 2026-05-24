<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadDocument extends Model
{
    use HasFactory;

    protected $table = 'download_documents';

    protected $fillable = [
        'download_category_id',
        'title',
        'sort_order'
    ];

    public function category()
    {
        return $this->belongsTo(DownloadCategory::class, 'download_category_id');
    }

    public function files()
    {
        return $this->hasMany(DownloadFile::class, 'download_document_id')->orderBy('sort_order', 'asc');
    }
}
