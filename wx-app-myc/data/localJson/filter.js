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
    label: "国3",
    value: '3',
  },
  {
    label: "国2",
    value: '2',
  },
  {
    label: "国1",
    value: '1',
  }
]

module.exports = {
  SortTypeList,
  DischargeStandard,
}