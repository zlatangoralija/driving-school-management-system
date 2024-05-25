<?php

namespace App\Services;

use App\Enums\SchoolPayoutOption;
use App\Enums\UserType;
use App\Models\AvailabilityBreak;
use App\Models\Booking;
use Carbon\Carbon;
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

    public static function getHeaderLogo(){
        $logo = null;
        if(Auth::user() && Auth::user()->tenant && Auth::user()->tenant->logo){
            $logo = Auth::user()->tenant->logo_url;
        }

        return $logo;
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

    public static function getSidebarMobileSettingsMenu(){
        if(Auth::user()){
            switch (Auth::user()->type){
                case UserType::SchoolAdmin:
                    return self::schoolAdminMenu();
                case UserType::Instructor:
                    return self::instructorSidebarMobileSettingsMenu();
                case UserType::Student:
                    return self::studentMenu();
            }
        }
    }

    public static function getHeaderMenu(){
        if(Auth::user()){
            switch (Auth::user()->type){
                case UserType::SchoolAdmin:
                    return self::schoolAdminHeaderMenu();
                case UserType::Instructor:
                    return self::instructorHeaderMenu();
                case UserType::Student:
                    return self::studentHeaderMenu();
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
                'name' => 'Courses',
                'url' => route('school-administrators.courses.index'),
                'nested' => null
            ],
            [
                'name' => 'Bookings',
                'url' => route('school-administrators.bookings.index'),
                'nested' => null
            ],
        ];
    }

    public static function schoolAdminHeaderMenu(){
        $menu = [
            [
                'name' => 'Account settings',
                'url' => route('school-administrators.account-settings'),
            ],
            [
                'name' => 'School settings',
                'url' => route('school-administrators.school-settings'),
            ],
        ];

        if(Auth::user()->tenant->payout_option == SchoolPayoutOption::School->value){
            $menu[] = [
                'name' => 'Payment settings',
                'url' => route('school-administrators.payment-settings'),
            ];
        }

        return $menu;
    }

    public static function instructorMenu(){
        return [
            [
                'name' => 'Dashboard',
                'url' => route('instructors.dashboard'),
                'nested' => null
            ],
            [
                'name' => 'Students',
                'url' => route('instructors.students.index'),
                'nested' => null
            ],
            [
                'name' => 'Bookings',
                'url' => route('instructors.bookings-calendar'),
                'nested' => null
            ],
            [
                'name' => 'Availability breaks',
                'url' => route('instructors.availability-breaks.index'),
                'nested' => null
            ],
            [
                'name' => 'Courses',
                'url' => route('instructors.courses.index'),
                'nested' => null
            ],
            [
                'name' => 'Invoices',
                'url' => route('instructors.invoices.index'),
                'nested' => null
            ],
        ];
    }

    public static function instructorHeaderMenu(){
        $menu = [
            [
                'name' => 'Account settings',
                'url' => route('instructors.account-settings'),
            ],
            [
                'name' => 'Booking settings',
                'url' => route('instructors.booking-settings'),
            ],
        ];

        if(Auth::user()->tenant->payout_option == SchoolPayoutOption::Instructors->value){
            $menu[] = [
                'name' => 'Payment settings',
                'url' => route('instructors.payment-settings'),
            ];
        }

        return $menu;
    }

    public static function instructorSidebarMobileSettingsMenu(){
        return [
            [
                'name' => 'Settings',
                'url' => '#',
                'icon' => 'icon-logo-short',
                'active' => false,
                'nested' => [
                    [
                        'name' => 'My plan',
                        'url' => '#',
                        'active' => false,
                        'nested' => null,
                    ],
                    [
                        'name' => 'Tests',
                        'url' => '#',
                        'active' => false,
                        'nested' => null,
                    ],
                    [
                        'name' => 'Supplements',
                        'url' => '#',
                        'active' => false,
                        'nested' => null,
                    ],
                ]
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
                'name' => 'Courses',
                'url' => route('students.courses.index'),
                'nested' => null
            ],
            [
                'name' => 'Bookings',
                'url' => route('students.bookings-calendar'),
                'nested' => null
            ],
            [
                'name' => 'Invitations',
                'url' => route('students.invitations.index'),
                'nested' => null
            ],
            [
                'name' => 'Invoices',
                'url' => route('students.invoices.index'),
                'nested' => null
            ],
        ];
    }

    public static function studentHeaderMenu(){
        return [
            [
                'name' => 'Account settings',
                'url' => route('instructors.account-settings'),
            ],
            [
                'name' => 'Booking settings',
                'url' => route('instructors.booking-settings'),
            ],
        ];
    }

    public static function getInstructorUnavailableSlots($id){
        $events = Booking::where('instructor_id', $id)
            ->where('start_time', '>=', Carbon::now())
            ->get();

        $breaks = AvailabilityBreak::where('user_id', $id)
            ->get();

        $excludeTimes = [];

        foreach ($events as $event) {
            // Convert start_time and end_time strings to Carbon instances
            $startTime = Carbon::parse($event['start_time']);
            $endTime = Carbon::parse($event['end_time']);

            $eventDate = $startTime->format('Y-m-d');

            // Loop through each minute between start and end times
            while ($startTime->lte($endTime)) {
                // Add the time to the excludeTimes array, along with the event date
                $excludeTimes[] = [
                    'date' =>  $eventDate,
                    'hours' => $startTime->hour,
                    'minutes' => $startTime->minute
                ];

                // Move to the next 30-minute interval
                $startTime->addMinutes(30);
            }
        }

        foreach ($breaks as $break){
            // Convert start_time and end_time strings to Carbon instances
            $startTime = Carbon::parse($break['start_time']);
            $endTime = Carbon::parse($break['end_time']);

            $breakDate = $startTime->format('Y-m-d');

            // Loop through each minute between start and end times
            while ($startTime->lte($endTime)) {
                // Add the time to the excludeTimes array, along with the event date
                $excludeTimes[] = [
                    'date' =>  $breakDate,
                    'hours' => $startTime->hour,
                    'minutes' => $startTime->minute,
                    'message' => $break->reason
                ];

                // Move to the next 30-minute interval
                $startTime->addMinutes(30);
            }
        }

        return $excludeTimes;
    }

    public static function getStudentUnavailableSlots($id){

    }
}
