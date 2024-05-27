<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:booking-reminder')->everyMinute();
