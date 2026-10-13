<!DOCTYPE html>
<html>
<head>
    <title>Account Verification</title>
</head>
<body>
    <h1>Hello {{ $user->name }}!</h1>
    <p>Thank you for registering with us.</p>
    <p>Please verify your email address by clicking the button below:</p>
    <p>
        <a href="{{ $url }}" style="display: inline-block; padding: 10px 20px; background-color: #3490dc; color: #fff; text-decoration: none; border-radius: 4px;">
            Verify Email
        </a>
    </p>
    <p>If you did not create an account, no further action is required.</p>
    <p>Regards,<br/>The Team</p>
</body>
</html>