/*=========================================================================================
    File Name: project-summary-task.js
    Description: Project Summary Page JS
    ----------------------------------------------------------------------------------------
    Item Name: Stack - Responsive Admin Theme
    Version: 2.1
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
// Basic pie chart
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
        'echarts/chart/pie',
        'echarts/chart/funnel'
    ], 
    // Charts setup
    function (ec) {
        // Initialize chart
        // ------------------------------
        var myChart = ec.init(document.getElementById('task-pie-chart'));
        // Chart Options
        // ------------------------------
        chartOptions = {
            // Add title
            /*title: {
                text: 'Task progress',
                subtext: 'Open vs Closed Task',
                x: 'center'
            },*/
            // Add tooltip
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // Add legend
            legend: {
                orient: 'horizontal',
                x: 'left',
                data: ['Open', 'Closed']
            },
            // Add custom colors
            color: ['#FECEA8', '#FF847C'],
            // Display toolbox
            toolbox: {
                show: true,
                orient: 'horizontal',
            },
            // Enable drag recalculate
            calculable: true,
            // Add series
            series: [{
                    name: 'Browsers',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '57.5%'],
                    data: [
                        { value: 18, name: 'Open' },
                        { value: 82, name: 'Closed' }
                    ]
                }]
        };
        // Apply options
        // ------------------------------
        myChart.setOption(chartOptions);
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
        });
    });
});
