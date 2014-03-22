

Bullet = function(x, y, angle)
{
	this.pos  = new THREE.Vector3(x, y, 0);
	this.speed = 1.5;
	this.angle = angle;
}

Bullet.prototype.update = function()
{
	this.pos.x += this.speed*Math.sin(this.angle);
	this.pos.y += this.speed*Math.cos(this.angle);

	if (this.pos.x < 0 ||
		this.pos.y < 0 ||
		this.pos.x > world.canvas.width ||
		this.pos.y > world.canvas.height) {
		return false;
	}

	return true;
}

Bullet.prototype.draw = function(ctx)
{
	ctx.translate(this.pos.x, this.pos.y);
	ctx.rotate(-this.angle);

	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 1);
	ctx.stroke();
	ctx.rotate(this.angle);
	ctx.translate(-this.pos.x, -this.pos.y);
}