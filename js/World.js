
var MAX_SPEED = 0.2;
var MAX_ROT_SPEED = 0.15;
var DEPTH_RANGE = 512;

World = function(pngFilename)
{
	this.pos = new THREE.Vector3(45, 45, 0);
	this.rotation = 0;
	this.vel = new THREE.Vector3(0, 0, 0);
	this.acc = new THREE.Vector3(0, 0, 0);
	this.rotSpeed = 0;
	this.rotAcc = 0;

	this.loaded = false;
	this.canvas = document.getElementById("imgCanvas");
	// this.canvas = document.createElement("canvas");
	this.canvas.width = 30;
	this.canvas.height = 30;
	this.context = this.canvas.getContext("2d");
	this.context.imageSmoothingEnabled = false;

	this.creature = new Creature(120, 120);

	this.img = new Image();
	this.img.src = pngFilename;
	this.img.onload = this.imageLoaded();
}

World.prototype.imageLoaded = function()
{
	this.loaded = true;
}

World.prototype.update = function()
{
	if (!this.loaded) {
		return;
	}

	this.vel.add(this.acc);
	if (this.vel.length() > MAX_SPEED) {
		this.vel.setLength(MAX_SPEED);
	}
	// check if we can move to this position
	// {
	// var newPos = new THREE.Vector2();
	// newPos.addVectors(this.pos, this.vel);
	// var curPosColor = this.context.getImageData(this.pos.x, this.pos.y, 1, 1).data;
	// var nextPosColor = this.context.getImageData(newPos.x, newPos.y, 1, 1).data;
	// }

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

	// update the creature
	this.creature.update();

	// draw height map in current place
	this.context.fillStyle = "rgb(0, 0, 0)";
	this.context.fillRect(0, 0, 30, 30);
	this.context.translate(15, 15);
	this.context.rotate(this.rotation);
	this.context.translate(-this.pos.x, -this.pos.y)
	this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);
	this.creature.draw(this.context);
	this.context.translate(this.pos.x, this.pos.y);
	this.context.rotate(-this.rotation);
	this.context.translate(-15, -15);
}

World.prototype.getHeightsAbs = function()
{
	var heightArr = [];

	// get current data
	var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
	for (var i=0; i<imgData.length; i+=4)
	{
		heightArr[i/4] = 4/255 * imgData[i];
	}

	return heightArr;	
}

World.prototype.getHeights = function()
{
	var heightArr = [];

	var charHeight = this.context.getImageData(15, 15, 1, 1).data;
	var centerHeight = charHeight[0];

	// get current data
	var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
	for (var i=0; i<imgData.length; i+=4)
	{
		var normalizedHeight = map(imgData[i], centerHeight-DEPTH_RANGE/2, centerHeight+DEPTH_RANGE/2, -1, 1);
		heightArr[i/4] = 2 + 2 * normalizedHeight;
	}

	return heightArr;
}

World.prototype.propel = function(amount)
{
	this.acc.set(amount * Math.sin(this.rotation), amount * Math.cos(this.rotation), 0);
}

World.prototype.turn = function(amount)
{
	this.rotAcc = amount;
}

World.prototype.move = function(x, y)
{
	this.pos.x -= x;
	this.pos.y -= y;
}

World.prototype.moveForward = function()
{
	this.pos.x -= Math.cos(-this.rotation);
	this.pos.y -= Math.sin(-this.rotation);
}

World.prototype.moveBackward = function()
{
	this.pos.x += Math.cos(-this.rotation);
	this.pos.y += Math.sin(-this.rotation);
}

World.prototype.rotate = function(r)
{
	this.rotation += r;
}