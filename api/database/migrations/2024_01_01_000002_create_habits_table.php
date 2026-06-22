<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon')->default('✅');
            $table->integer('target')->default(1);
            $table->string('unit')->default('times');
            $table->string('color')->default('#2563EB');
            $table->time('reminder_time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('log_date');
            $table->integer('value')->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['habit_id', 'log_date']);
        });

        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon')->default('🎯');
            $table->decimal('progress', 5, 2)->default(0);
            $table->date('deadline');
            $table->boolean('is_completed')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('goal_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goal_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('progress_delta', 5, 2)->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->default('🏆');
            $table->text('description');
            $table->string('category')->default('general');
            $table->integer('requirement_value')->default(0);
            $table->string('requirement_type')->default('streak');
            $table->timestamps();
        });

        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->timestamp('achieved_at');
            $table->unique(['user_id', 'achievement_id']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('info');
            $table->string('title');
            $table->text('body');
            $table->string('icon')->nullable();
            $table->string('action_url')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('dark_mode')->default(false);
            $table->string('language')->default('en');
            $table->boolean('notifications_enabled')->default(true);
            $table->boolean('habit_reminders')->default(true);
            $table->boolean('goal_reminders')->default(true);
            $table->boolean('weekly_report')->default(true);
            $table->string('security_type')->nullable();
            $table->timestamps();
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('goal_logs');
        Schema::dropIfExists('goals');
        Schema::dropIfExists('habit_logs');
        Schema::dropIfExists('habits');
    }
};
