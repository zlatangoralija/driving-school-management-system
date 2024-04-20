<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolAdministratorController extends Controller
{
    public function dashboard(){

        $data['admins'] = User::where('type', UserType::SchoolAdmin)->get();
        $data['students'] = User::where('type', UserType::Student)->get();
        $data['instructors'] = User::where('type', UserType::Instructor)->get();

        return Inertia::render('Users/SchoolAdmins/Dashboard', $data);
    }
}
