<?php

namespace App\Services;

use App\Enums\UserType;
use Illuminate\Support\Facades\Auth;

class UserService
{

    public static function getDashboardUrl(){
        if(Auth::user()){

            $fullDomain = null;
            if(Auth::user() && Auth::user()->tenant){
                $domainPrefix = Auth::user()->tenant->domain_prefix . '.';
                $fullDomain = str_replace('https://', 'https://' . $domainPrefix, config('app.url'));
            }

            switch (Auth::user()->type){
                case UserType::SchoolAdmin:
                    return $fullDomain . '/school-administrators/dashboard';
                case UserType::Instructor:
                    return $fullDomain . '/instructors/dashboard';
                case UserType::Student:
                    return $fullDomain . '/students/dashboard';
                case UserType::Administrator:
                    return route('filament.admin.pages.dashboard');
            }
        }

        return null;
    }

    public static function getSidebarMenu(){
        if(Auth::user()){
            switch (Auth::user()->type){
                case UserType::SchoolAdmin:
                    return self::schoolAdminMenu();
                case UserType::Instructor:
                    return self::instructorMenu();
                case UserType::Student:
                    return self::studentMenu();
            }
        }
    }

    public static function schoolAdminMenu(){
        return [
            [
                'name' => 'Dashboard',
                'url' => route('school-administrators.dashboard'),
                'nested' => null
            ],
            [
                'name' => 'School settings',
                'url' => route('school-administrators.settings.index'),
                'nested' => null
            ],
            [
                'name' => 'Administrators',
                'url' => route('school-administrators.administrators.index'),
                'nested' => null
            ],
            [
                'name' => 'Instructors',
                'url' => route('school-administrators.instructors.index'),
                'nested' => null
            ],
            [
                'name' => 'Students',
                'url' => route('school-administrators.students.index'),
                'nested' => null
            ],
            [
                'name' => 'Logout',
                'url' => route('logout'),
                'nested' => null
            ],
        ];
    }

    public static function instructorMenu(){
        return [
            [
                'name' => 'Dashboard',
                'url' => route('instructors.dashboard'),
                'nested' => null
            ],
            [
                'name' => 'Link #1',
                'url' => '#',
                'nested' => null
            ],
            [
                'name' => 'Link 2',
                'url' => '#',
                'nested' => null
            ],
            [
                'name' => 'Logout',
                'url' => route('logout'),
                'nested' => null
            ],
        ];
    }

    public static function studentMenu(){
        return [
            [
                'name' => 'Dashboard',
                'url' => route('students.dashboard'),
                'nested' => null
            ],
            [
                'name' => 'Link #1',
                'url' => '#',
                'nested' => null
            ],
            [
                'name' => 'Link 2',
                'url' => '#',
                'nested' => null
            ],
            [
                'name' => 'Logout',
                'url' => route('logout'),
                'nested' => null
            ],
        ];
    }
}
