var audioManager = new AudioManager();
var metronome = new Metronome(audioManager);
// metronome.play();

function send_request_get_response(url, return_function){
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var jsonObj = JSON.parse(xhttp.response);
         return_function( jsonObj );
      }
  };
}

function replaceAllSpaces(a) {
  var replaced_a = a.replaceAll(" ", "_");

  if (replaced_a.charAt(0) == "_") {
    replaced_a = replaced_a.substring(1);
  }
  if (replaced_a.charAt(replaced_a.length - 1) == "_") {
    replaced_a = replaced_a.substring(0, replaced_a.length - 1);
  }
  return replaced_a
}

nameslist = [];



function apply_global_names_list(resp){
  nameslist = resp;
}
send_request_get_response( location.href + 'nameslist', apply_global_names_list );

function lstm_tsne_3D_tonalities(response) {
  function getinfosstruct(respo) {
    infostructure = respo;
    initialise_plotly_chart(response, nameslist, respo);
  }
  send_request_get_response(location.href + 'infostructure', getinfosstruct);
}

function lstm_tsne_3D_neutral(response) {
  function getinfosstruct(respo) {
    infostructure = respo;
    initialise_plotly_chart(response, nameslist, respo);
  }
  send_request_get_response(location.href + 'infostructure', getinfosstruct);
}
send_request_get_response(location.href + 'lstm_tsne_3D_neutral', lstm_tsne_3D_neutral);







