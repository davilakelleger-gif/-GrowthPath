<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'streak',
        'level',
        'xp',
        'xp_to_next',
        'total_habits_completed',
        'last_activity_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_activity_date' => 'date',
    ];

    public function habits()
    {
        return $this->hasMany(Habit::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('achieved_at')
            ->withTimestamps();
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function settings()
    {
        return $this->hasOne(Setting::class);
    }

    public function habitLogs()
    {
        return $this->hasMany(HabitLog::class);
    }
}
