var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

let g = 0;
let f = 1;
let health = 100;
let bulletCount = 0;
var left = false;
var right = false;
var up = false;
var down = false;

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

function Player(x, y){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;

    this.draw = async function(){
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.fillStyle = "#ff5961";
        c.fill();

        this.x += this.dx;
        this.y += this.dy;
    }
}

for (var i = 0; i < 30; i++){
    var r = 15;
    var x = Math.random() * (canvas.width - r * 2) + r;
    var y = Math.random() * (canvas.height - r * 2) + r;
    var dx = (Math.random() - 0.5) * 5;
    var dy = (Math.random() - 0.5) * 5;
    particleArray.push(new Particle(x, y, dx, dy, true, false));
}

var playerVariable = new Player(canvas.width / 2, canvas.height / 2);

function aim(e){
    if(e.keyCode == 37){
        playerVariable.dx = -3;
        playerVariable.dy = 0;
        left = true;
        right = false;
        up = false;
        down = false;
    }

    if(e.keyCode == 39){
        playerVariable.dx = 3;
        playerVariable.dy = 0;
        left = false;
        right = true;
        up = false;
        down = false;
    }

    if(e.keyCode == 38){
        playerVariable.dx = 0;
        playerVariable.dy = -3;
        left = false;
        right = false;
        up = true;
        down = false;
    }

    if(e.keyCode == 40){
        playerVariable.dx = 0;
        playerVariable.dy = 3;
        left = false;
        right = false;
        up = false;
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

particleArray[0].infected = true;

var circleIntersect = function(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

function collide(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].colliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < particleArray.length; i++)
    {
        obj1 = particleArray[i];

        for (let j = i + 1; j < particleArray.length; j++)
        {
            obj2 = particleArray[j];

            // Compare object1 with object2
            var dist = circleIntersect(obj1.x, obj1.y, obj1.r, obj2.x, obj2.y, obj2.r);
            if (dist === true){
                obj1.colliding = true;
                obj2.colliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0){
                    break;
                }

                obj1.dx -= (speed * vCollisionNorm.x);
                obj1.dy -= (speed * vCollisionNorm.y);
                obj2.dx += (speed * vCollisionNorm.x);
                obj2.dy += (speed * vCollisionNorm.y);

                if (obj1.infected == true || obj2.infected == true){
                    obj1.infected = true;
                    obj2.infected = true;
                }
            }
        }
    }

    for (let i = 0; i < particleArray.length; i++)
    {
        obj1 = particleArray[i];

        obj2 = playerVariable;

            // Compare object1 with object2
            var dist = circleIntersect(obj1.x, obj1.y, obj1.r, obj2.x, obj2.y, obj2.r);
            if (dist === true){
                obj1.colliding = true;
                obj2.colliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0){
                    break;
                }

                obj1.dx -= (speed * vCollisionNorm.x);
                obj1.dy -= (speed * vCollisionNorm.y);
                //obj2.dx += (speed * vCollisionNorm.x);
                //obj2.dy += (speed * vCollisionNorm.y);
            }
    }
}

function help(){
    c.font = "20px monospace";
    c.fillStyle = "red";
    c.fillText("health: " + health, 25, 35);
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    collide();
    for (i = 0; i < particleArray.length; i++){
        particleArray[i].update();
    }

    playerVariable.draw();

    help();
}

animate();