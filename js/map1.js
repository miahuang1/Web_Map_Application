mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 3, // starting zoom
            center: [-100, 40], // starting center
            projection: 'albers'

        });

        // load data and add as layer
        async function geojsonFetch() {
            let response = await fetch('assets/us-covid-2020-rates.json');
            let state_data = await response.json();

            map.on('load', function loadingData() {
                map.addSource('state_data', {
                    type: 'geojson',
                    data: state_data
                });

                map.addLayer({
                    'id': 'covidrates-layer',
                    'type': 'fill',
                    'source': 'state_data',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0',   // stop_output_0
                            10,          // stop_input_0
                            '#FED976',   // stop_output_1
                            20,          // stop_input_1
                            '#FEB24C',   // stop_output_2
                            50,          // stop_input_2
                            '#FD8D3C',   // stop_output_3
                            100,         // stop_input_3
                            '#FC4E2A',   // stop_output_4
                            200,         // stop_input_4
                            '#E31A1C',   // stop_output_5
                            500,         // stop_input_5
                            '#BD0026',   // stop_output_6
                            1000,        // stop_input_6
                            "#800026"    // stop_output_7
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0-60',
                    '61-120',
                    '121-180',
                    '181-240',
                    '241-300',
                    '301-360',
                    '361-420',
                    '421 and more'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70',
                    '#E31A1C70',
                    '#BD002670',
                    '#80002670'
                ];

                // create legend
                const legend = document.getElementById('legend');
                legend.innerHTML = "<b>Covid Infection Rates Per 1,000<br>(people/sq.mi.)</b><br><br>";


                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            legend.innerHTML = legend.innerHTML + '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/jakobzhao/geog458/tree/master/labs/lab03/assets/">jakobzhao/geog458</a></p>';
            });

            map.on('mousemove', ({point}) => {
                const state = map.queryRenderedFeatures(point, {
                    layers: ['covidrates-layer']
                });
                document.getElementById('text-description').innerHTML = state.length ?
                    `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</Covid Infection Rates</em></p>` :
                    `<p>Hover over a state!</p>`;
            });
        }
        geojsonFetch();
