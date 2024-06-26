<?php

namespace App\Http\Controllers\Auth;

use App\Enums\SchoolPayoutOption;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
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
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Models\Domain;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $plan = SubscriptionPlan::where('stripe_id', $request->input('plan'))->first();
        $data['plan_id'] = $plan ? $plan->stripe_id : null;
        $data['plan_name'] = $plan ? $plan->name : null;
        $data['plan_qty'] = $request->input('qty');
        $data['trial'] = $request->input('trial');

        return Inertia::render('Auth/Register', $data);
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

            //See if tenant name or domain name already exists
            $existingTenant = Tenant::where('data->name', $request->school_name)
                ->orWhere('data->domain_prefix', $domainPrefix)
                ->exists();

            $existingDomain = Domain::where('domain', $domain)
                ->exists();

            if($existingTenant){
                throw ValidationException::withMessages([
                    'school_name' => 'School name already exists. Please use another one.',
                ]);
            }

            if($existingDomain){
                throw ValidationException::withMessages([
                    'domain_prefix' => 'Domain already exists. Please use another one.',
                ]);
            }


            $school = Tenant::create([
                'name' => $request->school_name,
                'domain_prefix' => $domainPrefix,
                'address' => $request->address,
                'phone_number' => $request->phone,
                'payout_option' => SchoolPayoutOption::School,
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

            $checkout = null;
            if($request->input('trial')){
                $checkout = $request
                    ->user()
                    ->newSubscription('Basic', 'price_1P9ABjRugHYe8kO9h3jczkV1')
                    ->trialDays(30)
                    ->checkout([
                        'success_url' => $fullDomain . '/school-administrators/dashboard',
                        'cancel_url' => route('home'),
                    ]);
            }

            if($request->input('plan_id')){
                $checkout = $request
                    ->user()
                    ->newSubscription($request->input('plan_name'), $request->input('plan_id'))
                    ->quantity($request->input('plan_qty') ?: 1)
                    ->trialDays(30)
                    ->checkout([
                        'success_url' => $fullDomain . '/school-administrators/dashboard',
                        'cancel_url' => route('home'),
                    ]);
            }

            return Inertia::location($checkout->url);

        } catch (\Exception $exception){
            DB::rollBack();
            return redirect()->back()
                ->with('error', isset($exception->validator) ? [$exception->getMessage()] :  ['Something went wrong, please try again.']);
        }
    }
}
