
var DEPTH_RANGE = 100;

World = function()
{
	this.absoluteHeight = true;

	this.loaded = false;
	// this.canvas = document.createElement("canvas");
	this.canvas = document.getElementById("imgCanvas");
	this.context = this.canvas.getContext("2d");
	this.context.imageSmoothingEnabled = false;

	this.creature = new Creature(30, 60);
	this.surfaces = [];
	this.surfaces.push(new Surface(20, 20, 70, 20, 20, 80));
	this.surfaces.push(new Surface(60, 100, 120, 100, 20, 200));
	this.surfaces[0].setFunction(resMgr.surfaces[0]);
	this.surfaces[1].setFunction(resMgr.surfaces[1]);

	this.bullets = [];

	this.img = new Image();
}

World.prototype.init = function(pngFilename)
{
	this.img.onload = world.imageLoaded;
	this.img.src = pngFilename;	
}

World.prototype.imageLoaded = function()
{
	// this is the image
	var w = world;
	var width = this.naturalWidth;
	var height = this.naturalHeight;
	console.log("World image loaded: "+width + "x" + height);
	w.canvas.width = width;
	w.canvas.height = height;
	w.canvasCenter = new THREE.Vector3(width/2,height/2, 0);
	w.loaded = true;
}

World.prototype.update = function(center, rot)
{
	if (!this.loaded) {
		return;
	}

	// draw height map in current place
	this.context.fillStyle = "rgb(0, 0, 0)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.context.translate(this.canvasCenter.x+0.5, this.canvasCenter.y);
	this.context.rotate(rot);
	this.context.translate(-center.x, -center.y)

	this.context.drawImage(this.img, 0, 0);

	// update and draw creatures
	this.creature.update();
	this.creature.draw(this.context);

	// update and draw surfaces
	for (var i=0; i<this.surfaces.length; i++)
	{
		var surf = this.surfaces[i];
		surf.update();
		surf.draw(this.context);
	}

	// update and draw bullets
	for (var i=this.bullets.length-1; i>=0; i--)
	{
		var b = this.bullets[i];
		var alive = b.update();
		if (alive) {
			b.draw(this.context);
		}
		else {
			this.bullets.splice(i, 1);
		}
	}

	this.context.translate(center.x, center.y);
	this.context.rotate(-rot);
	this.context.translate(-this.canvasCenter.x-0.5, -this.canvasCenter.y);

	
}

World.prototype.getHeights = function()
{
	if (!this.loaded) {
		return [];
	}

	if (this.absoluteHeight) {
		return this.getHeightsAbs();
	}
	else {
		return this.getHeightsRel();
	}
}

World.prototype.getHeightsAbs = function()
{
	var heightArr = [];

	// get current data
	var imgData = this.context.getImageData(45, 45, 30, 30).data;
	for (var i=0; i<imgData.length; i+=4)
	{
		heightArr[i/4] = 4/255 * imgData[i];
	}

	return heightArr;	
}

World.prototype.getHeightsRel = function()
{
	var heightArr = [];

	var charHeight = this.context.getImageData(60, 60, 1, 1).data;
	var centerHeight = charHeight[0];

	// get current data
	var imgData = this.context.getImageData(45, 45, 30, 30).data;
	for (var i=0; i<imgData.length; i+=4)
	{
		var normalizedHeight = map(imgData[i], centerHeight-DEPTH_RANGE/2, centerHeight+DEPTH_RANGE/2, -1, 1);
		heightArr[i/4] = 2 + 2 * normalizedHeight;
	}

	return heightArr;
}

World.prototype.addBullet = function(bullet)
{
	this.bullets.push(bullet);
}
