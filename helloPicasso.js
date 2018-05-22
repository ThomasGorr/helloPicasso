define([
        "./node_modules/picasso.js/dist/picasso",
        "./node_modules/picasso-plugin-q/dist/picasso-q"
    ],
    function (picasso, picassoQ) {
        picasso.use(picassoQ);
        return {
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 1,
                        max: 1,
                    },
                    measure: {
                        uses: "measures",
                        min: 2,
                        max: 2,
                    },
                },
            },
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [
                        {qWidth: 3, qHeight: 1000},
                    ],
                    qSuppressZero: false,
                    qSuppressMissing: true,
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: false
            },
            paint: function ($element, layout) {
                if (!this.chart) {
                    this.chart = picasso.chart({
                        element: $element[0],
                        data: [],
                    });
                }
                console.log("HyperCube", layout.qHyperCube);

                this.chart.update({
                    data: [{
                        type: "q",
                        key: "qHyperCube",
                        data: layout.qHyperCube,
                    }],
                    settings: {
                        scales: {
                            x_axis: {
                                data: {field: 'qMeasureInfo/0'},
                                min: 0,
                                max: 120,
                                expand: 0.1,
                                ticks: {
                                    distance: 100
                                }
                            },
                            y_axis: {
                                data: {field: 'qMeasureInfo/1'},
                                invert: true,
                                expand: 0.1,
                                min: 0,
                                max: 90,
                        },
                        col: {
                            data: {extract: {field: 'qDimensionInfo/0'}},
                            type: 'color'
                        }
                    },
                    components: [
                        {
                            key: 'my_x_axis',
                            type: 'axis',
                            dock: 'bottom',
                            scale: 'x_axis'
                        },
                        {
                            key: 'my_y_axis',
                            type: 'axis',
                            dock: 'left',
                            scale: 'y_axis'
                        },
                        {
                            type: 'legend-cat',
                            dock: 'right',
                            scale: 'col'
                        },
                        {
                            key: 'dim_point',
                            type: 'point',
                            data: {
                                extract: {
                                    field: 'qDimensionInfo/0',
                                    props: {
                                        x: {field: 'qMeasureInfo/0'},
                                        y: {field: 'qMeasureInfo/1'},
                                        group: {field: 'qDimensionInfo/0'}
                                    }
                                }
                            },
                            settings: {
                                x: {scale: 'x_axis'},
                                y: {scale: 'y_axis'},
                                shape: 'circle',
                                size: 1,
                                strokeWidth: 5,
                                stroke: '#fff',
                                opacity: 0.8,
                                fill: {scale: 'col', ref: 'group'}
                            }
                        }
                    ]
                }
            })
            }
        };

    });

