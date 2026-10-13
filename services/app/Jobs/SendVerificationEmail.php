<?php

namespace App\Jobs;

use App\Mail\VerificationEmail;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendVerificationEmail implements ShouldQueue
{
    use Queueable;
    public function __construct(
        protected User $user,
        protected string $url
    ) {}

    public function handle(MailService $mailService): void
    {
        $mailService->send(
            $this->user->email, 
            new VerificationEmail($this->user, $this->url)
        );
    }
}
