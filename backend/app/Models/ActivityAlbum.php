<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityAlbum extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'cover_image',
        'google_photo_url',
        'event_date',
        'category',
        'status',
        'views',
        'sort_order',
    ];

    protected $casts = [
        'event_date' => 'date',
        'views' => 'integer',
        'sort_order' => 'integer',
    ];
}
