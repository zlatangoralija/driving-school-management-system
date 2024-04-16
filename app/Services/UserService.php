<?php

namespace App\Services;

use App\Enums\UserType;
use Illuminate\Support\Facades\Auth;

class UserService
{
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
