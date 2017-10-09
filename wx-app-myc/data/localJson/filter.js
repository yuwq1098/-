// 排序类型列表
const SortTypeList = [
  {
    label: '默认排序',
    isChecked: true,
    value: '-1',
  },
  {
    label: "价格最低",
    value: '价格最低',
  },
  {
    label: "价格最高",
    value: '价格最高',
  },
  {
    label: "车龄最短",
    value: '车龄最短',
  },
  {
    label: "里程最少",
    value: '里程最少',
  },
  {
    label: "最新上架",
    value: '最近更新',
  },
  {
    label: "最新发布",
    value: '最新发布',
  }
]

// 排放标准
const DischargeStandard = [
  {
    label: '不限',
    isChecked: true,
    value: '-1',
  },
  {
    label: "国5",
    value: '5',
  },
  {
    label: "国4",
    value: '4',
  },
  {
    label: "国3（不包含国3以下）",
    value: '3',
  }
  // {
  //   label: "国2",
  //   value: '2',
  // },
  // {
  //   label: "国1",
  //   value: '1',
  // }
]

// 搜索价格范围
const SearchPriceRange = [
  {
    label: '不限价格',
    isChecked: true,
    min: "",
    max: "",
  },
  {
    label: '5万以内',
    min: 0,
    max: 5,
  },
  {
    label: '5-10万',
    min: 5,
    max: 10,
  },
  {
    label: '10-15万',
    min: 10,
    max: 15,
  },
  {
    label: '15-20万',
    min: 15,
    max: 20,
  },
  {
    label: '20-30万',
    min: 20,
    max: 30,
  },
  {
    label: '30-50万',
    min: 30,
    max: 50,
  },
  {
    label: '50-100万',
    min: 50,
    max: 100,
  },
  {
    label: '100万以上',
    min: 100,
    max: 9999
  },
]

module.exports = {
  SortTypeList,
  DischargeStandard,
  SearchPriceRange,
}