<?php

namespace App\Http\Controllers\SchoolAdministrators;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){
        Inertia::share('layout.active_page', ['Dashboard']);

        $data['admins'] = User::where('type', UserType::SchoolAdmin)->count();
        $data['students'] = User::where('type', UserType::Student)->count();
        $data['instructors'] = User::where('type', UserType::Instructor)->count();

        return Inertia::render('Users/SchoolAdmins/Dashboard', $data);
    }
}
