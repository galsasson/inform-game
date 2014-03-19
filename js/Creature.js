
Creature = function(width, height)
{
	this.canvasSize = new THREE.Vector2(width, height);
	this.pos = new THREE.Vector2(30, 56);
	this.time = 0;
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");
}

Creature.prototype.update = function()
{
	this.time += 0.1;
}

Creature.prototype.draw = function(ctx)
{
	// this.context.fillStyle = "0xff000000";
	// this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.translate(this.pos.x, this.pos.y);
	var brightness = (Math.sin(this.time) + 1) * 125;
	// console.log(brightness);
	// this.context.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
	var brStr = "rgb("+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+","+Math.floor(brightness).toString()+")";
	// console.log(brStr);
	ctx.fillStyle = brStr;//"rgb("+brStr +"," + brStr + "," + brStr+")";
	ctx.fillRect(-1, 1, 3, 3);
	ctx.translate(-this.pos.x, -this.pos.y);
}



