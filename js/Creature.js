
var STATE_AT_HOME = 0;
var STATE_TO_TARGET = 1;
var STATE_AT_TARGET = 2;
var STATE_TO_HOME = 3;

Creature = function(x, y)
{
	this.pos = new THREE.Vector3(x, y, 0);
	this.time = 0;
	this.noiseTimeX = 0;
	this.noiseTimeY = 1000;

	// animation and state machine
	this.state = STATE_AT_HOME;
	this.animationTime = 0;
	this.animationSpeed = 0;
	this.spline = new THREE.SplineCurve3([
   		new THREE.Vector3(x, y, 0),
   		new THREE.Vector3(44, 52, 0),
   		new THREE.Vector3(42, 42, 0),
   		new THREE.Vector3(25, 35, 0),
   		new THREE.Vector3(12, 45, 0),
   		new THREE.Vector3(15, 75, 0),
   		new THREE.Vector3(35, 85, 0)
   		]);
}

Creature.prototype.update = function()
{
	this.noiseTimeX += 0.01;
	this.noiseTimeY += 0.01;
	this.time += noise(this.noiseTimeX + this.noiseTimeY, 0, 0);

	switch(this.state)
	{
		case STATE_AT_HOME:
			this.pos.x = this.spline.getPoint(0).x + noise(this.noiseTimeX, 0, 0) * 10;
			this.pos.y = this.spline.getPoint(0).y + noise(this.noiseTimeY, 0, 0) * 10;
			break;
		case STATE_AT_TARGET:
			this.pos.x = this.spline.getPoint(1).x + noise(this.noiseTimeX, 0, 0) * 10;
			this.pos.y = this.spline.getPoint(1).y + noise(this.noiseTimeY, 0, 0) * 10;
			break;
		case STATE_TO_TARGET:
		case STATE_TO_HOME:
			this.animationTime += this.animationSpeed;
			if (this.animationTime > 1) {
				this.state = STATE_AT_TARGET;
				this.animationTime = 1;
				this.animationSpeed = 0;
			}
			else if (this.animationTime < 0) {
				this.state = STATE_AT_HOME;
				this.animationTime = 0;
				this.animationSpeed = 0;
			}

			this.pos = this.spline.getPoint(this.animationTime);
		default:
	}
}

Creature.prototype.draw = function(ctx)
{
	var brightness = map(Math.sin(this.time), -1, 1, 100, 200);
	var brStr = "rgb("+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+")";

	ctx.translate(this.pos.x, this.pos.y);
	ctx.fillStyle = brStr;
	ctx.fillRect(-1.5, -1.5, 3, 3);
	ctx.translate(-this.pos.x, -this.pos.y);
}


Creature.prototype.goToTarget = function()
{
	this.state = STATE_TO_TARGET;
	this.animationSpeed = 0.003;
}

Creature.prototype.goHome = function()
{
	this.state = STATE_TO_HOME;
	this.animationSpeed = -0.003;
}

Creature.prototype.toggleTarget = function()
{
	if (this.state == STATE_AT_HOME || this.state == STATE_TO_HOME) {
		this.goToTarget();
	}
	else {
		this.goHome();
	}
}



