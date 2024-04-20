<?php

namespace App\Filament\Resources\SchoolResource\Pages;

use App\Filament\Resources\SchoolResource;
use App\Models\Tenant;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;
use Stancl\Tenancy\Database\Models\Domain;

class CreateSchool extends CreateRecord
{
    protected static string $resource = SchoolResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $rootDomain = str_replace('https://', '', config('app.url'));
        $domain = $data['domain_prefix'] . '.' . $rootDomain;

        //Check that there are no other tenants/school with that domain
        $existingDomain = Domain::where('domain', $domain)->first();

        if($existingDomain){
            throw ValidationException::withMessages([
                'data.domain_prefix' => 'Domain already exists. Please use another one.',
            ]);
        }

        $school = static::getModel()::create($data);

        $school->domains()->create([
            'domain' => $domain
        ]);

        return $school;
    }
}
