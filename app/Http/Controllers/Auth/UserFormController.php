<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserFormController extends Controller
{
    public function create()
    {
        return Inertia::render('SignUp');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'mykad_number' => [
                'required',
                'regex:/^\d{6}-\d{2}-\d{4}$/',
                'size:14',
            ],
            'phone' => 'required|string',
        ], [
            'mykad_number.regex' => 'Nombor kad pengenalan mestilah dalam format: XXXXXX-XX-XXXX',
            'mykad_number.size' => 'Nombor kad pengenalan mestilah mempunyai 14 nombor termasuk "-" ',
        ]);

        // Create or get the user
        $user = User::firstOrCreate(
            ['mykad_number' => $validated['mykad_number']],
            [
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]
        );


        // Log the user in manually
        Auth::login($user);

        // Redirect to dashboard
        return redirect()->route('dashboard');
    }
}
