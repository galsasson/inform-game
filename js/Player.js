var MAX_SPEED = 0.2;
var MAX_ROT_SPEED = 0.15;

Player = function(x, y)
{
	this.pos = new THREE.Vector3(x, y, 0);
	this.vel = new THREE.Vector3();
	this.acc = new THREE.Vector3();
	this.rotation = 0;
	this.rotSpeed = 0;
	this.rotAcc = 0;

	this.bRiding = false;
	this.target = null;
	this.bShooting = false;
}

Player.prototype.update = function(keyPressed)
{
	this.handleKeys(keyPressed);

	if (this.bRiding) {
		this.pos.set(this.target.pos.x, this.target.pos.y, this.target.pos.z);
	}

	this.vel.add(this.acc);
	if (this.vel.length() > MAX_SPEED) {
		this.vel.setLength(MAX_SPEED);
	}

	this.pos.add(this.vel);
	// fake friction
	this.vel.multiplyScalar(0.7);

	this.rotSpeed += this.rotAcc;
	if (this.rotSpeed > MAX_ROT_SPEED) {
		this.rotSpeed = MAX_ROT_SPEED;
	}
	this.rotation += this.rotSpeed;
	this.rotSpeed *= 0.7;

	this.acc.set(0, 0, 0);
	this.rotAcc = 0;	
}

Player.prototype.attachTarget = function(target)
{
	this.target = target;
	this.bRiding = true;
}

Player.prototype.releaseTarget = function()
{
	this.target = null;
	this.bRiding = false;
}

Player.prototype.handleKeys = function(keyPressed)
{
    if (keyPressed[38]) {
    	// UP
    	if (this.bRiding) {
        	this.releaseTarget();
        }
        this.propel(0.2);
    }
    else if (keyPressed[40]) {
    	// DOWN
    	if (this.bRiding) {
        	this.releaseTarget();
        }
        this.propel(-0.2);
    }
    if (keyPressed[37]) {
    	// LEFT
        this.turn(0.01);
    }
    else if (keyPressed[39]) {
    	// RIGHT
        this.turn(-0.01);
    }

    // if (keyPressed[32]) {		// space
    // 	if (!this.bShooting) {
    // 		// start wave chanrging
    // 	}
    // 	else {
    // 		// release bullet
    // 	}
    // }
}

Player.prototype.propel = function(amount)
{
	this.acc.set(amount * Math.sin(this.rotation), amount * Math.cos(this.rotation), 0);
}

Player.prototype.turn = function(amount)
{
	this.rotAcc = amount;
}

Player.prototype.move = function(x, y)
{
	this.acc.set(x, y, 0);
}

Player.prototype.releaseBullet = function()
{
    return new Bullet(this.pos.x, this.pos.y, this.rotation);
}

