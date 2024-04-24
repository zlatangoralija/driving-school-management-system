<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Cassandra\Type\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Models\Domain;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'name' => 'required|string|max:255',
                'school_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $domainPrefix = Str::snake($request->school_name, '-');
            $domain =  $domainPrefix . '.' . config('app.root_url');
            $fullDomain = str_replace('https://', 'https://' . $domainPrefix . '.', config('app.url'));

            $school = Tenant::create([
                'name' => $request->school_name,
                'domain_prefix' => $domainPrefix,
                'address' => $request->address,
                'phone_number' => $request->phone,
            ]);

            $user = User::create([
                'name' => $request->name,
                'type' => \App\Enums\UserType::SchoolAdmin,
                'email' => $request->email,
                'status' => UserStatus::Active,
                'tenant_id' => $school->id,
                'password' => Hash::make($request->password),
            ]);

            $school->domains()->create([
                'domain' => $domain,
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            $checkout = $request
                ->user()
                ->newSubscription('Basic', 'price_1P9ABjRugHYe8kO9h3jczkV1')
                ->trialDays(30)
                ->checkout([
                    'success_url' => $fullDomain . '/school-administrators/dashboard',
                    'cancel_url' => $fullDomain,
                ]);

            return Inertia::location($checkout->url);

        } catch (\Exception $exception){
            DB::rollBack();
            dd($exception);
            return redirect()->back()->with('error', 'Something went wrong, please try again');
        }
    }
}
