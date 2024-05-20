<?php

namespace App\Http\Middleware;

use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'layouts.main';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'dashboard_url' => UserService::getDashboardUrl()
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'errors' => fn () => $request->session()->get('error')
            ],
            'layout' => [
                'hide_sidebar' => true,
                'logo' => UserService::getHeaderLogo(),
                'sidebar_menu' => UserService::getSidebarMenu(),
                'settings_menu' => UserService::getHeaderMenu(),
            ]
        ];
    }
}
