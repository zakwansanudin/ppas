<?php

namespace App\Http\Controllers;

use App\Models\RecordChallenge;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QuizController extends Controller
{
    /**
     * Display the quiz arena (leaderboard page)
     */

    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Get default level based on user's age from MyKad
        $recommendedLevel = $this->getRecommendedLevel($user->mykad_number);

        // Get leaderboard for recommended level - FIXED: call the method correctly
        $leaderboard = $this->getFormattedLeaderboard($recommendedLevel);

        return Inertia::render('Quiz/Leaderboard', [
            'auth' => [
                'name' => $user->name,
                'mykad_number' => $user->mykad_number,
                'phone' => $user->phone,
            ],
            'initialLevel' => $recommendedLevel,
            'initialLeaderboard' => $leaderboard,
            'levelInfo' => $this->getAllLevelInfo(),
        ]);
    }

/**
 * Check if user has exceeded daily quiz attempts
 */
private function checkDailyAttempts($icNumber)
{
    try {
        $today = Carbon::today()->format('Y-m-d');
        
        // Count how many quizzes the user has taken today
        $todayAttempts = RecordChallenge::where('ic_number', $icNumber)
            ->whereDate('created_at', $today)
            ->count();
            
        return [
            'has_exceeded' => $todayAttempts >= 3,  // ← This checks if limit is reached
            'attempts_today' => $todayAttempts,
            'remaining' => max(0, 3 - $todayAttempts),  // ← Calculates remaining attempts
            'limit' => 3
        ];
    } catch (\Exception $e) {
        \Log::error('Error checking daily attempts: ' . $e->getMessage());
        return [
            'has_exceeded' => false,
            'attempts_today' => 0,
            'remaining' => 3,
            'limit' => 3
        ];
    }
}

/**
 * Check quiz eligibility before starting
 */
