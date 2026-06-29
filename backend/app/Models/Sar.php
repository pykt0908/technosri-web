<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sar extends Model
{
    use HasFactory;

    protected $table = 'sars';

    protected $fillable = [
        'year',
        'title',
        'file_path',
        'file_size',
        'is_active'
    ];

    protected $casts = [
        'year' => 'integer',
        'is_active' => 'boolean',
    ];
}
