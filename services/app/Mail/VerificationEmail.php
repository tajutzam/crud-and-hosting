<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected User $user;
    protected string $url;

    public function __construct(User $user, $url) {
        $this->user = $user;
        $this->url = $url;
    }

    public function content(): Content
    {
        return new Content(
            view: 'templates.email.account-verification',
            with: [
                'user' => $this->user,
                'url' => $this->url,
            ],
        );
    }
}
