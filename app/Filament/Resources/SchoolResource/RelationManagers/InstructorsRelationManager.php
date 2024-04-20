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

class InstructorsRelationManager extends RelationManager
{
    protected static string $relationship = 'instructors';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('Select instructor')
                    ->columnSpanFull()
                    ->required()
                    ->multiple()
                    ->searchable()
                    ->options(User::where('type', UserType::Instructor)
                        ->whereNull('tenant_id')
                        ->pluck('name', 'id'))
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
                Tables\Actions\CreateAction::make('associate_instructor')
                    ->label('Add new instructor')
                    ->createAnother(false)
                    ->modalSubmitActionLabel('Add instructor')
                    ->modalHeading('Add new instructor')
                    ->using(function (array $data): Model {

                        $schoolID = $this->getOwnerRecord()->id;
                        $users = User::whereIn('id', $data['user_id'])->get();

                        if($users){
                            foreach ($users as $user){
                                $user->tenant_id = $schoolID;
                                $user->save();
                            }
                        }

                        return $this->getOwnerRecord();
                    })
                    ->successNotificationTitle('Instructor added to ' . $this->getOwnerRecord()->name)
            ])
            ->actions([
                Tables\Actions\DeleteAction::make()
                    ->label('Remove instructor')
                    ->modalSubmitActionLabel('Remove instructor')
                    ->modalHeading('Remove instructor')
                    ->using(function (array $data, $record): Model {
                        $record->tenant_id = null;
                        $record->save();

                        return $this->getOwnerRecord();
                    })
                    ->successNotificationTitle('Instructor removed from ' . $this->getOwnerRecord()->name),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
