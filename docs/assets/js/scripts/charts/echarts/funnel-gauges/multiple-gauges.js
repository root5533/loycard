/*=========================================================================================
    File Name: multiple-gauge.js
    Description: echarts multiple gauge chart
    ----------------------------------------------------------------------------------------
    Item Name: Stack - Responsive Admin Theme
    Version: 2.1
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
// Multiple gauge chart
// ------------------------------
$(window).on("load", function () {
    // Set paths
    // ------------------------------
    require.config({
        paths: {
            echarts: '../../../app-assets/vendors/js/charts/echarts'
        }
    });
    // Configuration
    // ------------------------------
    require([
        'echarts',
        'echarts/chart/funnel',
        'echarts/chart/gauge'
    ], 
    // Charts setup
    function (ec) {
        // Initialize chart
        // ------------------------------
        var myChart = ec.init(document.getElementById('multiple-gauge'));
        // Chart Options
        // ------------------------------
        multigaugeOptions = {
            // Add tooltip
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            // Add toolbox
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            // Enable drag recalculate
            calculable: true,
            // Add series
            series: [
                {
                    name: 'Speed',
                    type: 'gauge',
                    z: 3,
                    min: 0,
                    max: 220,
                    splitNumber: 11,
                    axisLine: {
                        lineStyle: {
                            width: 10
                        }
                    },
                    axisTick: {
                        length: 15,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    title: {
                        textStyle: {
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'italic'
                        }
                    },
                    detail: {
                        textStyle: {
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: 40, name: 'km/h' }]
                },
                {
                    name: 'Rotating speed',
                    type: 'gauge',
                    center: ['15%', '55%'],
                    radius: '50%',
                    min: 0,
                    max: 7,
                    endAngle: 45,
                    splitNumber: 7,
                    axisLine: {
                        lineStyle: {
                            width: 8
                        }
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width: 5
                    },
                    title: {
                        offsetCenter: [0, '-30%'],
                    },
                    detail: {
                        textStyle: {
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: 1.5, name: 'x1000 r/min' }]
                },
                {
                    name: 'Fuel meter',
                    type: 'gauge',
                    center: ['85%', '50%'],
                    radius: '50%',
                    min: 0,
                    max: 2,
                    startAngle: 135,
                    endAngle: 45,
                    splitNumber: 2,
                    axisLine: {
                        lineStyle: {
                            color: [[0.2, '#ff4500'], [0.8, '#48b'], [1, '#228b22']],
                            width: 8
                        }
                    },
                    axisTick: {
                        splitNumber: 5,
                        length: 10,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        formatter: function (v) {
                            switch (v + '') {
                                case '0': return 'E';
                                case '1': return 'Gas';
                                case '2': return 'F';
                            }
                        }
                    },
                    splitLine: {
                        length: 15,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width: 2
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [{ value: 0.5, name: 'gas' }]
                },
                {
                    name: 'Meter',
                    type: 'gauge',
                    center: ['85%', '50%'],
                    radius: '50%',
                    min: 0,
                    max: 2,
                    startAngle: 315,
                    endAngle: 225,
                    splitNumber: 2,
                    axisLine: {
                        lineStyle: {
                            color: [[0.2, '#ff4500'], [0.8, '#48b'], [1, '#228b22']],
                            width: 8
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function (v) {
                            switch (v + '') {
                                case '0': return 'H';
                                case '1': return 'Water';
                                case '2': return 'C';
                            }
                        }
                    },
                    splitLine: {
                        length: 15,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width: 2
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [{ value: 0.5, name: 'gas' }]
                }
            ]
        };
        // Apply options
        // ------------------------------
        myChart.setOption(multigaugeOptions);
        // Resize chart
        // ------------------------------
        $(function () {
            // Resize chart on menu width change and window resize
            $(window).on('resize', resize);
            $(".menu-toggle").on('click', resize);
            // Resize function
            function resize() {
                setTimeout(function () {
                    // Resize chart
                    myChart.resize();
                }, 200);
            }
            clearInterval(timeTicket);
            var timeTicket = setInterval(function () {
                multigaugeOptions.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                multigaugeOptions.series[1].data[0].value = (Math.random() * 7).toFixed(2) - 0;
                multigaugeOptions.series[2].data[0].value = (Math.random() * 2).toFixed(2) - 0;
                multigaugeOptions.series[3].data[0].value = (Math.random() * 2).toFixed(2) - 0;
                myChart.setOption(multigaugeOptions, true);
            }, 2000);
        });
    });
});