public function checkQuizEligibility(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        $validated = $request->validate([
            'ic_number' => 'required|string|max:20',
            'level' => 'required|string|in:L1,L2,L3,L4,L5,L6,U1,U2,U3,U4,U5',
        ]);

        // Verify IC number matches authenticated user
        if ($user->mykad_number !== (string)$validated['ic_number']) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication error: IC number mismatch',
            ], 403);
        }

        // Check daily attempts
        $dailyAttempts = $this->checkDailyAttempts($user->mykad_number);

        if ($dailyAttempts['has_exceeded']) {
            return response()->json([
                'success' => false,
                'eligible' => false,
                'message' => 'Anda telah mencapai had maksimum 3 kali kuiz sehari. Sila cuba lagi esok.',
                'attempts' => $dailyAttempts,
            ]);
        }

        // Get user's recent attempts for this level (optional: limit per level)
        $levelAttemptsToday = RecordChallenge::where('ic_number', $user->mykad_number)
            ->where('level', $validated['level'])
            ->whereDate('created_at', Carbon::today())
            ->count();

        return response()->json([
            'success' => true,
            'eligible' => true,
            'message' => 'Anda layak untuk memulakan kuiz!',
            'attempts' => $dailyAttempts,
            'level_attempts_today' => $levelAttemptsToday,
            'user' => [
                'name' => $user->name,
                'mykad' => $user->mykad_number,
            ],
        ]);
    } catch (\Exception $e) {
        \Log::error('Error checking quiz eligibility: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'eligible' => false,
            'message' => 'Failed to check quiz eligibility',
        ], 500);
    }
}

    /**
     * Save quiz results to database
     */
    public function saveResults(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'ic_number' => 'required|string|max:20',
                'total_correct' => 'required|integer|min:0|max:5',
                'total_time' => 'required', // Can be seconds or time string
                'level' => 'required|string|in:L1,L2,L3,L4,L5,L6,U1,U2,U3,U4,U5',
            ]);

            // Get authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            // Verify IC number matches authenticated user (security)
            // Ensure it's treated as string
            $icNumber = (string) $validated['ic_number'];

            if ($user->mykad_number !== $icNumber) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication error: IC number mismatch',
                ], 403);
            }

            // Format total_time
            $totalTime = $this->formatTimeForDatabase($validated['total_time']);

            // Create quiz record - ensure ic_number is string
            $record = RecordChallenge::create([
                'ic_number' => $icNumber, // Explicit string
                'total_correct' => $validated['total_correct'],
                'total_time' => $totalTime,
                'level' => $validated['level'],
            ]);

            // Get updated leaderboard
            $leaderboard = $this->getFormattedLeaderboard($validated['level']);

            // Get user stats - FIXED: use calculateUserStats instead of getUserStats
            $userStats = $this->calculateUserStats($icNumber);

            return response()->json([
                'success' => true,
                'message' => 'Quiz results saved successfully! 🎉',
                'record' => [
                    'id' => $record->id,
                    'level' => $record->level,
                    'score' => $record->total_correct,
                    'time' => $record->getFormattedTime(),
                    'created_at' => $record->created_at->format('d/m/Y H:i'),
                ],
                'leaderboard' => $leaderboard,
                'user_stats' => $userStats,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // return response()->json([
            //     'success' => false,
            //     'message' => 'Validation error',
            //     'errors' => $e->errors(),
            // ], 422);

        } catch (\Exception $e) {
            \Log::error('Error saving quiz results: ' . $e->getMessage());

            // return response()->json([
            //     'success' => false,
            //     'message' => 'Failed to save quiz results. Please try again.',
            //     'error' => config('app.debug') ? $e->getMessage() : null,
            // ], 500);
        }
    }

    /**
     * Get leaderboard for a specific level
     */
    public function getLeaderboard($level)
    {
        try {
            $validated = validator(['level' => $level], [
                'level' => 'required|in:L1,L2,L3,L4,L5,L6,U1,U2,U3,U4,U5',
            ])->validate();

            $leaderboard = $this->getFormattedLeaderboard($level);

            return response()->json([
                'success' => true,
                'level' => $level,
                'leaderboard' => $leaderboard,
                'total_players' => count($leaderboard),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leaderboard',
            ], 500);
        }
    }

    /**
     * Get user's quiz history
     */
    public function getUserHistory()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $history = RecordChallenge::where('ic_number', $user->mykad_number)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'level' => $record->level,
                        'level_name' => $record->getLevelName(),
                        'score' => $record->total_correct,
                        'total_questions' => 5,
                        'time' => $record->getFormattedTime(),
                        'accuracy' => round($record->getAccuracy(), 1),
                        'date' => $record->created_at->format('d/m/Y'),
                        'time_full' => $record->created_at->format('H:i'),
                        'created_at' => $record->created_at->diffForHumans(),
                    ];
                });

            $stats = $this->calculateUserStats($user->mykad_number);

            return response()->json([
                'success' => true,
                'history' => $history,
                'stats' => $stats,
                'user' => [
                    'name' => $user->name,
                    'mykad' => $user->mykad_number,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user history: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch quiz history',
            ], 500);
        }
    }

    /**
     * Get overall statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_quizzes' => RecordChallenge::count(),
                'total_players' => RecordChallenge::distinct('ic_number')->count(),
                'average_score' => round(RecordChallenge::avg('total_correct') ?? 0, 1),
                'total_correct_answers' => RecordChallenge::sum('total_correct'),
                'total_time_spent' => $this->formatTotalTimeSpent(),
                'most_popular_level' => $this->getMostPopularLevel(),
                'recent_activity' => $this->getRecentActivity(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'updated_at' => now()->format('d/m/Y H:i'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
            ], 500);
        }
    }

    /**
     * Get user's rank in a specific level
     */
    public function getUserRank(Request $request, $level)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $rank = $this->calculateUserRank($user->mykad_number, $level);

            return response()->json([
                'success' => true,
                'level' => $level,
                'rank' => $rank,
                'user' => [
                    'name' => $user->name,
                    'mykad' => $user->mykad_number,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user rank',
            ], 500);
        }
    }

    /**
     * ============================================
     * HELPER METHODS
     * ============================================
     */

    /**
     * Get recommended level based on MyKad (age calculation)
     */
    private function getRecommendedLevel($mykad)
    {
        try {
            // Extract birth year from MyKad (format: YYMMDD-XX-XXXX)
            $yearPart = substr($mykad, 0, 2);
            $monthPart = substr($mykad, 2, 2);
            $dayPart = substr($mykad, 4, 2);

            // Determine century (2000s or 1900s)
            $currentYear = date('Y');
            $currentShortYear = substr($currentYear, -2);

            $birthYear = ($yearPart <= $currentShortYear)
                ? (2000 + $yearPart)
                : (1900 + $yearPart);

            // Calculate age
            $birthDate = Carbon::create($birthYear, $monthPart, $dayPart);
            $age = $birthDate->age;

            // Map age to level
            if ($age >= 7 && $age <= 12) {
                return 'L' . ($age - 6); // L1 for age 7, L2 for age 8, etc.
            } elseif ($age >= 13 && $age <= 17) {
                return 'U' . ($age - 12); // U1 for age 13, U2 for age 14, etc.
            } elseif ($age < 7) {
                return 'L1'; // Default to youngest
            } else {
                return 'U5'; // Default to oldest
            }
        } catch (\Exception $e) {
            return 'L1'; // Default fallback
        }
    }

    /**
     * Format time for database storage
     */
    private function formatTimeForDatabase($timeInput)
    {
        // If time is in seconds (from frontend timer)
        if (is_numeric($timeInput)) {
            $seconds = (int) $timeInput;
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            $seconds = $seconds % 60;

            return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        }

        // If already in HH:MM:SS format
        if (preg_match('/^(\d{1,2}):(\d{2}):(\d{2})$/', $timeInput)) {
            return $timeInput;
        }

        // If in MM:SS format
        if (preg_match('/^(\d{1,2}):(\d{2})$/', $timeInput)) {
            return '00:' . $timeInput;
        }

        return '00:00:00';
    }

    /**
     * Get formatted leaderboard for a level 
     */
    private function getFormattedLeaderboard($level)
    {
        return RecordChallenge::where('level', $level)
            ->select('ic_number', DB::raw('MAX(total_correct) as best_score'), DB::raw('MIN(total_time) as best_time'))
            ->groupBy('ic_number') // <-- This groups by user, showing only their best record
            ->orderBy('best_score', 'desc')
            ->orderBy('best_time', 'asc')
            ->limit(20)
            ->get()
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => $this->getPlayerName($item->ic_number),
                    'mykad' => $item->ic_number,
                    'score' => $item->best_score , // Convert to points (20 per question)
                    'time' => $this->formatTimeForDisplay($item->best_time),
                    'avatar' => $this->getAvatarByRank($index + 1),
                ];
            })
            ->values()
            ->toArray();
    }

