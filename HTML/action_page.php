<?php

if (isset($_POST['email'])) {
	$email = $_POST['email'];

	// show $email
	echo "Verification code sent to $email.";
} else {
	echo 'You need to provide your email address.';
}