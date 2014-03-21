

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
		this.pos.x > 300 ||
		this.pos.y > 300) {
		return false;
	}

	return true;
}

Bullet.prototype.draw = function(ctx)
{
	ctx.translate(this.pos.x, this.pos.y);

	ctx.fillStyle = "white";
	ctx.fillRect(-0.5, -0.5, 1, 1);

	ctx.translate(-this.pos.x, -this.pos.y);
}