function initialise_plotly_chart(response, nameslist, infostructure) {

    nameslistNoUnderbar = [];

    for (i=0; i<nameslist.length; i++) {
        nameslistNoUnderbar.push(nameslist[i].replaceAll("_", " "));
    }

    function RGBToHex(r,g,b) {
      r = Math.floor(r * 255).toString(16);
      g = Math.floor(g * 255).toString(16);
      b = Math.floor(b * 255).toString(16);

      if (r.length == 1)
        r = "0" + r;
      if (g.length == 1)
        g = "0" + g;
      if (b.length == 1)
        b = "0" + b;

      return "#" + r + g + b;
    }

    x_axis = [];
    y_axis = [];
    z_axis = [];

    colors = [];
    cminst_color = [];
    symbol = [];
    if (typeof(response.hh) != "undefined") {
      //FOR ALPHA & BETA POLE
      document.getElementsByClassName("user-select-none")[0].classList.remove("hidden");
      for (i=0; i<response.hh.length; i++) {
         x_axis.push(response.hh[i][0]);
         y_axis.push(response.hh[i][1]);
         z_axis.push(response.z[i]);
         colors.push(RGBToHex(response.c[i][0],response.c[i][1],response.c[i][2]));
      }
    } else if (typeof(response.hh) == "undefined") {
      for (i=0; i<response.length; i++) {
         x_axis.push(response[i][0]);
         y_axis.push(response[i][1]);
         z_axis.push(response[i][2]);
         cminst_color.push(0.5);
       }
    }
    customdata = [];
    for (i=0; i<Object.keys(infostructure).length; i++) {
      customdata.push("Style: "+infostructure[Object.keys(infostructure)[i]].style+"<br>Tonality: "+infostructure[Object.keys(infostructure)[i]].tonality+"</br>");
    }

    var myPlot = d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows) {
  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }

 

  // Create initial trace
  var trace1 = {
    x: x_axis,
    y: y_axis,
    mode: 'markers',
    marker: {
      opacity: 0.8,
      size: 2,
      color: colors,
    },
    hovertemplate: '<br>%{text}</br>' +
      '<b>%{customdata}</b>' +
      "<extra></extra>",
    customdata: customdata,
    text: nameslistNoUnderbar,
    type: 'scatter'
  };
  var trace2 = {
    x: x_axis,
    y: z_axis,
    mode: 'markers',
    marker: {
      opacity: 0.8,
      size: 2,
      color: colors,
    },
    hovertemplate: '<br>%{text}</br>' +
      '<b>%{customdata}</b>' +
      "<extra></extra>",
    customdata: customdata,
    text: nameslistNoUnderbar,
    type: 'scatter'
  };
  var trace3 = {
    x: z_axis,
    y: y_axis,
    mode: 'markers',
    marker: {
      opacity: 0.8,
      size: 2,
      color: colors,
    },
    hovertemplate: '<br>%{text}</br>' +
      '<b>%{customdata}</b>' +
      "<extra></extra>",
    customdata: customdata,
    text: nameslistNoUnderbar,
    type: 'scatter'
  };

  // Create initial data array
  var initialData = [trace1];

  // Create layout
  var layout = {
    scene: {
      aspectmode: 'manual',
      aspectratio: { x: 1, y: 1 },
      xaxis: {
        autorange: true,
        showgrid: true,
        zeroline: true,
        showticklabels: false
      },
      yaxis: {
        autorange: true,
        showgrid: true,
        zeroline: true,
        showticklabels: false
      }
    },
    showlegend: true
  };

  // Create dropdown menu options
  var dropdownOptions = [
    { text: 'Trace 1', value: 'trace1' },
    { text: 'Trace 2', value: 'trace2' },
    { text: 'Trace 3', value: 'trace3' }
    // Add more options as needed
  ];

  // Create dropdown menu
  var dropdown = document.createElement('select');
  dropdown.id = 'traceDropdown';
  dropdownOptions.forEach(function(option) {
    var dropdownOption = document.createElement('option');
    dropdownOption.value = option.value;
    dropdownOption.text = option.text;
    dropdown.appendChild(dropdownOption);
  });

  // Append dropdown menu to the document
  var dropdownContainer = document.getElementById('dropdownContainer');
  dropdownContainer.appendChild(dropdown);

  // Function to update the trace
  function updateTrace(selectedTrace) {
    var newTrace;

    // Define the properties of the selected trace based on the dropdown value
    if (selectedTrace === 'trace1') {
      newTrace = {
        x: x_axis,
        y: y_axis,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 2,
          color: colors,
        },
        hovertemplate: '<br>%{text}</br>' +
          '<b>%{customdata}</b>' +
          "<extra></extra>",
        customdata: customdata,
        text: nameslistNoUnderbar,
        type: 'scatter'
      };
    } else if (selectedTrace === 'trace2') {
      // Define the properties of the second trace
      newTrace = {
        x: z_axis,
        y: y_axis,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 2,
          color: colors,
        },
        hovertemplate: '<br>%{text}</br>' +
          '<b>%{customdata}</b>' +
          "<extra></extra>",
        customdata: customdata,
        text: nameslistNoUnderbar,
        type: 'scatter'
      };
    } else if (selectedTrace === 'trace3') {
      // Define the properties of the third trace
      newTrace = {
        x: z_axis,
        y: x_axis,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 2,
          color: colors,
        },
        hovertemplate: '<br>%{text}</br>' +
          '<b>%{customdata}</b>' +
          "<extra></extra>",
        customdata: customdata,
        text: nameslistNoUnderbar,
        type: 'scatter'
      };
    }

    // Update the plot with the new trace
    Plotly.animate('myDiv', {
      data: [newTrace]
    }, {
      transition: {
        duration: 500,
        easing: 'linear'
      },
      frame: {
        duration: 500,
        redraw: false
      }
    });
  }

  // Dropdown change event handler
  dropdown.addEventListener('change', function() {
    var selectedTrace = dropdown.value;
    updateTrace(selectedTrace);
  });

  // Create initial plot
  Plotly.newPlot('myDiv', initialData, layout).then(gd => {
    gd.on('plotly_click', function(data) {
      for (var i = 0; i < data.points.length; i++) {
        var selectedsong = data.points[i].text;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          html: '<p>Selected song: <br>' + selectedsong + '</p>',
          width: '20rem',
          height: '1rem',
          timer: 1500
        });
        addEvent(selectedsong, r, h);
      }
    });
  });
});

}