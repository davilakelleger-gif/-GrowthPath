<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'icon',
        'target',
        'unit',
        'color',
        'reminder_time',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'reminder_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(HabitLog::class);
    }

    public function getLogForDate($date)
    {
        return $this->logs()->where('log_date', $date)->first();
    }

    public function getTodayLog()
    {
        return $this->getLogForDate(now()->toDateString());
    }
}
