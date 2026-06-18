<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecordChallenge extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'record_challenge';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ic_number',
        'total_correct',
        'total_time',
        'level',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_time' => 'datetime:H:i:s', // Cast to Carbon time
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // Add any fields you want to hide
    ];

    /**
     * Get the total time in seconds.
     *
     * @return int
     */
    public function getTotalTimeInSecondsAttribute(): int
    {
        if (!$this->total_time) {
            return 0;
        }

        $time = explode(':', $this->total_time);
        return ($time[0] * 3600) + ($time[1] * 60) + ($time[2] ?? 0);
    }

    /**
     * Get the total time in minutes.
     *
     * @return float
     */
    public function getTotalTimeInMinutesAttribute(): float
    {
        $seconds = $this->getTotalTimeInSecondsAttribute();
        return $seconds / 60;
    }

    /**
     * Get the accuracy percentage.
     *
     * @return float|null
     */
    public function getAccuracyAttribute(): ?float
    {
        // Assuming total questions is 5 (as per your quiz)
        $totalQuestions = 5;
        
        if ($totalQuestions > 0) {
            return ($this->total_correct / $totalQuestions) * 100;
        }
        
        return null;
    }

    /**
     * Get the formatted total time.
     *
     * @return string
     */
    public function getFormattedTotalTimeAttribute(): string
    {
        if (!$this->total_time) {
            return '00:00';
        }

        $time = explode(':', $this->total_time);
        return $time[0] . ':' . $time[1]; // Returns HH:MM format
    }

    /**
     * Get the level name.
     *
     * @return string
     */
    public function getLevelNameAttribute(): string
    {
        $levelNames = [
            'L1' => 'Level 1 (7 tahun)',
            'L2' => 'Level 2 (8 tahun)',
            'L3' => 'Level 3 (9 tahun)',
            'L4' => 'Level 4 (10 tahun)',
            'L5' => 'Level 5 (11 tahun)',
            'L6' => 'Level 6 (12 tahun)',
            'U1' => 'Upper 1 (13 tahun)',
            'U2' => 'Upper 2 (14 tahun)',
            'U3' => 'Upper 3 (15 tahun)',
            'U4' => 'Upper 4 (16 tahun)',
            'U5' => 'Upper 5 (17 tahun)',
        ];

        return $levelNames[$this->level] ?? 'Unknown Level';
    }
}