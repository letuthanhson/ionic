import { Component } from '@angular/core';

declare var d3:any;

@Component({
  selector: 'bubble-chart',
  template:
    `<div style="width: 100%;" id="bubblechart" >
    </div>
    `
})
export class BubbleChartComponent
{
    constructor(){}
    // draw a bubble chart
    render(root: any) {        

        //
        // Example root                
        //let root:any = {};
        //        root.name = "Interactions";
        //        root.children = new Array(); 
        //        data.map(o=>
        //        {
        //            root.children.push({name: o.ratingBand,  value: o.exposure});
        //        })  
        //
        // How big the chart is 
        //
        //console.log('bubble root...' + JSON.stringify(root));
        var diameter = document.getElementById("bubblechart").offsetWidth;
        console.log('diameter...' + diameter);
        //
        // Pick some colours for the categories (groups)
        //
        var color = d3.scale.category10();
        
        //
        // Create a bubble layout based on the tree of objects. 
        // This adds properties x,y,r to each of our leaf objects
        // indicating where to draw them (x,y), and how big to draw them (r).
        // This is worked out using the "value" property of each leaf.
        //
        var bubble = d3.layout.pack().sort(null).size([diameter, diameter]).padding(1.5);

        //
        // Make a SVG graphic
        //
        var svg = d3.select("#bubblechart")
                    .append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("class", "bubble");
        
        //
        // For each leaf, create a new "node" and place it in the correct
        // location using the transform attribute.
        //
        var node = svg.selectAll(".node")
                      .data(bubble.nodes(root)
                      .filter(function(d){                       
                          return !d.children;
                      }))
                      .enter()
                      .append("g")
                      .attr("class","node")
                      .attr("transform", function(d) {                      
                          return "translate(" + d.x + "," + d.y + ")"; 
                      });
      
      //assign self to this object                   
      var self    = this;
      var tooltip = self.getTooltip("#bubblechart");
      var format  = d3.format(",d");

      //
       // For each node, make a circle of the correct radius (r) and
       // colour it in according to the group it belongs to
       //
       node.append("circle")
           .attr("r", function(d) { return d.r; })
           .style("fill", function(d) { return  self.randomCssRgba();  })
           .on("mouseover", function(d) {
                          tooltip.text(d.name + ": " + format(d.value));
                          tooltip.style("visibility", "visible");
                  })
                  .on("mousemove", function() {
                      return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX-10)+"px");
                  })
                  .on("mouseout", function(){return tooltip.style("visibility", "hidden");
                });   

        //
        // For each node, add a label to the middle of the circle
        //
        //    node.append("text")
        //        .attr("dy", ".1em")
        //        .style("text-anchor", "middle")
        //        .text(function(d) { 
        //               return d.name;
        //         });
    }

    private getTooltip(chartId: string): any
    {
        var tooltip = d3.select(chartId)
                        .append("div")
                        .style("position", "absolute")
                        .style("width", "100px")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .style("color", "white")
                        .style("padding", "8px")
                        .style("background-color", "rgba(0, 0, 0, 0.75)")
                        .style("border-radius", "6px")
                        .style("font", "12px sans-serif")
                        .style("text-align", "center")
                        .text("tooltip");
        return tooltip;
    }

    private randomCssRgba(): any {
          let rgbaArray = [this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(0, 255), this.randomNumber(50, 100) * 0.01];
            
          return 'rgba(' + rgbaArray.join(',') + ')';
    }

   private randomNumber(min, max): any {        
          return Math.floor(Math.random() * (max - min + 1) + min);
    } 
}
