<?php
if (isset($_GET['name']) && isset($_GET['score']) && isset($_GET['PF']) && isset($_GET['nb_trades'])){
    $fscores = file_get_contents("./scores.json");
    
    $scores = json_decode($fscores, true);
    echo '------A<br />';
    echo $scores['scores'][0]['score'];
    echo '<br />------B<br />';
    $new = array(
        "name" => $_GET['name'],
        "score" => $_GET['score'],
        "PF" => $_GET['PF'],
        "nb_trades" => $_GET['nb_trades'],
        "date" => date('d-m-Y'),
    );
    array_push($scores['scores'],$new);
    print_r($scores['scores']);
    
    file_put_contents("./scores.json", json_encode($scores));
}
else{
    
    echo 'Missing values';
}
?>