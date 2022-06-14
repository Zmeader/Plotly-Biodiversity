function init() {
    let dropDown = d3.select("#selDataset");
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((Data) => {
      
      let dataNames = Data.names;
      
      dataNames.forEach((name) => {
        dropDown.append('option').text(name).property('value', name);
      });

    var firstSample = dataNames[0];
    buildMetaData(firstSample);
    buildCharts(firstSample);
    });
    // run functions to generate plots
}
init();
// function that runs whenever the dropdown is changed
function optionChanged(newSample){
  buildMetaData(newSample)
  buildCharts(newSample)
};

function buildMetaData(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((Data) => {
  var metadata = Data.metadata;
  console.log(metadata)
  //Filter data to find the correct id 
  var array = metadata.filter(sampleObj =>  sampleObj.id == sample);
  var lineItem = array[0];
  var panel = d3.select('#sample-metadata');

  panel.html("");

  //add each key element to the demographic
  Object.entries(lineItem).forEach(([key, value]) => {
    panel.append('h6').text(`${key.toUpperCase()}: ${value}`)
    });
  });
}

function buildCharts(sample){
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((Data) => {
    var sampleData = Data.samples
    var array = sampleData.filter(sampleObj => sampleObj.id == sample);
    var lineItem = array[0];
    var otu_ids = lineItem.otu_ids;
    var otu_labels = lineItem.otu_labels;
    var sample_values = lineItem.sample_values;
    var metadata = Data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaLineItem = metaArray[0];

    //Build bubble Chart
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "sunset"
        }
      }
  ];
    var bubbleLayout = {
      title: 'Cultures Per Sample',
      hovermode: 'closest',
      xaxis: {title: "OTU_ID"}
    }
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
    var ytick = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    var chartData = [
      {
        y: ytick,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures",
    }
    Plotly.newPlot('bar', chartData, barLayout);
  
    var gaugeChart = [
      {
      domain: {'x': [0, 1], 'y': [0, 1]},
      marker: {size: 28, color:'850000'},
      value: metaLineItem.wfreq,
      mode: "gauge+number+delta",
      title: 'Belly Button Washing Frequency<br> Scrubs per Week',
      type: 'indicator',
      delta: {'reference': 380},
      mode: 'gauge+number',
      gauge: { 
        bar: {color:'green'},
        axis: { visible: true, range: [0, 9] } },
        steps: [
          { range: [0,1], color: 'rgb(253, 162, 73)' },
        ]
      
    }
  ];
    var gaugeLayout = {
      width: 550,
      height: 450,
      line: {
        color: '60000'
      },
    };
  
  Plotly.newPlot('gauge', gaugeChart, gaugeLayout);
  

});
}
