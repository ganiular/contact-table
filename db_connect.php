<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "contact";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname) or die("Databse Connection failed: %s\n". $conn -> error);
?>