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

// function lstm_tsne_3D_tonalities(response) {
//   function getinfosstruct(respo) {
//     infostructure = respo;
//     initialise_plotly_chart(response, nameslist, respo);
//   }
//   send_request_get_response(location.href + 'infostructure', getinfosstruct);
// }

// function lstm_tsne_3D_neutral(response) {
//   function getinfosstruct(respo) {
//     infostructure = respo;
//     initialise_plotly_chart(response, nameslist, respo);
//   }
//   send_request_get_response(location.href + 'infostructure', getinfosstruct);
// }
// send_request_get_response(location.href + 'lstm_tsne_3D_neutral', lstm_tsne_3D_neutral);


function mask_visualization_data(response) {
  function getinfosstruct(respo) {
    infostructure = respo;
    initialise_plotly_chart(response, nameslist, respo);
  }
  send_request_get_response(location.href + 'mask_visualization_data', getinfosstruct);
}
send_request_get_response(location.href + 'mask_visualization_data', mask_visualization_data);







function initialise_plotly_chart(response, nameslist, infostructure) {
    console.log("RESPONSE - FORM:",response, Object.values(response)[0])
    console.log("RESPONSE - STYLE:",response.style)
    console.log("RESPONSE - YEAR:",response.year)
    console.log("RESPONSE - TITLES:",response.titles)
    nameslistNoUnderbar = [];

    for (i=0; i<nameslist.length; i++) {
        nameslistNoUnderbar.push(nameslist[i].replaceAll("_", " "));
    }

    function RGBAToHex(r, g, b, a) {
      r = Math.floor(r * 255);
      g = Math.floor(g * 255);
      b = Math.floor(b * 255);
      a = Math.floor(a * 255);
    
      var rHex = ("0" + r.toString(16)).slice(-2);
      var gHex = ("0" + g.toString(16)).slice(-2);
      var bHex = ("0" + b.toString(16)).slice(-2);
      var aHex = ("0" + a.toString(16)).slice(-2);
    
      return "#" + rHex + gHex + bHex + aHex;
    }
    

    x_axis_form = [];
    y_axis_form = [];
    colors_form = [];

    x_axis_style = [];
    y_axis_style = [];
    colors_style = [];

    x_axis_year = [];
    y_axis_year = [];
    colors_year = [];
    
    symbol = [];
    if (typeof(response.form) != "undefined") {
      //FOR ALPHA & BETA POLE
      // document.getElementsByClassName("user-select-none")[0].classList.remove("hidden");
      
      for (i=0; i<response.form.coordinates.length; i++) {
        x_axis_form.push(response.form.coordinates[i][0]);
        y_axis_form.push(response.form.coordinates[i][1]);
        colors_form.push(RGBAToHex(response.form.colors[i][0],response.form.colors[i][1],response.form.colors[i][2],response.form.colors[i][3]));
      }

      for (i=0; i<response.style.coordinates.length; i++) {
        x_axis_style.push(response.style.coordinates[i][0]);
        y_axis_style.push(response.style.coordinates[i][1]);
        colors_style.push(RGBAToHex(response.style.colors[i][0],response.style.colors[i][1],response.style.colors[i][2],response.style.colors[i][3]));
      }
      
      for (i=0; i<response.year.coordinates.length; i++) {
        x_axis_year.push(response.year.coordinates[i][0]);
        y_axis_year.push(response.year.coordinates[i][1]);
        colors_year.push(RGBAToHex(response.year.colors[i][0],response.year.colors[i][1],response.year.colors[i][2],response.year.colors[i][3]));
        
      }
      console.log(colors_year);
    } 
    // else if (typeof(response.hh) == "undefined") {
    //   for (i=0; i<response.length; i++) {
    //      x_axis.push(response[i][0]);
    //      y_axis.push(response[i][1]);
    //      cminst_color.push(0.5);
    //    }
    // }
    customdata = [];
    for (i=0; i<Object.keys(infostructure).length; i++) {
      customdata.push("Style: "+infostructure[Object.keys(infostructure)[i]].style+"<br>Tonality: "+infostructure[Object.keys(infostructure)[i]].tonality+"</br>");
    }

    var myPlot = d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows) {

  // Create initial trace
  var trace1 = {
    x: x_axis_form,
    y: y_axis_form,
    mode: 'markers',
    marker: {
      opacity: 0.8,
      size: 4,
      color: colors_form,
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
    { text: 'Form', value: 'form_selector' },
    { text: 'Style', value: 'style_selector' },
    { text: 'Year', value: 'year_selector' }
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
    if (selectedTrace === 'form_selector') {
      newTrace = {
        x: x_axis_form,
        y: y_axis_form,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 4,
          color: colors_form,
        },
        hovertemplate: '<br>%{text}</br>' +
          '<b>%{customdata}</b>' +
          "<extra></extra>",
        customdata: customdata,
        text: nameslistNoUnderbar,
        type: 'scatter'
      };
    } else if (selectedTrace === 'style_selector') {
      // Define the properties of the second trace
      newTrace = {
        x: x_axis_style,
        y: y_axis_style,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 4,
          color: colors_style,
        },
        hovertemplate: '<br>%{text}</br>' +
          '<b>%{customdata}</b>' +
          "<extra></extra>",
        customdata: customdata,
        text: nameslistNoUnderbar,
        type: 'scatter'
      };
    } else if (selectedTrace === 'year_selector') {
      // Define the properties of the third trace
      newTrace = {
        x: x_axis_year,
        y: y_axis_year,
        mode: 'markers',
        marker: {
          opacity: 0.8,
          size: 4,
          color: colors_year,
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
