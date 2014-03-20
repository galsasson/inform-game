
Surface = function(x, y, width, height)
{
	this.pos = new THREE.Vector3(x, y, 0);
	this.size = new THREE.Vector3(width, height, 0);
	this.topLeft = new THREE.Vector3(x-width/2, y-height/2, 0);
	this.time = 0;
	this.speed = 2;
	this.noiseTimeX = 0;
	this.noiseTimeY = 1000;
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");
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
			var brightness = this.heightFunc(x, y, this.time) * 255;
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


