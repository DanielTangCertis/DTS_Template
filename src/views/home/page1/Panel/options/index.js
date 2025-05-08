import * as echarts from 'echarts'
export const option1 = () => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#ffffff'
        }
      }
    },
    legend: {
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      data: ['流入人口', '流出人口'],
      right: '4%',
      fontSize: 12,
      color: '#ffffff'
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      top: '22%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#fff',
          fontSize: 10,
          interval: 0
        },
        axisLine: {
          lineStyle: {
            color: '#DDD'
          }
        },
        data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '单位(万人)',
        min: 40,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#DDD'
          }
        },
        axisLabel: {
          margin: 5,
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#DDD'
          }
        }
      }
    ],
    series: [
      {
        name: '流入人口',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            1,
            0,
            [
              {
                offset: 0,
                color: 'rgba(16,97,204, 0.3)'
              },
              {
                offset: 0.8,
                color: 'rgba(17,235,210, 0)'
              }
            ],
            false
          ),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(82, 131, 98)'
            },
            {
              offset: 1,
              color: 'rgba(17,235,210,1)'
            }
          ])
        },
        emphasis: {
          color: 'rgb(0,196,132)',
          borderColor: 'rgba(0,196,132,0.2)',
          extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
          borderWidth: 10
        },
        data: [57.9, 65.2, 71.2, 110, 89.5, 92, 98.44]
      },
      {
        name: '流出人口',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(24, 54, 1, 0.5)'
              },
              {
                offset: 0.8,
                color: 'rgba(235,235,21, 0)'
              }
            ],
            false
          ),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(24, 54, 1,1)'
            },
            {
              offset: 1,
              color: 'rgba(235,235,21,1)'
            }
          ])
        },
        emphasis: {
          color: 'rgb(99,250,235)',
          borderColor: 'rgba(99,250,235,0.2)',
          extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
          borderWidth: 10
        },
        data: [47.9, 120, 61.2, 68.3, 79.5, 52, 88.44]
      }
    ]
  }
}

export const option2 = () => {
  const data = [
    {
      name: '吴中区',
      value: 2231
    },
    {
      name: '太仓市',
      value: 809.93
    },
    {
      name: '姑苏区',
      value: 83.4
    },
    {
      name: '常熟市',
      value: 1276.32
    },
    {
      name: '吴江区',
      value: 1176
    },
    {
      name: '张家港市',
      value: 999
    },
    {
      name: '昆山市',
      value: 931
    },
    {
      name: '相城区',
      value: 489
    },
    {
      name: '虎丘区',
      value: 332
    }
  ]

  return {
    color: ['#385802', '#31C5C0', '#1E9BD1', '#0F347B', '#585247', '#7F6AAD', 'rgba(250,250,250,0.3)', '#1c3703'],
    title: {
      text: '总面积：8657.32km²',
      subtext: '',

      textStyle: {
        color: '#f2f2f2',
        fontSize: 14
      },
      subtextStyle: {
        fontSize: 11,

        color: ['#ff9d19']
      },

      x: 'center',
      y: '1%'
    },

    grid: {
      top: 100,
      left: 50,
      right: '5%'
    },
    legend: {
      // orient: 'vertical',
      bottom: 20,
      left: '5%',
      textStyle: {
        color: '#f2f2f2',
        fontSize: 10
      },
      icon: 'roundRect',
      data: data
    },
    series: [
      // 主要展示层的
      {
        radius: ['20%', '51%'],
        center: ['40%', '40%'],
        type: 'pie',
        label: {
          show: true,
          formatter: '{c}',
          fontSize: 10,
          color: '#fff',

          position: 'outside'
        },
        emphasis: {
          show: true,
          labelLine: {
            show: true
          },
          label: {
            show: true
          }
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 25
        },
        name: '民警训练总量',
        data: data
      },
      // 边框的设置
      {
        radius: ['20%', '24%'],
        center: ['40%', '40%'],
        type: 'pie',
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        animation: false,
        tooltip: {
          show: false
        },
        data: [
          {
            value: 1,
            itemStyle: {
              color: 'rgba(250,250,250,0.3)'
            }
          }
        ]
      },
      {
        name: '外边框',
        type: 'pie',
        clockwise: false, //顺时加载
        // hoverAnimation: false, //鼠标移入变大
        center: ['40%', '40%'],
        radius: ['55%', '55%'],
        label: {
          show: false
        },
        data: [
          {
            value: 9,
            name: '',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#0b5263'
            }
          }
        ]
      }
    ]
  }
}

