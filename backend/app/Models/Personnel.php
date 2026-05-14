<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;

    protected $table = 'personnel';

    protected $fillable = [
        'department_id',
        'name',
        'nickname',
        'position',
        'image',
        'sort_order'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
