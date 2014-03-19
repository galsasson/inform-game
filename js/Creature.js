
Creature = function(width, height)
{
	this.canvasSize = new THREE.Vector2(width, height);
	this.center = new THREE.Vector3(30, 60, 0);
	this.pos = new THREE.Vector3(this.center.x, this.center.y, this.center.z);
	this.time = 0;
	this.noiseTimeX = 0;
	this.noiseTimeY = 1000;
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");
}

Creature.prototype.update = function()
{
	this.noiseTimeX += 0.01;
	this.noiseTimeY += 0.01;
	this.time += noise(this.noiseTimeX + this.noiseTimeY, 0, 0);
	// console.log(noise(time, 0, 0));
	this.pos.x = this.center.x + noise(this.noiseTimeX, 0, 0) * 10;
	this.pos.y = this.center.y + noise(this.noiseTimeY, 0, 0) * 10;
}

Creature.prototype.draw = function(ctx)
{
	// this.context.fillStyle = "0xff000000";
	// this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.translate(this.pos.x, this.pos.y);
	var brightness = map(Math.sin(this.time), -1, 1, 100, 200);
	// console.log(brightness);
	// this.context.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
	var brStr = "rgb("+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+")";
	// console.log(brStr);
	ctx.fillStyle = brStr;//"rgb("+brStr +"," + brStr + "," + brStr+")";
	ctx.fillRect(-1, -1, 3, 3);
	ctx.translate(-this.pos.x, -this.pos.y);
}



