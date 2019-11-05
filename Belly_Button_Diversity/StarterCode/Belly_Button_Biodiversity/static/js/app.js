
//--------------------------------------------------------
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
   ///////////////////////////////////////////////////////////

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
///////////////////////////////////////////////////////////
  // * Create a PIE chart that uses data from your samples route (`/samples/<sample>`) to display the top 10 samples.
  // * Use `sample_values` as the values for the PIE chart.
  // * Use `otu_ids` as the labels for the pie chart.
  // * Use `otu_labels` as the hovertext for the chart.
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // * Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.
// * Use `otu_ids` for the x values.
// * Use `sample_values` for the y values.
// * Use `sample_values` for the marker size.
// * Use `otu_ids` for the marker colors.
// * Use `otu_labels` for the text values.



function buildMetadata(sample) 
    { 
        console.log("clicked on drop down")
        urls  = `/metadata/${sample}`      //  urls  = "/metadata/940"
        var htm_list = d3.select("#sample-metadata");
        htm_list.html("")

          d3.json(urls).then(function(response) 
              {
                var info = response ;

                Object.entries(info).forEach(([key, value]) =>
                      {
                      //////////// REFACTORED //////////////////////////////////////////////
                      d3.select("#sample-metadata").append("li").text( `${key} : ${value}`);    
                      });     
              });
    }


function buildCharts(sample) 
    {
        urlz = `/samples/${sample}`
        var htm_list = d3.select("#pie");
        htm_list.html("")
        var htm_list2 = d3.select("#bubble");
        htm_list2.html("")

          d3.json(urlz).then(function(response) 
            {
              ////////////////////////////////////////////////////////////////////
              //- TOP TEN PIE CHART -//
                var trace1 =    [{  
                                  values:  response.sample_values.slice(0, 10),
                                  labels:  response.otu_ids.slice(0, 10),
                                  hovertext : response.otu_labels,
                                  showlegend: true,
                                  // legend: "otu_ids",
                                  type:  "pie"
                                }];

                var layout =    { 
                                  title: `Top 10 Bacteria Groups in BellyButton Sample:[${sample}]`,
                                  titlefont: {"size": 16},
                                };

                Plotly.newPlot("pie", trace1, layout);

                ///////////////////////////////////////////////////////////////////
                //-  BUBBLE CHART  -//
                var trace2 =    [{ 
                                  x: response.otu_ids,
                                  y: response.sample_values ,
                                  mode: 'markers',
                                  type: 'scatter',
                                  hovertext : response.otu_labels,
                                  marker: {
                                          color: response.otu_ids ,
                                          size: response.sample_values
                                          }
                                }];
    
                var layout1_ =  { 
                                  title: `All Bacteria Groups Present in BellyButton Sample: [${sample}]` ,
                                  xaxis:  { title : "Bacteria otu-ids" },
                                  yaxis:  { title : "Bacteria sample values"}
                                };

                Plotly.newPlot("bubble", trace2, layout1_);
                
            });

            ///////////////////////////////////////////////////////////////////////
            //-    GAUGE CHART   -//
          address  = `/metadata/${sample}`
          d3.json(address).then(function(infoz) 
              {
                var data = 
                          [{
                            domain: { x: [0, 1], y: [0, 1] },
                            value: infoz.WFREQ,
                            title: `[${infoz.WFREQ}] Belly Button Washes Per Week Sample:[${sample}]` ,
                            titlefont: {"size": 14},
                            type: "indicator",
                            mode: "gauge+number",

                            gauge: {
                                    axis : { range: [null, 7],  },
                                    steps: [              
                                              { range: [0, 1], color: "rgba(232, 226, 202, .8)" },
                                              { range: [1, 2], color: "rgba(210, 206, 145, .7)" },
                                              { range: [2, 3], color: "rgba(202, 207, 110, .8)" },
                                              { range: [3, 4], color: "rgba(202, 209,  95, .9)" },
                                              { range: [4, 5], color: "rgba(170, 202,  42, .8)" },
                                              { range: [5, 6], color: "rgba(110, 154,  22, .8)" },
                                              { range: [6, 7], color: "rgba( 14, 127,   0, .8)" }
                                            ],

                                    threshold:{
                                              line: { color: "red", width: 10 },
                                              thickness: 2,
                                              value: infoz.WFREQ,
                                              }
                                    }
                          }];
                
                var layout2 = { width: 400, height: 300, margin: { t: 0, b: 0 }, };

                Plotly.newPlot("gauge", data, layout2);
            });
      }



function init() 
    {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selDataset");

      // Use the list of sample names to populate the select options
      d3.json("/names").then((sampleNames) => 
        {
            sampleNames.forEach((sample) => 
              {
                selector
                  .append("option")
                  .text(sample)
                  .property("value", sample);
              });

            // Use the first sample from the list to build the initial plots
            const firstSample = sampleNames[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);
        });
    }

function optionChanged(newSample) 
    {
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
    }

// Initialize the dashboard
init();


/*
============================================================================================================
      BONE YARD 
=============================================================================================================

  // Object.entries(info).forEach(([key, value]) => console.log(`Key: ${key} and Value ${value}`));
  // console.log(response);

    ==================================================     
      //TRY THIS // this does not work ? 
    //   d3.select("#sample-metadata")
    //   .append("ul")
    //   .selectAll("li")
    //   .data(info)
    //   .enter()
    //   .append("li")
    //   .text(([k,v]) => `${k}, ${v}`);
    //  // // .text((k,v) => { console.log(k); return k,v });


=========================================================================================
ORIGINAL CHART  SOLUTIONS  BELOW - REFACTORED ABOVE WITH  GROUP MEMBER COLLABORATION
=================================================================================================
        d3.json(urlz).then(function(response) 
          {
            var labelz = [];

            Object.entries(response).forEach(  ([k,v]) => {  labelz.push(v.slice(0,10));  });     
                //  console.log("this is labelz", labelz[1]);
            var trace1 =  {
                          labels: labelz[0],
                          values: labelz[2],
                          type: "pie",
                          hovertext : labelz[1]
                          };

            plot_data   = [ trace1 ]  
            var layout  = { title: "Bacteria Groups Present in BellyButtons!" };
            Plotly.newPlot("pie", plot_data, layout);
          });

        d3.json(urlz).then(function(responses) 
          {          
            var htm_list2 = d3.select("#bubble");
            htm_list2.html("")
            var labelss = [];

            Object.entries(responses).forEach( ([k,v]) => {  labelss.push(v);  });     

            var trace2 = {
                          x:  labelz[0] ,
                          y:  labelz[2] ,
                          mode: 'markers',
                          type: 'scatter',
                          hovertext : labelz[1],
                          marker: {
                                  color:  labelz[0],
                                  size:  labelz[2]
                                  }
                         };

            plot_data1_   = [ trace2 ]  
            var layout1_  = { title: "Bacteria Groups Present in BellyButtons!" };
            Plotly.newPlot("bubble", plot_data1_, layout1_);
            });

    /////////////////////////////////////////////////////////////////////////////
  //  reference // for doing needle gauge 
  // https://com2m.de/blog/technology/gauge-charts-with-plotly/

  */          

