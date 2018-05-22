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
                        max: 2,
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

                this.chart.update({
                    data: [{
                        type: "q",
                        key: "qHyperCube",
                        data: layout.qHyperCube,
                    }],
                    settings: {
                        scales: {
                            y: {
                                data: {fields: ['qMeasureInfo/0', 'qMeasureInfo/1']},
                                invert: true,
                                expand: 0.5
                            },
                            t: {data: {extract: {field: 'qDimensionInfo/0'}}}
                        },
                        components: [{
                            type: 'grid-line',
                            x: 't'
                        }, {
                            type: 'axis',
                            dock: 'left',
                            scale: 'y'
                        }, {
                            type: 'axis',
                            dock: 'bottom',
                            scale: 't',
                            formatter: {
                                type: 'd3-time',
                                format: '%Y-%m'
                            }
                        }, {
                            key: 'lines',
                            type: 'line',
                            data: {
                                extract: {
                                    field: 'qDimensionInfo/0',
                                    props: {
                                        low: {field: 'qMeasureInfo/0'},
                                        high: {field: 'qMeasureInfo/1'}
                                    }
                                }
                            },
                            settings: {
                                coordinates: {
                                    major: {scale: 't'},
                                    minor0: {scale: 'y', ref: 'low'},
                                    minor: {scale: 'y', ref: 'high'}
                                },
                                layers: {
                                    curve: 'monotone',
                                    line: {
                                        show: false
                                    },
                                    area: {}
                                }
                            }
                        }]
                    }
                })
            }
        };

    });

