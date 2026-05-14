<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

    protected $table = 'curricula';

    protected $fillable = [
        'name',
        'slug',
        'level',
        'description',
        'image',
        'document_path',
        'status',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];
}
