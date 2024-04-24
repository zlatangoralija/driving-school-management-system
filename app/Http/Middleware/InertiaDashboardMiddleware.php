<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class InertiaDashboardMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share('layout.hide_sidebar', false);

        $tenant = $request->user()->tenant;
        $tenantAdmin = User::where('tenant_id', $tenant->id)->whereHas('subscriptions')->first();

        if($tenantAdmin){
            if($tenantAdmin->subscriptions()->active()->count()){
                return $next($request);
            }
        }

        abort(403);
    }
}
