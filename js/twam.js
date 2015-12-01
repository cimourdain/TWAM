window.onload = function()
{
    var canvas = document.getElementById('game');
        if(!canvas)
        {
            alert("Impossible to load canvas");
            return;
        }

    var context = canvas.getContext('2d');
        if(!context)
        {
            alert("Impossible to load canevas context");
            return;
        }
    
    //Display loading screen
    context.font = "120px Economica";
    context.fillStyle = "#113F59"
    context.fillText("LOADING...", 500, 450);
    
    //graph vars
    var all_ticks = [1000];
    var all_ticks_short = [];
    var display_ticks = 52;
    var current_tick = display_ticks+1;

    //game vars
    var level = 1;
    var capital = 1000;
    
    //positions var
    var OpenPositions = []
    var key_list = ['A','B','C','D','E'];
    
    //Set timers
    var fps = setInterval(animate, 1000/30);
    var update_graph = setInterval(update_graph, 700);
    var update_score = setInterval(update_score, 1000);
    
    //preload header images
    var header_img = new Image();
    header_img.src = "assets/header.png";
    var board_img = new Image();
    board_img.src = "assets/board.png";
    var white_board_img = new Image();
    white_board_img.src = "assets/white_board.png";
    
    //display header
    header_img.onload = function(){
        context.drawImage(header_img, 0, 0);
    }


    //display score labels
    context.font = "85px Economica";
    context.fillStyle = "#D54F58"
    context.fillText("Level", 25, 820);
    context.fillText(level, 200, 820);
    context.fillText("-", 300, 820);
    context.fillText(capital, 370, 820);
    context.fillText("EUR", 520, 820);
    context.font = "30px Economica";
    context.fillText("Closed Positions: ", 680, 770);
    context.fillText("Capital min/max: ", 680, 800)
    context.fillText("Profit Factor: ", 680, 830);
    context.fillText("0 ", 860, 770);
    context.fillText(capital+"/"+capital, 860, 800)
    context.fillText('N/A', 860, 830);

    //pre-load game ticks
    for (i = 0; i < 5000 ; i++){
        var rand_tick = (Math.floor((Math.random() * 20) + 1) - 10);
        //alert (rand_tick+'/'+all_ticks[all_ticks.length-1]+'/'+i);
        rand_tick += all_ticks[all_ticks.length-1];
        all_ticks.push(rand_tick);
        
    }
    
    function animate()
    {
        /*
        context.beginPath(); //On démarre un nouveau tracé.
        context.arc(100, 100, 50, 0, Math.PI*2); //On trace la courbe délimitant notre forme
        context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
        context.closePath();
        */

    }
    function open_positions()
    {
       
        if (OpenPositions.length * 2  < level){
            var open_new = Math.floor((Math.random() * 5) + 1);
            var pos_key = Math.floor((Math.random() * 5) + 1)-1;
            var pos_nb_lots = Math.floor((Math.random() * level) + 1);
            pos_key = key_list[pos_key];
            if (open_new == 1){
                var position_dir = Math.floor((Math.random() * 2) + 1);
                if (position_dir == 1){
                    var new_pos_dir = 'BUY';
                }
                else{
                    var new_pos_dir = 'SELL';
                }
                var new_position = {
                    'OPEN_TICK': all_ticks[current_tick],
                    'DIR': new_pos_dir,
                    'CHAR': pos_key,
                    'NB_LOTS': pos_nb_lots,
                }
                OpenPositions.push(new_position);
                //alert ('new pos created'+OpenPositions.length)
            }
        }   
        
        
    }
    function update_graph()
    {
        current_tick += 1;
        open_positions();
        //context.drawImage(white_board_img, 7, 140);
        context.clearRect(7, 140, 1600, 600);
        context.drawImage(board_img, 7, 140);
        //create list with the last tick values
        all_ticks_short = all_ticks.slice(current_tick-display_ticks,current_tick);
        
        //get min/max and range of the last 27th (to calculate points positions)
        var tick_max = Math.max.apply(Math, all_ticks_short);
        var tick_min = Math.min.apply(Math, all_ticks_short);
        var range = tick_max - tick_min;
        
        //define graph color
        context.fillStyle = "#cc9900"
        
        //parse all ticks and display them on graph
        for (i = 0 ; i < all_ticks_short.length; i++) {
            //alert (all_ticks_short[i]+'/'+i);
            //y positions between 127px  and 447px from the top
            var tick_pos_y =  670 + (470/range)*(tick_min - all_ticks_short[i]);
            //x position: each tick separated by 25px (begin at 30px from left)
            var tick_pos_x = 45 + (25* i);

            context.beginPath(); //On démarre un nouveau tracé.
            context.arc(tick_pos_x, tick_pos_y, 6, 0, Math.PI*2); //On trace la courbe délimitant notre forme
            context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
            context.closePath();
 
            //draw a line between this tick and the previous one
            if (i !== 0){
                context.beginPath();
                context.strokeStyle = '#cc9900';
                context.moveTo(prev_tick_pos_x, prev_tick_pos_y);
                context.lineWidth = 2;
                context.lineTo(tick_pos_x, tick_pos_y);
                context.stroke();
                context.closePath();
            }
            
            //keep in memory this tick position
            var prev_tick_pos_y = tick_pos_y;
            var prev_tick_pos_x = tick_pos_x;
            
            //display current tick
            if (i == display_ticks-1){
                //current tick background
                context.fillStyle = "#113F59";
                context.fillRect(1350, (tick_pos_y -10), 45, 27);
                
                //update current tick label
                context.font = "20px Economica";
                context.fillStyle = "#fff"
                context.fillText(all_ticks_short[i], 1353, (tick_pos_y +10));
                

                }
            

            }//end for
            /*
            DISPLAY POSITIONS
            */
            //for every position, display it on the graph
            for (i = 0 ; i < OpenPositions.length; i++){
                //calculate position line position
                var pos_y =  670 + (470/range)*(tick_min - OpenPositions[i]['OPEN_TICK']);
                if (pos_y > 670){
                    pos_y = 672;
                }
                else if (pos_y < 150){
                    pos_y = 150 ;
                }
                
                context.beginPath();
                if (OpenPositions[i]['DIR'] == 'BUY'){
                    context.strokeStyle = '#33CC00';
                    context.fillStyle = "#33CC00"
                }
                else if (OpenPositions[i]['DIR'] == 'SELL'){
                    context.strokeStyle = '#d54f58';
                    context.fillStyle = "#d54f58"
                }
                
                //draw line
                context.moveTo(25, pos_y);
                context.lineWidth = 2;
                context.lineTo(1330, pos_y);
                context.stroke();
                context.closePath();
                
                //draw leverage detail bubble
                context.beginPath(); //On démarre un nouveau tracé.
                context.arc(1200, pos_y, 12, 0, Math.PI*2); //On trace la courbe délimitant notre forme
                context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
                context.closePath();
                
                //draw leverage detail bubble
                context.beginPath(); //On démarre un nouveau tracé.
                context.arc(1300, pos_y, 12, 0, Math.PI*2); //On trace la courbe délimitant notre forme
                context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
                context.closePath();
                
                //draw Square
                //current tick background
                context.fillRect(1350, pos_y-10, 45, 27);
                
                //update current tick label
                context.font = "20px Economica";
                context.fillStyle = "#fff"
                context.fillText(OpenPositions[i]['OPEN_TICK'], 1353, (pos_y +10));
                
                //add text on bubbles
                context.font = "22px Economica";
                context.fillStyle = "#000"
                context.fillText(OpenPositions[i]['NB_LOTS'], 1195, pos_y+7);
                context.fillText(OpenPositions[i]['CHAR'], 1295, pos_y+7);
                
                /*
                //get line color and gain potentiel depending of the position direction BUY/SELL
                //var gain_potentiel = getResult(OpenPositions[i]['DIR'], OpenPositions[i]['OPEN_TICK'], OpenPositions[i]['NB_LOTS']);


                //Draw position line
                g.lineStyle(2, line_color, 1);  
                g.moveTo(18, pos_y);
                g.lineTo(690, pos_y);
                //Display position open & gain potentiel
                game.add.text(707, pos_y-12, OpenPositions[i]['OPEN_TICK'] + '('+gain_potentiel+')',  { font: "15px Montserrat", fill: '#000', backgroundColor: lib_color});

                //draw circles on line to display NB_LOT and closing key
                g.beginFill(line_color, 1);
                g.drawCircle(590, pos_y, 23);
                game.add.text(587, pos_y-7, OpenPositions[i]['CHAR'],  { font: "10px Montserrat", fill: '#000' , backgroundColor: lib_color} );
                g.drawCircle(660, pos_y, 23);
                game.add.text(658, pos_y-7, OpenPositions[i]['NB_LOTS'],  { font: "10px Montserrat", fill: '#000' , backgroundColor: lib_color} );
                */
            }
    }
    function update_score()
    {
        level += 1;
        capital += 1;
        //clear level value
        context.clearRect(200, 740, 100, 100);
        //clear capital value
        context.clearRect(370, 740, 150, 100);
        context.font = "85px Economica";
        context.fillStyle = "#D54F58"
        context.fillText(level, 200, 820);
        context.fillText(capital, 370, 820);

    }

}