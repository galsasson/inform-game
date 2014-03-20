
Creature = function(width, height)
{
	this.center = new THREE.Vector3(30, 60, 0);
	this.pos = new THREE.Vector3(this.center.x, this.center.y, this.center.z);
	this.time = 0;
	this.noiseTimeX = 0;
	this.noiseTimeY = 1000;
}

Creature.prototype.update = function()
{
	this.noiseTimeX += 0.01;
	this.noiseTimeY += 0.01;
	this.time += noise(this.noiseTimeX + this.noiseTimeY, 0, 0);

	this.pos.x = this.center.x + noise(this.noiseTimeX, 0, 0) * 10;
	this.pos.y = this.center.y + noise(this.noiseTimeY, 0, 0) * 10;
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



