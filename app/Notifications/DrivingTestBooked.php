<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DrivingTestBooked extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $drivingTestDate;
    public $student;
    public function __construct($drivingTestDate, $student)
    {
        $this->drivingTestDate = $drivingTestDate;
        $this->student = $student;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('You driving test has been booked!.')
            ->line('You driving test has been booked!.')
            ->line('Your driving test date is: ' . Carbon::parse($this->drivingTestDate)->timezone($this->student->timezone ?: 'UTC')->format('d/m/y H:i'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
