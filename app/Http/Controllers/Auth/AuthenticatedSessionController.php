<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {

        $request->authenticate();

        $request->session()->regenerate();

        if(Auth::user()){
            $domainPrefix = Auth::user()->tenant->domain_prefix . '.';
            $fullDomain = str_replace('https://', 'https://' . $domainPrefix, config('app.url'));
            switch (Auth::user()->type){
                case UserType::SchoolAdmin:
                    return Inertia::location($fullDomain . '/school-administrators/dashboard');
                case UserType::Instructor:
                    return Inertia::location($fullDomain . '/instructors/dashboard');
                case UserType::Student:
                    return Inertia::location($fullDomain . '/students/dashboard');
            }
        }

    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
