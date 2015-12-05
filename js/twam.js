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
    var game_mode = 'play';
    var level = 1;
    var initial_capital = 100;
    var capital = initial_capital;
    var capital_max = initial_capital;
    var capital_min = initial_capital;
    var profit_factor = 0;
    
    //positions var
    var OpenPositions = [];
    var key_list = ['A','B','C','D','E'];
    var ClosedPositions = [];
    
    //Set timers
    var game_over = setInterval(game_over, 1000/30);
    var update_graph = setInterval(update_graph, 1000);
    var update_score = setInterval(update_score, 1000);
    var open_positions = setInterval(open_positions, 2000);
    
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
    //context.fillText("0 ", 860, 770);
    //context.fillText(capital_min+"/"+capital_max, 860, 800)
    //context.fillText(profit_factor, 860, 830);  
    
    window.addEventListener('click', ClickAnalyser, false);
    
    init_graph();
    
    function init_graph(){
        //pre-load game ticks
        for (i = 0; i < 5000 ; i++){
            var rand_tick = (Math.floor((Math.random() * 20) + 1) - 10);
            //alert (rand_tick+'/'+all_ticks[all_ticks.length-1]+'/'+i);
            rand_tick += all_ticks[all_ticks.length-1];
            all_ticks.push(rand_tick);

        }
    }
    
    function game_over()
    {
        if (game_mode == 'game_over'){
            context.clearRect(7, 140, 1700, 600);
            //Display Game Over screen
            context.font = "120px Economica";
            context.fillStyle = "#113F59"
            context.fillText("GAME OVER", 500, 450);
            
            //current tick background
            context.fillStyle = "#113F59";
            context.fillRect(550, 500, 350, 100);//1350

            //update current tick label
            context.font = "80px Economica";
            context.fillStyle = "#fff"
            context.fillText("RESTART", 610, 580);
        }
    }
    function restart(){
        
        //reset game_vars
        level = 1;
        capital = initial_capital;
        capital_max = initial_capital;
        capital_min = initial_capital;
        profit_factor = 0;
        
        //positions var
        OpenPositions = [];
        key_list = ['A','B','C','D','E'];
        ClosedPositions = [];
        all_ticks = [1000];
        
        init_graph();
        
        game_mode = 'play';
        
    }
    function open_positions()
    {
     if (game_mode=='play' && current_tick > (display_ticks + 5)){  
        if (OpenPositions.length * 2  < level && OpenPositions.length < 5){
            var open_new = Math.floor((Math.random() * 5) + 1);
            var pos_key = Math.floor((Math.random() * key_list.length) + 1)-1;
            var pos_nb_lots = Math.floor((Math.random() * level) + 1);
            var new_key = key_list[pos_key];
            if (open_new == 1){
                var position_dir = Math.floor((Math.random() * 2) + 1);
                if (position_dir == 1){
                    var new_pos_dir = 'BUY';
                    var open = all_ticks[current_tick] + 0.5;
                }
                else{
                    var new_pos_dir = 'SELL';
                    var open = all_ticks[current_tick] - 0.5;
                }
                var new_position = {
                    'OPEN_TICK': all_ticks[current_tick],
                    'OPEN': open,
                    'DIR': new_pos_dir,
                    'CHAR': new_key,
                    'NB_LOTS': pos_nb_lots,
                }
                OpenPositions.push(new_position);
                key_list.splice(pos_key,1);
                //alert ('new pos opened'+all_ticks[current_tick])

            }
        }   
        
     }
    }
    function update_graph()
    {
    if (game_mode=='play'){
        current_tick += 1;
        //open_positions();
        //context.drawImage(white_board_img, 7, 140);
        context.clearRect(7, 140, 1700, 600);
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
                context.fillRect(1350, (tick_pos_y -10), 45, 27);//1350
                
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
                else if (pos_y < 175){
                    pos_y = 175 ;
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
                context.moveTo(28, pos_y);
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
                context.fillRect(1350, pos_y-10, 90, 27);
                
                //update current tick label
                var gain_potentiel = getResult(OpenPositions[i]['DIR'], OpenPositions[i]['OPEN'], OpenPositions[i]['NB_LOTS']);
                context.font = "20px Economica";
                context.fillStyle = "#fff"
                context.fillText(OpenPositions[i]['OPEN_TICK'] +' ('+gain_potentiel+')', 1353, (pos_y +10));
                
                //add text on bubbles
                context.font = "22px Economica";
                context.fillStyle = "#000"
                context.fillText(OpenPositions[i]['NB_LOTS'], 1195, pos_y+7);
                context.fillText(OpenPositions[i]['CHAR'], 1295, pos_y+7);

                //draw Button to close position
                context.shadowColor = "black";
                context.shadowBlur = 10;
                context.shadowOffsetX = 5;
                context.fillStyle = "#20D6C7";
                context.beginPath(); //On démarre un nouveau tracé.
                context.arc(1500, 270+(80*i), 30, 0, Math.PI*2);//On trace la courbe délimitant notre forme
                context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
                context.closePath();
                context.shadowBlur = 0;
                context.shadowOffsetX = 0;    
                
                //add label to button
                context.font = "42px Economica";
                context.fillStyle = "#000"
                context.fillText(OpenPositions[i]['CHAR'], 1490, 282+(80*i));

            }
    }//end game_mode check
    }
    
    function ClickAnalyser(event){
      //alert("1 - "+event);
      x = event.pageX - canvas.offsetLeft;
      y = event.pageY - canvas.offsetTop;
      //alert("2 - x:"+x+" /y:"+y);
      if(game_mode=='play'){
          if (x>=1500 && x<=1580){
              for (i = 0 ; i < OpenPositions.length; i++){
                if (y>(250+(70*i)) && y<(320+(70*i))) {
                    //alert("Close Position n°"+i);
                    ClosePosition(i);
                }
              }
          }
      }
      if (game_mode == 'game_over'){
          if (x>=600 && x<=950 && y>=515 && y<=620){
             restart();   
          }
      }
    
    }
    
    function ClosePosition(pos_id){
        var position_rst = getResult(OpenPositions[pos_id]['DIR'], OpenPositions[pos_id]['OPEN'], OpenPositions[pos_id]['NB_LOTS']);
        //add closed position to list of closed positions
        var closed_pos = {
            'OPEN_TICK': OpenPositions[pos_id]['OPEN_TICK'],
            'DIR': OpenPositions[pos_id]['DIR'],
            'CHAR': OpenPositions[pos_id]['CHAR'],
            'NB_LOTS': OpenPositions[pos_id]['NB_LOTS'],
            'CLOSE_TICK': all_ticks[current_tick],
            'RST':position_rst,
        }
        key_list.push(OpenPositions[pos_id]['CHAR']);     
        ClosedPositions.push(closed_pos);//add to closed positions
        OpenPositions.splice(pos_id, 1);//remove position from list of open positions
                
        update_graph();
        update_score();   
        
    }
    
    function getResult(dir, open, nblots) 
    {
        if (dir == 'BUY'){
            return ((all_ticks[current_tick-1] - 0.5) - open) * nblots;
        }
        else if (dir == 'SELL'){
            return (open - (all_ticks[current_tick-1] + 0.5) ) * nblots;
            //return all_ticks[last_tick]
        }  
    }
    
    function getAllResult() 
    {
        var ongoing_rst = 0;
        for (i = 0; i < OpenPositions.length; i ++){
            ongoing_rst += getResult(OpenPositions[i]['DIR'], OpenPositions[i]['OPEN'], OpenPositions[i]['NB_LOTS']);
        }
        return ongoing_rst;
    }
    
    function update_score()
    {
        //get capital, capital max /min
        capital = initial_capital;
        capital_max = initial_capital;
        capital_min = initial_capital;
        var sum_gains = 0;
        var sum_losses = 0;
        
        
        for (i = 0; i < ClosedPositions.length; i ++){
            capital += ClosedPositions[i]['RST'];
            if (capital > capital_max){
                capital_max = capital;
            }
            if (capital < capital_min){
                capital_min = capital;
            }
            if (ClosedPositions[i]['RST'] >= 0){
                sum_gains += ClosedPositions[i]['RST'];
            }
            else{
                sum_losses += Math.abs(ClosedPositions[i]['RST']);
            }
        }
        
        //calculate profit factor
        if (sum_losses > 0){
            profit_factor = Math.round(sum_gains/sum_losses*100)/100;
        }
        
        //calculate level
        level = Math.floor(((capital_max - initial_capital) / 50),0)+1;
        
        //define score font size and color
        context.font = "83px Economica";
        context.fillStyle = "#D54F58"
        
        //clear & update level value
        context.clearRect(200, 740, 70, 100);
        context.fillText(level, 200, 820);
        
        //clear & update capital value
        context.clearRect(370, 740, 150, 100);
        context.fillText(capital, 370, 820);
        
        context.font = "30px Economica";
        context.clearRect(850, 740, 300, 300);
        context.fillText(ClosedPositions.length, 860, 770);
        context.fillText(capital_min+"/"+capital_max, 860, 800)
        context.fillText(profit_factor, 860, 830);  

        if  (OpenPositions.length > 0){
            var ongoing_score = getAllResult(); 
            if (capital + getAllResult() <= 0){
                game_mode = 'game_over';
            }
        }
    }
    

}