//     private function getFormattedLeaderboard($level)
// {
//     return RecordChallenge::where('level', $level)
//         ->orderBy('total_correct', 'desc')
//         ->orderBy('total_time', 'asc')
//         ->limit(20)
//         ->get()
//         ->map(function ($item, $index) {
//             return [
//                 'rank' => $index + 1,
//                 'name' => $this->getPlayerName($item->ic_number),
//                 'mykad' => $item->ic_number,
//                 'score' => $item->total_correct , 
//                 'time' => $this->formatTimeForDisplay($item->total_time),
//                 'avatar' => $this->getAvatarByRank($index + 1),
//             ];
//         })
//         ->values()
//         ->toArray();
// }

    /**
     * Get player name from IC (in real app, get from User model)
     */
    private function getPlayerName($icNumber)
    {
        // Try to get from User model first
        $user = User::where('mykad_number', $icNumber)->first();
        if ($user) {
            return $user->name;
        }

        // Fallback to stored names or generate from IC
        $players = [
            '082312-33-1231' => 'Ahmad Zaidi',
            '170101-01-1234' => 'Ali',
            '171202-02-5678' => 'Sara',
            '160303-03-9012' => 'Ahmad',
            '160404-04-3456' => 'Siti',
        ];

        return $players[$icNumber] ?? 'Player ' . substr($icNumber, -4);
    }

    /**
     * Get avatar based on rank
     */
    private function getAvatarByRank($rank)
    {
        $avatars = [
            1 => '🥇',
            2 => '🥈',
            3 => '🥉',
            4 => '⭐',
            5 => '🔥',
            6 => '⚡',
            7 => '🚀',
            8 => '💎',
            9 => '👑',
            10 => '🎯',
        ];

        return $avatars[$rank] ?? '🎮';
    }

    /**
     * Format time for display (MM:SS)
     */
