<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'icon',
        'progress',
        'deadline',
        'is_completed',
        'sort_order',
    ];

    protected $casts = [
        'deadline' => 'date',
        'is_completed' => 'boolean',
        'progress' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(GoalLog::class);
    }

    public function getDaysRemainingAttribute()
    {
        return now()->diffInDays($this->deadline, false);
    }
}
