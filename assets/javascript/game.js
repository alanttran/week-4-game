$(document).ready(function() {
    console.log("ready!"); //ready check

    var obiwon = {
        name: "Obi-Wan Kenobi",
        id: 'obiwon',
        picture: "assets/images/obiwon.png",
        hitPoints: 170,
        attackPower: 10,
        boostAttackPower: 10,
        counterAttackPower: 25
    }

    var luke = {
        name: "Luke Skywalker",
        id: 'luke',
        picture: "assets/images/luke.png",
        hitPoints: 160,
        attackPower: 12,
        boostAttackPower: 12,
        counterAttackPower: 23
    }

    var vader = {
        name: "Darth Vader",
        id: 'vader',
        picture: "assets/images/vader.png",
        hitPoints: 180,
        attackPower: 11,
        boostAttackPower: 11,
        counterAttackPower: 22
    }

    var maul = {
        name: "Darth Maul",
        id: 'maul',
        picture: "assets/images/maul.png",
        hitPoints: 150,
        attackPower: 13,
        boostAttackPower: 13,
        counterAttackPower: 23
    }

    var playerArray = [obiwon, luke, vader, maul];
    var enemyArray = [];
    var enemyRemaining = [];

    var playerChoice = {id:null};
    var enemyChoice = null;

    // initiate the game
    

    // html template
    const characterContainer = ({ name, src, id, hp }) => `
      <div id="${id}" class="character-container">
        <h4>${name}</h4>
        <img class = "character-image" src="${src}" alt="${id}">
        <h4>${hp}</h4>
        </div>
    `;

    loadCharacters($('.player-choice-container'), playerArray);

    function loadCharacters(target, array) {

        $.each(array, function(i, val) {
            addCharacter(target, val);
        });
    }

    function replaceCharacters(target, array){

        target.html("");
        $.each(array, function(i, val) {
            
            addCharacter(target, val);
        });
    }

    function addCharacter(target, character){

        target.append([
            { name: character.name, src: character.picture, id: character.id, hp: character.hitPoints }
            ].map(characterContainer).join(''));
    }

    $('.player-choice-container .character-container').on('click', function() {
        var characterClickId = $(this).attr('id');

        if (characterClickId != playerChoice.id) {
            // change playerArray to single character
            // and push the rest into the enemyArray
            $.each(playerArray, function(i, val) {
                if (characterClickId === val.id) {
                    playerArray = [val];
                    playerChoice = val;
                } else {
                    enemyArray.push(val);
                }
            });

            console.log(enemyArray);

            // replace playerArray with just that one character
            replaceCharacters( $('.player-choice-container'), playerArray);

            // insert the enemy characters into a different container
            loadCharacters($('.enemy-container'), enemyArray);

        }
    });

    $('.enemy-container ').on('click', ".character-container", function() {
        var characterClickId = $(this).attr('id');
        console.log("enemy click");

        // if enemy has not been chosen or is empty
        if (enemyChoice === null) {
            
            // loop enemy array to find match
            $.each(enemyArray, function(i, val) {
                if (characterClickId === val.id) {
                    // add character to 
                    addCharacter($('.enemy-choice-container'), val);
                    enemyChoice = val;
                }
                else{
                    enemyRemaining.push(val);
                }
            });
            enemyArray = enemyRemaining;
            replaceCharacters($('.enemy-container'), enemyRemaining);
            $('#attack-button').show();
        }
    });

    $('#attack-button').on('click', function(){

        var enemy =  $("#"+enemyChoice.id);
        var player = $("#"+playerChoice.id);
        var playerDamage = playerChoice.boostAttackPower;
        var enemyDamage = enemyChoice.counterAttackPower;

        // player attacks, enemy is hit
        enemyChoice.hitPoints -= playerChoice.boostAttackPower;
        console.log(enemy);
        enemy.effect("shake");
        $('.player-hit-damage').html(enemyDamage).show().effect("bounce").fadeOut();

        // player gets attack boost
        playerChoice.boostAttackPower += playerChoice.attackPower; 

        console.log(enemyChoice.hitPoints);

        // if enemy is still alive 
        if(enemyChoice.hitPoints > 0){
            // enemy hits back and updates in HTML
            playerChoice.hitPoints -= enemyChoice.counterAttackPower;
            $('.enemy-hit-damage').html(playerDamage).show().effect("bounce").fadeOut();
            //setTimeout(player.effect("pulsate"), 1000);
            $('.enemy-choice-container').html("");
            addCharacter( $('.enemy-choice-container'), enemyChoice);

                if(playerChoice.hitPoints < 1){
                // if player loses
                player.fadeOut();
                $('.modal-title').append("You Lose!");
                $('.modal-body').append("<img src='" + enemyChoice.picture + "' alt='winner'>");
                $('#myModal').modal(); 
            }
        }
        
        else{
            // otherwise, enemy is gone
            enemy.fadeOut();
            // enemy choice is null to be set again
            enemyChoice=null;

            // attack button hide
            $('#attack-button').hide();

            if(enemyArray.length === 0){
                $('.modal-title').append("You won!");
                $('.modal-body').append("<img src='" + playerChoice.picture + "' alt='winner'>");
                $('#myModal').modal();                
            }

            // reset enemyRemaining array for next choice
            enemyRemaining = [];
        }

        // updates player character
        $('.player-choice-container').html("");
        addCharacter( $('.player-choice-container'), playerChoice);
        
    });

    $('#newGame').on('click', function(){
        location.reload();
    })


});
