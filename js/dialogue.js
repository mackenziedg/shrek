function createViz(file) {
  var svg = d3.select(".char"),
      margin = {top: 20, right: 20, bottom: 30, left: 130};//,
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand().range([height, 0]);

  var g = svg.append("g")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  d3.csv(file, function(error, data) {
    	if (error) throw error;
      max_val = d3.max(data, function(d) { return +d.wc; });
    	data.sort(function(a, b) { return +a.wc - +b.wc; });

    	x.domain([0, max_val]); // width]);//
      y.domain(data.map(function(d) { return d.name; })).padding(0.1);

      g.append("g")
          .attr("class", "x axis")
         	.attr("transform", "translate(0," + height + ")")
        	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

      g.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(y));

      g.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("height", y.bandwidth())
          .attr("y", function(d) { return y(d.name); })
          .attr("fill", function(d) {return d.gender == "male" ? "blue" : "red";})
          .attr("width", function(d) { return +d.wc / max_val * width; })
          .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.name) + "<br>" + (d.wc));
          })
      		.on("mouseout", function(d){ tooltip.style("display", "none");});

          // text label for the y axis
          svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0)// - margin.left)
              .attr("x",0 - (height*2 / 3))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Character");

          svg.append("text")
              .attr("y", -1)// - margin.left)
              .attr("x",0 + width*2/3)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Words Spoken per Character");

          svg.append("text")
              .attr("y", height + margin.bottom)// - margin.left)
              .attr("x",0 + width*2/3)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Word Count");
  });
}

createViz("data/gender/wc_char_tri.csv");

function changeViz() {
  var file = "data/gender/" + document.getElementById("movie").value + ".csv";
  d3.select(".char").selectAll("*").remove();
  createViz(file);
}

function createGenderViz(file) {
  var svg = d3.select(".gender"),
      margin = {top: 20, right: 20, bottom: 30, left: 110};//,
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand().range([height, 0]);

  var g = svg.append("g")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  d3.csv(file, function(error, data) {
    	if (error) throw error;
      max_val = d3.max(data, function(d) { return +d.wc; });
    	data.sort(function(a, b) { return +a.wc - +b.wc; });

    	x.domain([0, max_val]); // width]);//
      y.domain(data.map(function(d) { return d.gender; })).padding(0.1);

      g.append("g")
          .attr("class", "x axis")
         	.attr("transform", "translate(0," + height + ")")
        	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

      g.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(y));

      g.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("height", y.bandwidth())
          .attr("y", function(d) { return y(d.gender); })
          .attr("fill", function(d) {return d.gender == "M" ? "blue" : "red";})
          .attr("width", function(d) { return +d.wc / max_val * width; })
          .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.gender == 'M' ? "Male" : "Female") + "<br>" + (d.wc));
          })
      		.on("mouseout", function(d){ tooltip.style("display", "none");});

          // text label for the y axis
          svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 50)// - margin.left)
              .attr("x",0 - (height*2 / 3))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Gender");
          svg.append("text")
              .attr("y", -1)// - margin.left)
              .attr("x",0 + width*2/3)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Words Spoken per Gender");

          svg.append("text")
              .attr("y", height + margin.bottom)// - margin.left)
              .attr("x",0 + width*2/3)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Word Count");
  });
}

createGenderViz("data/gender/wc_gender_tri.csv");

function changeViz() {
  var char_file = "data/gender/wc_char_" + document.getElementById("movie").value + ".csv";
  var gender_file = "data/gender/wc_gender_" + document.getElementById("movie").value + ".csv";
  d3.select(".char").selectAll("*").remove();
  d3.select(".gender").selectAll("*").remove();
  createViz(char_file);
  createGenderViz(gender_file);
}