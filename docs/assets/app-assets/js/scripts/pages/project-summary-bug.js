/*=========================================================================================
    File Name: project-summary-task.js
    Description: Project Summary Page JS
    ----------------------------------------------------------------------------------------
    Item Name: Stack - Responsive Admin Theme
    Version: 2.1
    Author: Pixinvent
    Author URL: hhttp://www.themeforest.net/user/pixinvent
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
    // Bug charts setup
    function (ec) {
        // Initialize chart
        // ------------------------------
        var bugChart = ec.init(document.getElementById('bug-pie-chart'));
        // Chart Options
        // ------------------------------
        chartOptions = {
            // Add tooltip
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // Add legend
            legend: {
                orient: 'horizontal',
                x: 'left',
                data: ['Critical', 'High', 'Medium', 'Low', 'Resolved', 'Closed']
            },
            // Add custom colors
            color: ['#FECEA8', '#FF847C', '#E84A5F', '#759773', '#99B898', '#afc8ae'],
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
                        { value: 5, name: 'Critical' },
                        { value: 10, name: 'High' },
                        { value: 15, name: 'Medium' },
                        { value: 20, name: 'Low' },
                        { value: 22, name: 'Resolved' },
                        { value: 38, name: 'Closed' }
                    ]
                }]
        };
        // Apply options
        // ------------------------------
        bugChart.setOption(chartOptions);
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
                    bugChart.resize();
                }, 200);
            }
        });
    });
});