private function formatTimeForDisplay($time)
{
    if (!$time) return '0:00';
    
    \Log::info('formatTimeForDisplay input:', ['time' => $time]);
    
    $result = '';
    
    if (preg_match('/:(\d{1,2})$/', $time, $matches)) {
        $seconds = (int)$matches[1];
        $result = sprintf('%d:%02d', 0, $seconds);
    } else {
        $parts = explode(':', $time);
        if (count($parts) >= 2) {
            $minutes = (int)end($parts, -2);
            $seconds = (int)end($parts);
            $result = sprintf('%d:%02d', $minutes, $seconds);
        } else {
            $result = '0:00';
        }
    }
    
    \Log::info('formatTimeForDisplay output:', ['result' => $result]);
    
    return $result;
}

    /**
     * Calculate user statistics
     */
    private function calculateUserStats($icNumber)
    {
        $records = RecordChallenge::where('ic_number', $icNumber)->get();

        if ($records->isEmpty()) {
            return null;
        }

        $totalQuizzes = $records->count();
        $totalCorrect = $records->sum('total_correct');
        $totalQuestions = $totalQuizzes * 5;
        $averageScore = round($totalCorrect / $totalQuizzes, 1);
        $bestScore = $records->max('total_correct');
        $totalTime = $records->sum(function ($record) {
            return $record->getTotalTimeInSeconds();
        });

        // Get best level
        $bestLevelRecord = $records->sortByDesc('total_correct')->first();
        $bestLevel = $bestLevelRecord ? $bestLevelRecord->level : 'N/A';

        // Get levels attempted
        $levelsAttempted = $records->pluck('level')->unique()->values();

        // Calculate accuracy percentage
        $accuracy = $totalQuestions > 0 ? round(($totalCorrect / $totalQuestions) * 100, 1) : 0;

        // Format total time
        $formattedTotalTime = $this->secondsToTime($totalTime);

        return [
            'total_quizzes' => $totalQuizzes,
            'total_correct' => $totalCorrect,
            'total_questions' => $totalQuestions,
            'average_score' => $averageScore,
            'best_score' => $bestScore,
            'accuracy' => $accuracy,
            'total_time' => $formattedTotalTime,
            'best_level' => $bestLevel,
            'levels_attempted' => $levelsAttempted,
            'levels_attempted_count' => $levelsAttempted->count(),
        ];
    }

    /**
     * Calculate user's rank in a specific level
     */
    private function calculateUserRank($icNumber, $level)
    {
        // Get all players' best scores for this level
        $allPlayers = RecordChallenge::where('level', $level)
            ->select('ic_number', DB::raw('MAX(total_correct) as best_score'), DB::raw('MIN(total_time) as best_time'))
            ->groupBy('ic_number')
            ->orderBy('best_score', 'desc')
            ->orderBy('best_time', 'asc')
            ->get();

        // Find user's position
        $userIndex = $allPlayers->search(function ($player) use ($icNumber) {
            return $player->ic_number === $icNumber;
        });

        if ($userIndex === false) {
            return null; // User hasn't played this level
        }

        $userBest = $allPlayers[$userIndex];
        $userScore = $userBest->best_score;

        // Count how many players have better scores
        $betterPlayers = $allPlayers->filter(function ($player) use ($userScore, $userBest) {
            if ($player->best_score > $userScore) {
                return true;
            }
            if ($player->best_score == $userScore && $player->best_time < $userBest->best_time) {
                return true;
            }
            return false;
        })->count();

        return [
            'rank' => $betterPlayers + 1,
            'total_players' => $allPlayers->count(),
            'score' => $userScore,
            'time' => $this->formatTimeForDisplay($userBest->best_time),
        ];
    }

    /**
     * Convert seconds to readable time format
     */
    private function secondsToTime($seconds)
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%d jam %d minit', $hours, $minutes);
        } elseif ($minutes > 0) {
            return sprintf('%d minit %d saat', $minutes, $seconds);
        } else {
            return sprintf('%d saat', $seconds);
        }
    }

    /**
     * Get total time spent by all players
     */
    private function formatTotalTimeSpent()
    {
        $totalSeconds = RecordChallenge::get()->sum(function ($record) {
            return $record->getTotalTimeInSeconds();
        });

        return $this->secondsToTime($totalSeconds);
    }

    /**
     * Get most popular level
     */
    private function getMostPopularLevel()
    {
        $popular = RecordChallenge::select('level', DB::raw('COUNT(*) as attempts'))
            ->groupBy('level')
            ->orderBy('attempts', 'desc')
            ->first();

        return $popular ? [
            'level' => $popular->level,
            'attempts' => $popular->attempts,
            'level_name' => (new RecordChallenge())->getLevelName($popular->level),
        ] : null;
    }

    /**
     * Get recent activity
     */
    private function getRecentActivity()
    {
        return RecordChallenge::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($record) {
                return [
                    'player' => $this->getPlayerName($record->ic_number),
                    'level' => $record->level,
                    'score' => $record->total_correct,
                    'time' => $record->getFormattedTime(),
                    'when' => $record->created_at->diffForHumans(),
                ];
            });
    }

    /**
     * Get all level information
     */
    private function getAllLevelInfo()
    {
        return [
            'L1' => ['age' => '7 tahun', 'category' => 'Primary', 'name' => 'Tahun 1'],
            'L2' => ['age' => '8 tahun', 'category' => 'Primary', 'name' => 'Tahun 2'],
            'L3' => ['age' => '9 tahun', 'category' => 'Primary', 'name' => 'Tahun 3'],
            'L4' => ['age' => '10 tahun', 'category' => 'Primary', 'name' => 'Tahun 4'],
            'L5' => ['age' => '11 tahun', 'category' => 'Primary', 'name' => 'Tahun 5'],
            'L6' => ['age' => '12 tahun', 'category' => 'Primary', 'name' => 'Tahun 6'],
            'U1' => ['age' => '13 tahun', 'category' => 'Secondary', 'name' => 'Tingkatan 1'],
            'U2' => ['age' => '14 tahun', 'category' => 'Secondary', 'name' => 'Tingkatan 2'],
            'U3' => ['age' => '15 tahun', 'category' => 'Secondary', 'name' => 'Tingkatan 3'],
            'U4' => ['age' => '16 tahun', 'category' => 'Secondary', 'name' => 'Tingkatan 4'],
            'U5' => ['age' => '17 tahun', 'category' => 'Secondary', 'name' => 'Tingkatan 5'],
        ];
    }

    

    
}
