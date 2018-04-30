var rowConverter = function(d) {
    return{
        name: d.name,
        reading_level: parseFloat(d.reading_level),
        num_lines: parseInt(d.num_lines),
        group: d.group,
        vocab: parseInt(d.vocab)
    };
}
var svg = null;
var xScale = null;
var yScale = null;
var aScale = null;
var tooltip = null;
d3.csv("../data/reading_level/shrek_trilogy_reading.csv", rowConverter, function(data) {

    var margin = {top: 10, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    //var width = 700; //width of canvas
    //var height = 300; //height of canvas
    var padding = 40;
    
    // again scaleOrdinal
	var color = d3.scaleOrdinal(d3.schemeCategory20);

    console.log("RUNNIN");
    // add the graph canvas to the body of the webpage
    svg = d3.select("#read_chart").append("svg")
        .attr("width", width)
        .attr("height", height)
    
    // add the tooltip area to the webpage
    tooltip = d3.select("#read_chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Create scale functions
    xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.num_lines; })])
        .range([padding, width - padding * 2]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.reading_level; })])
        .range([height - padding, padding]);

    aScale = d3.scaleSqrt()
        .domain([0, d3.max(data, function(d) { return d.vocab; })])
        .range([0, 10]);

    //Define X axis
	var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(8)
        .tickFormat(formatAsPercentage);

    //Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
        .tickFormat(formatAsPercentage);
    
    var formatAsPercentage = d3.format(".1%");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d){
          return aScale(d.vocab)
      })
      .attr("cx", function(d){
          return xScale(d.num_lines)
        })
      .attr("cy", function(d){
          return yScale(d.reading_level)
        })
      .style("opacity", 0.3)
      .style("fill", function(d) { 
          return color(d.group);
        }) 
      .style('stroke-width', '2px')
      .style('stroke', 'none')
      .on("mouseover", function(d) {
        d3.select(this).style('stroke', 'black')
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        
          tooltip.html(d.name + "<br/> READING LEVEL:" + d.reading_level + "<br/>"
            + "VOCAB: " + d.vocab + " UNIQUE WORDS"
            + '<img style="width:100px;height:150px;" src="img/original/' + d.name.toLowerCase().split(' ').join('') + '.jpg" alt="' + d.name + '">')
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })

      .on("mouseout", function(d) {
        d3.select(this).style('stroke', 'none')
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    //Create X axis
	svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

  // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height) + ")")
      .style("text-anchor", "middle")
      .text("Number of Lines");

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
  // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",-200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Flesch Kincaid Score");

    var legend = svg.selectAll('legend')
      .data(color.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

  // give x value equal to the legend elements. 
  // no need to define a function for fill, this is automatically fill by color.
  legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

  // add text to the legend elements.
  // rects are defined at x value equal to width, we define text at width - 6, this will print name of the legends before the rects.
  legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function(d){
          return d; 
        });
  
    // create legend for vocabulary size
    var circle_scale = svg.append("g")
      .attr("class", "circle scale")
      .attr("transform", "translate(120, 300)");

    circle_scale.append("text")
      .attr("class", "gia-axisLabel")
      .attr("x", 0)
      .attr("y", -44)
      .style("text-anchor", "middle")
      .text("Vocabulary size");

    var circle_key_big = circle_scale.append("g")
      .attr("class", "circleKey")
      .attr("transform", "translate(0, -18.9866421)")
      
    circle_key_big.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r" ,18.96866);

    circle_key_big.append("line")
      .attr("x1", -18.986)
      .attr("x2" , -23.986)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "#000")
      .attr("stroke-width", 2)

    circle_key_big.append("text")
      .attr("transform", "translate(-26.986, 0)")
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("30,000")

    var circle_key_small = circle_scale.append("g")
      .attr("class", "circleKey")
      .attr("transform", "translate(0, -6.00417)")

    circle_key_small.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6.00417)
    
    circle_key_small.append("line")
      .attr("x1", -6.00417)
      .attr("x2", -23.986)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
    
    circle_key_small.append("text")
      .attr("transform", "translate(-26.98686, 0)")
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("3,000")

});

d3.select("button#trilogy")
    .on("click", function(){
        d3.select(".is-selected")
            .attr("class", "small")
        d3.select("button#trilogy")
            .attr("class", "small is-selected")
        d3.csv("../data/reading_level/shrek_trilogy_reading.csv", rowConverter, function(data) {
            //do redrawing here
        });
        console.log("dankdank");
    });

