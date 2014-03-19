var TABLE_WIDTH = 30;
var TABLE_HEIGHT = 30;
var SPACING = 0.3;

InformTable = function()
{
	THREE.Object3D.call(this);

	this.cubes = [];
	this.table = {};
	this.cooldown = 0;

	// this.showClipping = true;
}

InformTable.prototype = Object.create(THREE.Object3D.prototype);

InformTable.prototype.init = function()
{
	// create the big table
	var geo = new THREE.CubeGeometry(TABLE_WIDTH + TABLE_WIDTH*SPACING + 4, 
			TABLE_HEIGHT + TABLE_HEIGHT*SPACING + 4, 3.9);
	this.table = new THREE.Mesh(geo, resMgr.materials.gray);
	this.add(this.table);

	// create the pixels
	var topLeft = {};
	topLeft.x = -(TABLE_WIDTH+TABLE_WIDTH*SPACING)/2 + 0.5;
	topLeft.y = -(TABLE_HEIGHT+TABLE_HEIGHT*SPACING)/2 + 0.5;

	geo = new THREE.CubeGeometry(1, 1, 4);
	for (var y=0; y<TABLE_HEIGHT; y++)
	{
		for (var x=0; x<TABLE_WIDTH; x++)
		{
			var cube = new THREE.Mesh(geo, resMgr.materials.white);
			cube.position.set(topLeft.x + x + SPACING*x, topLeft.y + y + SPACING*y, 0);
			this.cubes[(TABLE_HEIGHT-y-1)*TABLE_WIDTH + x] = cube;
			this.table.add(cube);
			cube.castShadow = true;
			cube.receiveShadow = true;
		}
	}
}

InformTable.prototype.applyHeights = function(heights)
{
	for (var i=0; i<heights.length; i++)
	{
		this.cubes[i].position.z += (heights[i] - this.cubes[i].position.z) * (1-this.cooldown);

		if (this.showClipping) {
			if (heights[i] == 0 || heights[i] == 4) {
				this.cubes[i].material = resMgr.materials.black;
			}
			else {
				this.cubes[i].material = resMgr.materials.white;
			}			
		}
	}
}

InformTable.prototype.transform = function(func)
{
	for (var y=0; y<TABLE_HEIGHT; y++)
	{
		for (var x=0; x<TABLE_WIDTH; x++)
		{
			var cube = this.cubes[y*TABLE_WIDTH + x];
			cube.position.z = func(x, y);
			if (cube.position.z < 0) {
				cube.position.z = 0;
			}
			else if (cube.position.z > 4) {
				cube.position.z = 4;
			}
		}
	}
}

