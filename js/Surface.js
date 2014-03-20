
Surface = function(x, y, z, width, height, depth)
{
	this.pos = new THREE.Vector3(x, y, z);
	this.size = new THREE.Vector3(width, height, depth);
	this.topLeft = new THREE.Vector3(x-width/2, y-height/2, 0);
	this.minDepth = this.pos.z - this.size.z/2;
	this.maxDepth = this.pos.z + this.size.z/2;
	this.time = 0;
	this.speed = 2;
	this.noiseTimeX = 0;
	this.noiseTimeY = 1000;
	this.heightFunc = function(x, y, time) { return 0; }
}

Surface.prototype.update = function()
{
	this.time += this.speed;
}

Surface.prototype.draw = function(ctx)
{
	ctx.translate(this.topLeft.x, this.topLeft.y);

	for (var y=0; y<this.size.y; y++)
	{
		for (var x=0; x<this.size.x; x++)
		{
			var brightness = map(this.heightFunc(x, y, this.time), -1, 1, this.minDepth, this.maxDepth);
			var brStr = "rgba("+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+",255)";
			ctx.fillStyle = brStr;
			ctx.fillRect(x, y, 2, 2);
		}
	}

	ctx.translate(-this.topLeft.x, -this.topLeft.y);
}


Surface.prototype.setFunction = function(func)
{
	this.heightFunc = func;
}


