<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function index(){
        Inertia::share('layout.is_homepage', true);

        $data['plans'] = SubscriptionPlan::get()->groupBy('type');
        return Inertia::render('Index', $data);
    }
}
