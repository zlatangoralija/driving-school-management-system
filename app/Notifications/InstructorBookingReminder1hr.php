<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstructorBookingReminder1hr extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
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
        $domainPrefix = $this->booking->instructor->tenant->domain_prefix . '.';
        $fullDomain = str_replace('https://', 'https://' . $domainPrefix, config('app.url'));

        return (new MailMessage)
            ->subject('Reminder: Booking with ' . $this->booking->student->name . ' starts in 1 hour!')
            ->line('Your booking with ' . $this->booking->student->name . ' starts in 1 hour!')
            ->line('Course: ' . $this->booking->course->name)
            ->action('View details', $fullDomain . '/instructors/bookings/' . $this->booking->id)
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
