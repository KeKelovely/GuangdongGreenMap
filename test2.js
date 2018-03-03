	var width  = 3000,
		height = 3000,
		centered;
	var width1 = 781.83,
		height1 = 599.23;
	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform","translate(0,0)");
	
	var projection = d3.geo.mercator()
						.center([121, 11.5])
						.scale(5800)
    					.translate([width/2, height/2]);
	
	var path = d3.geo.path()
					.projection(projection);

d3.json("http://kekelovely.github.io/guangdong.json",function(error,georoot){
	if (error){
		return console.error(error);
	}
	console.log(georoot);

	var china = svg.append("g")
				.attr("id","china");
	var provinces = china.selectAll("path")
				.data(georoot.features)
				.enter()
				.append("path")
				.attr("class","province")
				.attr("d",path)
				.attr("stroke","#A9A9A9")
				.attr("stroke-width",1)
				.on("click",clicked);
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;

  } else {
    x = width1 / 2;
    y = height1 / 2;
    k = 1;
    centered = null;
  }

  china.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  china.transition()
      .duration(750)
      .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
	d3.json("https://kekelovely.github.io/green.json",function(error,valuedata){
		var values = [];
		for(var i=0; i<valuedata.cities.length; i++){
			var name = valuedata.cities[i].name;
			var value = valuedata.cities[i].value;
			values[name] = value;
		}

		var maxvalue = d3.max(valuedata.cities,function(d){return d.value;});
		var minvalue = 0;

		var linear = d3.scale.linear()
						.domain([minvalue, maxvalue])
						.range([0, 1]);

		var a = d3.rgb(236,245,225);	
		var b = d3.rgb(168,213,143);	

		var computeColor = d3.interpolate(a,b);

		provinces.style("fill", function(d,i){
			var t = linear( values[d.properties.name] );
			var color = computeColor(t);
			return color;
		});

		var dataset1 = [80,80,80,80,80];
		var dataset2 = [30];
		var rectHeight = 30;  
	svg.selectAll(".ColorRect")
    		.data(dataset1)
    		.enter()
    		.append("rect")
    		.attr("class","ColorRect")
    		.attr("x",100)
    		.attr("y",function(d,i){
         		return (i * rectHeight * 1.2)+40;
    		})
    		.attr("width",function(d){
        		 return d;
    		})
    		.attr("height",rectHeight-10)
    		.attr("fill",function(d,i){
    			switch(i)
    			{
    				case 0:
    					return "rgb(168,213,143)";
    					break;
    				case 1:
    					return "rgb(183,220,160)";
    					break;
    				case 2:
    					return "rgb(199,227,179)";
    					break;
    				case 3:
    					return "rgb(217,235,200)";
    					break;
    				case 4:
    					return "rgb(236,245,225)";
    					break;
    			}
    		});

		var explainText = svg.append("text")
					.attr("class","ExplainText")
					.attr("x",80)
					.attr("y",20)
					.attr("fill","#000")
					.style("font-weight","bold")
					.style("font-size","18px")
					.text(function(){
						return "各市森林覆盖率"
					});

		function numText(i){
					var NumText1 = svg.append("text")
					.attr("class","ExplainText")
					.attr("x",190)
					.attr("y",55+i*36)
					.attr("fill","#000")
					.style("font-size","16px")
					.text(function(){
    				switch(i)
    				{
    					case 0:
    						return "≥70%";
    						break;
    					case 1:
    						return "60%-70%";
    						break;
    					case 2:
    						return "45%-60%";
    						break;
    					case 3:
    						return "35%-45%";
    						break;
    					case 4:
    						return "<30%";
    						break;
    			}
					});
		}
		for (let i = 0; i < 5; i++){
				numText(i);
		}
		var interactive_rect = svg.append("rect")
			.attr("class","interactive_rect")
			.attr("x",100)
			.attr("y",400)
			.attr("height",30)
			.attr("width",50)
			.attr("rx",5)
			.attr("ry",5)
			.attr("stroke","black");
		var ClickText = svg.append("text")
					.attr("class","Interactive_Text")
					.attr("x",125)
					.attr("y",420)
					.text(function(){
						return "View"
					})
					.on("click",function(){
							var div = $('.laYers1');
							div.fadeToggle();
					});

});
	d3.json("https://kekelovely.github.io/places.json",function(error,places){
		var location = china.selectAll(".location")
						.data(places.location)
						.enter()
						.append("g")
						.attr("class","location")
						.attr("transform",function(d){
							var coor = projection([d.log,d.lat]);
							return "translate("+ coor[0] +"," + coor[1] +")";
						});
		location.append("circle")
				.attr("r",5)				
				.attr("class","laYers1")
				.attr("fill","yellow");


		location.append("text")
				.attr("x",-27)
				.attr("class","laYers1")
				.attr("y",-5)
				.text(function(d){
					return d.name;
				})
				.attr("font-size",13)
				.attr("font-weight","bold");
});
	});

