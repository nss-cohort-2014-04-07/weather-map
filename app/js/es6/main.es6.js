/* jshint unused:false, camelcase:false */
/* global AmCharts:true, google:true */

(function(){
  'use strict';

  $(document).ready(init);

  let map;
  let charts = {};

  function init(){
    initMap(36, -86, 2);
    $('#add').click(add);
  }

  function add(){
    let zip = $('#zip').val().trim();
    getWeather(zip);
    geocode(zip);
  }

  function getWeather(zip){
    let url = `http://api.wunderground.com/api/aad218fcd659a15a/forecast10day/q/${zip}.json?callback=?`;
    $.getJSON(url, data=>{
      $('#graphs').append(`<div class=graph data-zip=${zip}></div>`);
      initGraph(zip);
      data.forecast.simpleforecast.forecastday.forEach(f=>charts[zip].dataProvider.push({day: f.date.weekday, low: f.low.fahrenheit, high: f.high.fahrenheit}));
      charts[zip].validateData();
    });
  }

  function geocode(zip){
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: zip}, (results, status)=>{
      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    });
  }

  function addMarker(lat, lng, name){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name});
  }

  function initMap(lat, lng, zoom){
    let styles = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#ffdfa6'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#b52127'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#c5531b'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#74001b'},{'lightness':-10}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#74001b'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'#990c19'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#74001b'},{'lightness':-8}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#6a0d10'},{'visibility':'on'}]},{'featureType':'administrative','elementType':'geometry','stylers':[{'color':'#ffdfa6'},{'weight':0.4}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function initGraph(zip){
    let graph = $(`.graph[data-zip=${zip}]`)[0];
    charts[zip] = AmCharts.makeChart(graph, {
    'type': 'serial',
    'theme': 'chalk',
    'pathToImages': 'http://www.amcharts.com/lib/3/images/',
    'titles': [{
        'text': zip,
        'size': 15
    }],
    'dataProvider': [],
    'valueAxes': [{
        'id':'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
    }],
    'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Low Temperature',
        'valueField': 'low',
        'fillAlphas': 0
    }, {
        'valueAxis': 'v1',
        'lineColor': '#B0DE09',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'High Temperature',
        'valueField': 'high',
        'fillAlphas': 0
    }],
    'chartCursor': {
        'cursorPosition': 'mouse'
    },
    'categoryField': 'day',
    'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true,
        'labelRotation': 45
    }
    });
  }
})();
