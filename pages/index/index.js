//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    typeRange: [
      {
        name: '工薪所得',
        id: 'monthSalary'
      },
      {
        name: '年终奖',
        id: 'yearReword'
      }
    ],
    taxNumberRange: [1,2,3,4,5,6,7,8,9,10,11,12],
    selectedType: '',
    selectedNumber: ''
  },
  //事件处理函数
  bindTypeChange: function(e){
    console.log(e);
    this.setData({
      selectedType: e.detail.value
    })
  },
  bindNumChange: function(e) {
    this.setData({
      selectedNumber: e.detail.value
    })
  },
  submitForm: function(e){
    console.log(e.detail.value);
    const value = e.detail.value;
    const type = value.type ? this.data.typeRange[value.type].id : '';
    console.log({type})
  },
  onLoad: function () {
    console.log(1234);
  }
})