export const option3 = () => {
  var nameArr = ['昆山市', '工业园区', '张家港市', '常熟市', '吴江区', '虎丘区']
  var dataArr = [4748.06, 3330.26, 3030.21, 2700, 2224.53, 1650]
  var maxData = [] //背景按最大值
  var minData = [] //左侧边框
  for (let i = 0; i < dataArr.length; i++) {
    var item = dataArr[i]
    maxData.push(10000 - item)
    minData.push(1)
  }
  return {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '2%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        return params[0].name + ' : ' + params[0].value
      }
    },
    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          verticalAlign: 'center', //文字垂直对其方式
          color: '#fff',
          fontSize: '12'
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: nameArr
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        stack: 1,
        zlevel: 1,
        barWidth: '20%',
        barGap: '-150%',
        itemStyle: {
          color: 'rgba(28, 204, 254,1)'
        },
        data: dataArr
      },
      {
        name: '左侧',
        type: 'bar',
        zlevel: 2,
        barWidth: '25%',
        barGap: '-150%',
        data: minData,
        itemStyle: {
          color: '#fff'
        }
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: '20%',
        stack: 1,
        data: maxData,
        itemStyle: {
          color: 'rgba(43, 143, 179,.5)'
        }
      }
    ]
  }
}

export const option4 = () => {
  return {
    legend: {
      top: '20',
      x: 'center',
      textStyle: {
        fontSize: 12,
        color: 'rgba(101, 213, 255, 1)'
      },
      icon: 'path://M512 881.777778 512 881.777778C716.222629 881.777778 881.777778 716.222629 881.777778 512 881.777778 307.777371 716.222629 142.222222 512 142.222222 307.777373 142.222222 142.222222 307.777371 142.222222 512 142.222222 716.222629 307.777373 881.777778 512 881.777778L512 881.777778ZM512 1024 512 1024C229.230208 1024 0 794.769789 0 512 0 229.230211 229.230208 0 512 0 794.769789 0 1024 229.230211 1024 512 1024 794.769789 794.769789 1024 512 1024L512 1024Z',
      itemWidth: 8, // 设置宽度
      itemHeight: 8, // 设置高度、
      itemGap: 12 // 设置间距
    },
    tooltip: {
      show: true,
      trigger: 'axis', //axis , item
      backgroundColor: 'RGBA(0, 49, 85, 1)',
      borderColor: 'rgba(0, 151, 251, 1)',
      borderWidth: 1,
      borderRadius: 0,
      textStyle: {
        color: '#BCE9FC',
        fontSize: 12,
        align: 'left'
      }
    },
    grid: {
      right: '0%',
      top: '5%',
      left: '5%',
      bottom: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: ['昆山市', '常熟市', '吴江区', '张家港市', '吴中区'],
      axisLabel: {
        //坐标轴刻度标签的相关设置。
        interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
        //	margin:15,
        color: '#65D5FF',
        fontStyle: 'normal',
        fontSize: 12
      },
      axisTick: {
        //坐标轴刻度相关设置。
        show: false
      },
      axisLine: {
        //坐标轴轴线相关设置
        lineStyle: {
          color: 'rgba(77, 128, 254, 0.2)'
        }
      },
      splitLine: {
        //坐标轴在 grid 区域中的分隔线。
        show: true,
        lineStyle: {
          color: 'rgba(77, 128, 254, 0.2)'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        splitNumber: 3,
        axisLabel: {
          color: '#65D5FF',
          fontStyle: 'normal',
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(77, 128, 254, 0.2)'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'pictorialBar',
        barWidth: '60%',
        stack: '总量',
        label: {
          show: false
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 151, 251, 1)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(0, 34, 66, 0.2)' // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          } //渐变颜色
        },
        symbol: 'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

        data: [23, 84, 101, 74, 87]
      },
      {
        name: ' ',
        type: 'pictorialBar',
        barWidth: '60%',
        stack: '总量',
        label: {
          show: false
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(48, 236, 166, 1)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(0, 34, 66, 0.2)' // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          } //渐变颜色
        },
        symbol: 'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

        data: [209.2, 167.77, 154.51, 143.16, 138.96]
      }
    ]
  }
}

export const option5 = () => {
  var data = [
    [
      [28604, 77, 17096869, 'Australia', 1990],
      [31163, 77.4, 27662440, 'Canada', 1990],
      [1516, 68, 1154605773, 'China', 1990],
      [13670, 74.7, 10582082, 'Cuba', 1990],
      [28599, 75, 4986705, 'Finland', 1990],
      [29476, 77.1, 56943299, 'France', 1990],
      [31476, 75.4, 78958237, 'Germany', 1990],
      [28666, 78.1, 254830, 'Iceland', 1990],
      [1777, 57.7, 870601776, 'India', 1990],
      [29550, 79.1, 122249285, 'Japan', 1990],
      [2076, 67.9, 20194354, 'North Korea', 1990],
      [12087, 72, 42972254, 'South Korea', 1990],
      [24021, 75.4, 3397534, 'New Zealand', 1990],
      [43296, 76.8, 4240375, 'Norway', 1990],
      [10088, 70.8, 38195258, 'Poland', 1990],
      [19349, 69.6, 147568552, 'Russia', 1990],
      [10670, 67.3, 53994605, 'Turkey', 1990],
      [26424, 75.7, 57110117, 'United Kingdom', 1990],
      [37062, 75.4, 252847810, 'United States', 1990]
    ],
    [
      [44056, 81.8, 23968973, 'Australia', 2015],
      [43294, 81.7, 35939927, 'Canada', 2015],
      [13334, 76.9, 1376048943, 'China', 2015],
      [21291, 78.5, 11389562, 'Cuba', 2015],
      [38923, 80.8, 5503457, 'Finland', 2015],
      [37599, 81.9, 64395345, 'France', 2015],
      [44053, 81.1, 80688545, 'Germany', 2015],
      [42182, 82.8, 329425, 'Iceland', 2015],
      [5903, 66.8, 1311050527, 'India', 2015],
      [36162, 83.5, 126573481, 'Japan', 2015],
      [1390, 71.4, 25155317, 'North Korea', 2015],
      [34644, 80.7, 50293439, 'South Korea', 2015],
      [34186, 80.6, 4528526, 'New Zealand', 2015],
      [64304, 81.6, 5210967, 'Norway', 2015],
      [24787, 77.3, 38611794, 'Poland', 2015],
      [23038, 73.13, 143456918, 'Russia', 2015],
      [19360, 76.5, 78665830, 'Turkey', 2015],
      [38225, 81.4, 64715810, 'United Kingdom', 2015],
      [53354, 79.1, 321773631, 'United States', 2015]
    ]
  ]

  return {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      top: '2%',
      containLabel: true
    },
    title: {
      // text: '人口流入流出'
    },
    legend: {
      right: 10,
      data: ['流出', '流入']
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#00FFFF'
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#00FFFF'
      },
      scale: true
    },
    series: [
      {
        name: '流出',
        data: data[0],
        type: 'scatter',
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2
        },
        label: {},
        emphasis: {
          label: {
            show: true,
            formatter: function (param) {
              return param.data[3]
            },
            position: 'top'
          }
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {
              offset: 0,
              color: 'rgb(0, 255, 255)'
            },
            {
              offset: 1,
              color: 'rgb(0, 245, 245)'
            }
          ])
        }
      },
      {
        name: '流入',
        data: data[1],
        type: 'scatter',
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2
        },
        label: {},
        emphasis: {
          label: {
            show: true,
            formatter: function (param) {
              return param.data[3]
            },
            position: 'top'
          }
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(25, 100, 150, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {
              offset: 0,
              color: 'rgb(36, 155, 121)'
            },
            {
              offset: 1,
              color: 'rgb(25, 183, 207)'
            }
          ])
        }
      }
    ]
  }
}
