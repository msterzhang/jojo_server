const webmaster = document.getElementById("webmaster");

if (webmaster != null) {
    const { createApp, onMounted, ref, onUpdated } = Vue
    const app = createApp({
        delimiters: ["${", "}"],
        compilerOptions: {
            delimiters: ["${", "}"]
        },
        setup() {
            const data = ref(null);
            const error = ref(null);

            function fetchData() {
                fetch(`/v1/api/analytic/view`, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': Cookies.get("Authorization")
                    }
                }).then(res => {
                    if (!res.ok) {
                        const error = new Error(res.statusText);
                        error.json = res.json();
                        throw error;
                    }
                    return res.json();
                })
                    .then(json => {
                        if (json.code == 200) {
                            data.value = json.data;
                        } else {
                            Snackbar.show({ pos: 'top-center', text: json.msg, showAction: false });
                        }
                    })
                    .catch(err => {
                        error.value = err;
                        if (err.json) {
                            return err.json.then(json => {
                                error.value.message = json.message;
                            });
                        }
                    })
            }


            function loadAnalytics() {
                let timeList = new Array(...data.value.analytic_list).map(pairs => pairs["time_key"]).reverse();
                let regList = new Array(...data.value.analytic_list).map(pairs => pairs["day_reg_num"]).reverse();
                let viewList = new Array(...data.value.analytic_list).map(pairs => pairs["day_view_file"]).reverse();
                let fileList = new Array(...data.value.analytic_list).map(pairs => pairs["day_add_file"]).reverse();
                let regOptions = {
                    xaxis: {
                        show: true,
                        categories: timeList,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            }
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                    },
                    yaxis: {
                        show: true,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    },
                    series: [
                        {
                            name: "日激活量",
                            data: regList,
                            color: "#1A56DB",
                        },
                    ],
                    chart: {
                        sparkline: {
                            enabled: false
                        },
                        height: "100%",
                        width: "100%",
                        type: "area",
                        fontFamily: "Inter, sans-serif",
                        dropShadow: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        x: {
                            show: false,
                        },
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            opacityFrom: 0.55,
                            opacityTo: 0,
                            shade: "#1C64F2",
                            gradientToColors: ["#1C64F2"],
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        width: 6,
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        show: false,
                    },
                }

                let viewOptions = {
                    xaxis: {
                        show: true,
                        categories: timeList,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            }
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                    },
                    yaxis: {
                        show: true,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    },
                    series: [
                        {
                            name: "日调用量",
                            data: viewList,
                            color: "#1A56DB",
                        },
                    ],
                    chart: {
                        sparkline: {
                            enabled: false
                        },
                        height: "100%",
                        width: "100%",
                        type: "area",
                        fontFamily: "Inter, sans-serif",
                        dropShadow: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        x: {
                            show: false,
                        },
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            opacityFrom: 0.55,
                            opacityTo: 0,
                            shade: "#1C64F2",
                            gradientToColors: ["#1C64F2"],
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        width: 6,
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        show: false,
                    },
                }
                let fileOptions = {
                    // set the labels option to true to show the labels on the X and Y axis
                    xaxis: {
                        show: true,
                        categories: timeList,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            }
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                    },
                    yaxis: {
                        show: true,
                        labels: {
                            show: true,
                            style: {
                                fontFamily: "Inter, sans-serif",
                                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                            },
                            formatter: function (value) {
                                return value;
                            }
                        }
                    },
                    series: [
                        {
                            name: "日增文件量",
                            data: fileList,
                            color: "#1A56DB",
                        },
                    ],
                    chart: {
                        sparkline: {
                            enabled: false
                        },
                        height: "100%",
                        width: "100%",
                        type: "area",
                        fontFamily: "Inter, sans-serif",
                        dropShadow: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        x: {
                            show: false,
                        },
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            opacityFrom: 0.55,
                            opacityTo: 0,
                            shade: "#1C64F2",
                            gradientToColors: ["#1C64F2"],
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        width: 6,
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        show: false,
                    },
                }

                if (document.getElementById("views-chart") && typeof ApexCharts !== 'undefined') {
                    const viewschart = new ApexCharts(document.getElementById("views-chart"), viewOptions);
                    viewschart.render();
                    const fileschart = new ApexCharts(document.getElementById("files-chart"), fileOptions);
                    fileschart.render();
                    let regs_chart = document.getElementById("regs-chart")
                    if (regs_chart != null) {
                        const regschart = new ApexCharts(regs_chart, regOptions);
                        regschart.render();
                    }

                }
            }
            onUpdated(() => {
                loadAnalytics();
            });

            onMounted(() => {
                fetchData();
            });

            const reF = async () => {
                fetchData();
            };


            return {
                reF,
                data,
            }
        },

    });
    app.mount('#webmaster')
}
