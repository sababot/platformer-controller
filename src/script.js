var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
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
let jumpBot = 0;
let bullet_index = 0;
let mouse_pos = null;
let angle = null;
let angleBot = null;
var shoot = false;

canvas.addEventListener("mousemove", e => {

    mouse_pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.onmousedown = function(e){
    shoot = true;
    bullet_index = 35;

    mouseIsDown = true;
}
canvas.onmouseup = function(e){
    shoot = false;
}

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

class CannonBall {
    constructor(angle, x, y) {
        this.radius = 5;
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * 15;
        this.dy = Math.sin(angle) * 15;
        this.gravity = 0.05;
    }

    move() {  
        this.x += this.dx; 
        this.y += this.dy; 
    }

    draw() {
        //Set next offsets to normal offsets
        c.fillStyle = "black";
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
    }
}

var cannonBalls = [];

/*
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
*/

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
        c.rect(this.x, this.y, 40, 40);
        if (this.infected){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#ff5961";
        }

        c.fill();

        // Movement
        if (left == true && this.x > 1){
            playerVariable.dx = -5;
        }

        else if (right == true && this.x < window.innerWidth - 41){
            playerVariable.dx = 5;
        }

        else{
            playerVariable.dx = 0;
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
        if (this.y < window.innerHeight - 100 - 40 && this.move_y_down == true){
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

        if (this.y > window.innerHeight - 100 - 40){
            this.y = window.innerHeight - 99 - 40;
        }

        // Shooting
        if (mouse_pos){
            angle = Math.atan2(mouse_pos.y - (this.y - 20), mouse_pos.x - (this.x + 20));

            //c.translate((this.x + 20), (this.y - 20));
            //c.rotate(angle);
            //c.translate(-(this.x + 20), -(this.y - 20));
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

var playerVariable = new Player(canvas.width / 2, canvas.height / 2);

function Bot(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.infected = infected;
    this.vel = 1;
    this.jump_vel = 10;
    this.randomNum = 0;
    this.time = Math.random() * 3;
    this.moveTime = 20;
    this.health = 100;

    this.draw = function(){
        // Graphics
        c.beginPath();
        c.rect(this.x, this.y, 40, 40);
        if (this.health > 0){
            c.fillStyle = "#ff5961";
        }
        else{
            c.fillStyle = "black";
        }

        c.fill();

        // Movement
        if (this.moveTime > 0){
            this.moveTime -= 1;
        }
        else{
            this.moveTime = Math.floor(Math.random() * 50);

            if (Math.floor(Math.random() * 2) == 0){
                this.dx = Math.random() * 5;
            }
            else{
                this.dx = Math.random() * -5;
            }
        }

        this.randomNum = Math.floor(Math.random() * 50);

        if (this.randomNum == 25){
            jumpBot = 20;
            this.jump_vel = 12.5;
        }

        // Jump
        if (jumpBot > 0){
            if (this.jump_vel >= 0){
                this.jump_vel -= 0.5;
            }
            this.y -= this.jump_vel;
            jumpBot -= 1;
        }
        else{
            bot1.dy = 0;
        }

        // Gravity
        if (this.y < window.innerHeight - 100 - 40){
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

        if (this.y > window.innerHeight - 100 - 40){
            this.y = window.innerHeight - 99 - 40;
        }

        // Shooting
        angleBot = Math.atan2(playerVariable.y - (this.y - 20), playerVariable.x - (this.x + 20));

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

var bot1 = new Bot(canvas.width / 2, canvas.height / 2);

cannonBalls.push(new CannonBall(angle, playerVariable.x, playerVariable.y));

function aim(e){
    if(e.keyCode == 37 || e.keyCode == 65){
        left = true;
    }

    if(e.keyCode == 39 || e.keyCode == 68){
        right = true;
    }

    if(e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32){
        up = true;
    }

    if(e.keyCode == 40 || e.keyCode == 83){
        down = true;
    }
}

function aim2(e){
    if((e.keyCode == 37 && left == true) || (e.keyCode == 65 && left == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        left = false;
    }

    if((e.keyCode == 39 && right == true) || (e.keyCode == 68 && right == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        right = false;
    }

    if((e.keyCode == 38 && up == true) || (e.keyCode == 87 && up == true) || (e.keyCode == 32 && up == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        up = false;
    }

    if((e.keyCode == 40 && down == true) || (e.keyCode == 83 && down == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        down = false
    }
}

function collision(){
    for (i = 0; i < cannonBalls.length; i++){
        if ((cannonBalls[i].x > bot1.x && cannonBalls[i].x < bot1.x + 40) && (cannonBalls[i].y > bot1.y && cannonBalls[i].y < bot1.y + 40)){
            bot1.health -= 10;
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }

    if (bullet_index % 35 == 0 && shoot){
        cannonBalls.push(new CannonBall(angle, playerVariable.x + 20, playerVariable.y + 20));
    }
    bullet_index += 1;

    for (i = 0; i < cannonBalls.length; i++){
        cannonBalls[i].draw();
        cannonBalls[i].move();
    }

    c.beginPath();
    c.rect(0, window.innerHeight - 99, window.innerWidth - 1, 100);
    c.fillStyle = "#75beff";
    c.fill();

    collision();

    playerVariable.draw();
    bot1.draw()
    c.restore();
}

animate();