<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolAdministratorController extends Controller
{
    public function dashboard(){
        return Inertia::render('Users/SchoolAdmins/Dashboard');
    }
}
