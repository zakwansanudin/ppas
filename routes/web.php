<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\Auth\UserFormController;
use App\Http\Controllers\FeedbackController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Make '/' route point to the signup page
Route::get('/', [UserFormController::class, 'create'])->name('signup.create');

// Signup routes
Route::post('/signup', [UserFormController::class, 'store'])->name('signup.store');

// Dashboard route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

// Quiz Interface
// Route::get('/quiz-arena', function () {
//     $user = auth()->user();
    
//     return Inertia::render('Quiz/Leaderboard', [
//         'auth' => $user ? [
//             'name' => $user->name,
//             'mykad_number' => $user->mykad_number ?? null, // Use null coalescing for safety
//         ] : null
//     ]);
// })->middleware('auth');

Route::get('/quiz-arena', [QuizController::class, 'index'])->name('quiz.index');
Route::get('/quiz/leaderboard/{level}', [QuizController::class, 'getLeaderboard'])->name('quiz.leaderboard');

Route::post('/quiz/check-eligibility', [QuizController::class, 'checkQuizEligibility']);
    



Route::post('/quiz/save-results', [QuizController::class, 'saveResults'])->name('quiz.save');


Route::get('/sample-xcelearn', function () {
    return Inertia::render('Xcelearn');
});

Route::get('/sample-course', function () {
    return Inertia::render('CourseCard');
});

// Profile routes (requires auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/feedback/submit', [FeedbackController::class, 'submit'])->name('feedback.submit');
Route::get('/feedback/user', [FeedbackController::class, 'getUserFeedback'])->name('feedback.user');
Route::get('/feedback/stats', [FeedbackController::class, 'getStats'])->name('feedback.stats');

// Auth routes (login, logout, password reset, etc.)
require __DIR__.'/auth.php';
