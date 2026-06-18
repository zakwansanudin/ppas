<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Submit feedback from quiz
     */
    public function submit(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string|max:255',
                'mykad_number' => 'required|string|max:20',
                'rating' => 'required|integer|min:1|max:5',
                'interest' => 'required|boolean',
                'phone_number' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Get authenticated user
            $user = Auth::user();

            // Optional: Verify user matches the submitted data
            if ($user && $user->mykad_number !== $request->mykad_number) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication error: MyKad number mismatch',
                ], 403);
            }

            // Create feedback record
            $feedback = Feedback::create([
                'full_name' => $request->full_name,
                'mykad_number' => $request->mykad_number,
                'rating' => $request->rating,
                'interest' => $request->interest,
                'phone_number' => $request->phone_number,
            ]);

            // return response()->json([
            //     'success' => true,
            //     'message' => 'Thank you for your feedback!',
            //     'feedback' => [
            //         'id' => $feedback->id,
            //         'rating' => $feedback->rating,
            //         'interest' => $feedback->interest,
            //         'submitted_at' => $feedback->created_at->format('d/m/Y H:i'),
            //     ],
            // ]);

        } catch (\Exception $e) {
            \Log::error('Error submitting feedback: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get user's feedback history
     */
    public function getUserFeedback()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $feedback = Feedback::where('mykad_number', $user->mykad_number)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'rating' => $item->rating,
                        'interest' => $item->interest,
                        'phone_number' => $item->phone_number,
                        'submitted_at' => $item->created_at->format('d/m/Y H:i'),
                        'created_at' => $item->created_at->diffForHumans(),
                    ];
                });

            // Calculate average rating
            $averageRating = Feedback::where('mykad_number', $user->mykad_number)
                ->avg('rating');

            return response()->json([
                'success' => true,
                'feedback' => $feedback,
                'stats' => [
                    'total_feedback' => $feedback->count(),
                    'average_rating' => round($averageRating, 1),
                    'interests_count' => $feedback->where('interest', true)->count(),
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching feedback: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feedback history',
            ], 500);
        }
    }

    /**
     * Get overall feedback statistics (admin)
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_feedback' => Feedback::count(),
                'average_rating' => round(Feedback::avg('rating') ?? 0, 1),
                'interested_count' => Feedback::where('interest', true)->count(),
                'not_interested_count' => Feedback::where('interest', false)->count(),
                'rating_distribution' => $this->getRatingDistribution(),
                'recent_feedback' => Feedback::with('user')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get()
                    ->map(function ($item) {
                        return [
                            'name' => $item->full_name,
                            'rating' => $item->rating,
                            'interest' => $item->interest,
                            'phone' => $item->phone_number,
                            'when' => $item->created_at->diffForHumans(),
                        ];
                    }),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'updated_at' => now()->format('d/m/Y H:i'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch feedback statistics',
            ], 500);
        }
    }

    /**
     * Get rating distribution
     */
    private function getRatingDistribution()
    {
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $distribution[$i] = Feedback::where('rating', $i)->count();
        }
        return $distribution;
    }
}