d3.select("button#shrek")
    .on("click", function(){
        d3.select(".is-selected")
            .attr("class", "small")
        d3.select("button#shrek")
            .attr("class", "small is-selected")
    d3.csv("../data/reading_level/shrek_reading.csv", rowConverter, function(data) {
        console.log("shrek 1");
        // draw dots
        svg.selectAll(".dot").remove();

        var margin = {top: 10, right: 20, bottom: 50, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
        //var width = 700; //width of canvas
        //var height = 300; //height of canvas
        var padding = 40;
        
        // again scaleOrdinal
        var color = d3.scaleOrdinal(d3.schemeCategory20);
    
        console.log("RUNNIN");
        // add the graph canvas to the body of the webpage
        //Create scale functions
        var formatAsPercentage = d3.format(".1%");
        svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){
            return aScale(d.vocab)
        })
        .attr("cx", function(d){
            return xScale(d.num_lines)
            })
        .attr("cy", function(d){
            return yScale(d.reading_level)
            })
        .style("opacity", 0.3)
        .style("fill", function(d) { 
            return color(d.group);
            }) 
        .style('stroke-width', '2px')
        .style('stroke', 'none')
        .on("mouseover", function(d) {
            d3.select(this).style('stroke', 'black')
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(d.name + "<br/> READING LEVEL:" + d.reading_level + "<br/>"
                + "VOCAB: " + d.vocab + " UNIQUE WORDS"
                + '<img style="width:100px;height:150px;" src="img/original/' + d.name.toLowerCase().split(' ').join('') + '.jpg" alt="' + d.name + '">')
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        .on("mouseout", function(d) {
            d3.select(this).style('stroke', 'none')
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    });
});

d3.select("button#shrek2")
    .on("click", function(){
        //first, make sure the button is selected
        d3.select(".is-selected")
            .attr("class", "small")
        d3.select("button#shrek2")
            .attr("class", "small is-selected")
        d3.csv("../data/reading_level/shrek2_reading.csv", rowConverter, function(data){
            //do redrawing here
            svg.selectAll(".dot").remove();

            var margin = {top: 10, right: 20, bottom: 50, left: 70},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        
            //var width = 700; //width of canvas
            //var height = 300; //height of canvas
            var padding = 40;
            
            // again scaleOrdinal
            var color = d3.scaleOrdinal(d3.schemeCategory20);
        
            console.log("RUNNIN");
            // add the graph canvas to the body of the webpage
            //Create scale functions
            var formatAsPercentage = d3.format(".1%");
            svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d){
                return aScale(d.vocab)
            })
            .attr("cx", function(d){
                return xScale(d.num_lines)
                })
            .attr("cy", function(d){
                return yScale(d.reading_level)
                })
            .style("opacity", 0.3)
            .style("fill", function(d) { 
                return color(d.group);
                }) 
            .style('stroke-width', '2px')
            .style('stroke', 'none')
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black')
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                tooltip.html(d.name + "<br/> READING LEVEL:" + d.reading_level + "<br/>"
                    + "VOCAB: " + d.vocab + " UNIQUE WORDS"
                    + '<img style="width:100px;height:150px;" src="img/original/' + d.name.toLowerCase().split(' ').join('') + '.jpg" alt="' + d.name + '">')
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
    
            .on("mouseout", function(d) {
                d3.select(this).style('stroke', 'none')
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        });
        console.log("shrek 2");
    });

d3.select("button#shrek3")
    .on("click", function(){
        d3.select(".is-selected")
            .attr("class", "small")
        d3.select("button#shrek3")
            .attr("class", "small is-selected")
        d3.csv("../data/reading_level/shrek3_reading.csv", rowConverter, function(data){
            svg.selectAll(".dot").remove();

            var margin = {top: 10, right: 20, bottom: 50, left: 70},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        
            //var width = 700; //width of canvas
            //var height = 300; //height of canvas
            var padding = 40;
            
            // again scaleOrdinal
            var color = d3.scaleOrdinal(d3.schemeCategory20);
        
            console.log("RUNNIN");
            // add the graph canvas to the body of the webpage
            //Create scale functions
            var formatAsPercentage = d3.format(".1%");
            svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d){
                return aScale(d.vocab)
            })
            .attr("cx", function(d){
                return xScale(d.num_lines)
                })
            .attr("cy", function(d){
                return yScale(d.reading_level)
                })
            .style("opacity", 0.3)
            .style("fill", function(d) { 
                return color(d.group);
                }) 
            .style('stroke-width', '2px')
            .style('stroke', 'none')
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black')
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                tooltip.html(d.name + "<br/> READING LEVEL:" + d.reading_level + "<br/>"
                    + "VOCAB: " + d.vocab + " UNIQUE WORDS"
                    + '<img style="width:100px;height:150px;" src="img/original/' + d.name.toLowerCase().split(' ').join('') + '.jpg" alt="' + d.name + '">')
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
    
            .on("mouseout", function(d) {
                d3.select(this).style('stroke', 'none')
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });            //do redrawing here

        });
        console.log("shrek 3");
    });