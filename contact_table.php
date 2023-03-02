<?php
include 'db_connect.php';

if($_SERVER['REQUEST_METHOD'] == "POST"){
    if(isset($_GET['delete'])){
        $rowId = $_GET['delete'];
        $sql = "DELETE FROM contact WHERE id=$rowId";
        $data = new stdClass();
        $data->success = $conn->query($sql);
        echo json_encode($data);
        exit();
    }
    $name =  $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    if(isset($_GET['edit'])){
        $rowId = $_GET['edit'];
        $sql = "UPDATE contact SET name='$name', email='$email', phone='$phone' WHERE id=$rowId";
    }else{
        $sql = "INSERT INTO contact(name, phone, email)
            VALUES('$name', '$phone', '$email')";
    }
    
    if($conn->query($sql) === TRUE){
        header("Location: index.html", true, 301);
    }else{
        echo "Error:" . $conn->error;
    }

    /* as for application/json Content-Type */
    // $json = file_get_contents('php://input');
    // $post = json_decode($json);
    // $name =  $post->name;
    // $phone = $post->phone;
    // $email = $post->email;

    // $data = new stdClass();
    // if($conn->query($sql) === TRUE){
    //     $data->success = TRUE;
    //     $data->id = $conn->insert_id;
    // }else{
    //     $data->success = FALSE;
    // }
    // echo json_encode($data);
}else{
    $sql = "SELECT * FROM contact";
    $result = $conn->query($sql);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
}
$conn->close();
?>
