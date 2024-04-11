<?php

namespace App\Filament\Resources\SchoolResource\RelationManagers;

use App\Enums\UserType;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StudentsRelationManager extends RelationManager
{
    protected static string $relationship = 'students';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('Select student')
                    ->required()
                    ->multiple()
                    ->searchable()
                    ->columnSpanFull()
                    ->options(User::where('type', UserType::Student)
                        ->whereNull('school_id')
                        ->pluck('name', 'id')
                    )
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->sortable()
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make('associate_user')
                    ->label('Add new student')
                    ->modalHeading('Add new student')
                    ->createAnother(false)
                    ->modalSubmitActionLabel('Add student')
                    ->using(function (array $data): Model {

                        $schoolID = $this->getOwnerRecord()->id;
                        $users = User::whereIn('id', $data['user_id'])->get();

                        if($users){
                            foreach ($users as $user){
                                $user->school_id = $schoolID;
                                $user->save();
                            }
                        }

                        return $this->getOwnerRecord();
                    })
                    ->successNotificationTitle('Student added to ' . $this->getOwnerRecord()->name)
            ])
            ->actions([
                Tables\Actions\DeleteAction::make()
                    ->label('Remove student')
                    ->modalSubmitActionLabel('Remove student')
                    ->modalHeading('Remove student')
                    ->using(function (array $data, $record): Model {
                        $record->school_id = null;
                        $record->save();

                        return $this->getOwnerRecord();
                    })
                    ->successNotificationTitle('Student removed from ' . $this->getOwnerRecord()->name),
            ])
            ->bulkActions([
                //
            ]);
    }
}
