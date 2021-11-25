var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

// Variables
let g = 0;
let f = 1;
let bulletCount = 0;
var left = false;
var right = false;
var up = false;
var down = false;
let jump = 0;

function Particle(x, y, dx, dy, collision, infected){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.collision = collision
    this.infected = infected;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        if (this.infected){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#c842f5";
        }
        c.fill();
        c.stroke();
    }

    this.update = function(){
        if (this.collision == true){
            if(this.x + this.r > canvas.height || this.x - this.r < 0){
                this.dx = -(this.dx *= f);
            }

            if(this.y + this.r > canvas.width || this.y - this.r < 0){
                this.dy = -(this.dy *= f);
            }

            // gravity
            if(this.y < canvas.height - this.r){
                this.dy += g;
            }

            if (this.y > canvas.height - this.r){
                this.y = canvas.height - this.r;
            }

            if (this.y == canvas.height - this.r && g == 0){
                this.dx *= 0.9;
            }
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

var particleArray = [];

function box(x, y, height, width, fill_style){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.fill_style = fill_style;

    this.draw = function(){
        c.beginPath();
        c.rect(this.x, this.y, width, height);
        c.fillStyle = this.fill_style;
        c.fill();
    }
}

function Player(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.infected = infected;
    this.vel = 1;
    this.jump_vel = 10;
    this.colliding = false;
    this.move_x_left = true;
    this.move_x_right = true;
    this.move_y_up = true;
    this.move_y_down = true;

    this.draw = function(){
        // Graphics
        c.beginPath();
        c.rect(this.x, this.y, 20, 20);
        if (this.infected){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#ff5961";
        }

        c.fill();

        // Movement
        if (left == true){
            playerVariable.dx = -5;
        }

        if (right == true){
            playerVariable.dx = 5;
        }

        if (up == true && this.colliding == true){
            jump = 20;
            jump_vel = 12.5;
        }

        // Jump
        if (jump > 0){
            if (jump_vel >= 0){
                jump_vel -= 0.5;
            }
            this.y -= jump_vel;
            jump -= 1;
        }
        else{
            playerVariable.dy = 0;
        }

        // Gravity
        if (this.y < window.innerHeight - 50 - 20 && this.move_y_down == true){
            if (this.vel < 10){
                this.vel *= 1.075;
            }

            this.y += this.vel;

            this.colliding = false;
        }
        else{
            this.vel = 1;
            this.colliding = true;
        }

        if (this.y > window.innerHeight - 50 - 20){
            this.y = window.innerHeight - 49 - 20;
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

var playerVariable = new Player(canvas.width / 2, canvas.height / 2);

function aim(e){
    if(e.keyCode == 37){
        left = true;
    }

    if(e.keyCode == 39){
        right = true;
    }

    if(e.keyCode == 38){
        up = true;
    }

    if(e.keyCode == 40){
        down = true;
    }
}

function aim2(e){
    if(e.keyCode == 37 && left == true){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        left = false;
    }

    if(e.keyCode == 39 && right == true){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        right = false;
    }

    if(e.keyCode == 38 && up == true){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        up = false;
    }

    if(e.keyCode == 40 && down == true){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        down = false
    }
}

var boxes = [];

boxes.push(new box(300, 700, 10, 100, "brown"));
boxes.push(new box(500, 650, 10, 100, "brown"));
boxes.push(new box(300, 550, 10, 100, "brown"));
boxes.push(new box(150, 500, 10, 100, "brown"));



function collision(){
    for (i = 0; i < boxes.length; i++){
        if ((playerVariable.y + 20 > boxes[i].y && playerVariable.y < boxes[i].y + boxes[i].height) && (playerVariable.x > boxes[i].x && playerVariable.x < boxes[i].x + boxes[i].width)){
            playerVariable.move_y_down = false;
            playerVariable.y = boxes[i].y - 20;
            return;
        }
    }

    playerVariable.move_y_down = true;
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }

    for (i = 0; i < boxes.length; i++){
        boxes[i].draw();
    }

    c.beginPath();
    c.rect(0, window.innerHeight - 49, window.innerWidth - 1, 50);
    c.fillStyle = "#75beff";
    c.fill();

    collision();

    playerVariable.draw();
}

animate();