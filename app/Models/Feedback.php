<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';

    protected $fillable = [
        'full_name',
        'mykad_number',
        'rating',
        'interest',
        'phone_number',
    ];

    protected $casts = [
        'interest' => 'boolean',
    ];
}
