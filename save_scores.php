<?php
    $new_json = $_GET['new_json'];
    echo file_put_contents("scores.json",$new_json);
?>