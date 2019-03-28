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
      }
    ],
    taxNumberRange: [1,2,3,4,5,6,7,8,9,10,11,12],
    selectedType: '',
    selectedNumber: '',
    finalData: []
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
    const {salary, insurance, deduct} = e.detail.value;
    const num_salary = Number(salary) || 0;
    const num_insurance = Number(insurance) || 0;
    const num_deduct = Number(deduct) || 0;
    console.log(salary);
    const reg = /^(([0-9]|([1-9]\d+))(.\d+)?)$/;
    if(!reg.test(salary)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的薪资',
      })
      return;
    }
    if (!reg.test(insurance)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的五险一金',
      })
      return;
    }
    if (!reg.test(deduct)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的附加扣除',
      })
      return;
    }
    if(num_salary - num_insurance - num_deduct < 0) {
      wx.showModal({
        title: '提示',
        content: '扣除后薪资小于0',
      })
      return;
    }
    const result = this.calculateSalary(num_salary, num_insurance, num_deduct);
    this.setData({
      'finalData': result
    });
  },
  calculateSalary: function(salary, insurance, deduct) {
    let totalSalary = 0;
    const arr = [];
    const taxArr = [];
    const pureSalary = salary - insurance - deduct;
    if(pureSalary <= 0) {
      wx.showModal({
        title: '提示',
        content: '您无需纳税'
      })
    } else {
      for (let i = 0; i < 11; i++) {
        totalSalary += pureSalary;
        let tax = 0;
        if(totalSalary <= 36000) {
          tax = totalSalary * 0.03;
        } else if(totalSalary > 36000 && totalSalary <= 144000) {
          tax = totalSalary * 0.1 - 2520;
        } else if(totalSalary > 144000 && totalSalary <= 300000) {
          tax = totalSalary * 0.2 - 16920;
        } else if(totalSalary > 300000 && totalSalary <= 420000) {
          tax = totalSalary * 0.25 - 31920;
        } else if(totalSalary > 420000 && totalSalary <= 660000) {
          tax = totalSalary * 0.3 - 52920;
        } else if(totalSalary > 660000 && totalSalary <= 960000) {
          tax = totalSalary * 0.35 - 85920;
        } else {
          tax = totalSalary * 0.45 - 181920;
        }
        if(i === 0) {
          taxArr.push(tax);
        } else {
          const nowTax = taxArr.reduce((previous, current) => {
            return previous - current;
          }, tax);
          taxArr.push(nowTax);
        }
        arr.push({
          'originSalary': salary,
          'insurance': insurance,
          'deduct': deduct,
          'tax': taxArr[i],
          'handSalary': pureSalary - taxArr[i]
        });
      }
    }
    console.log(arr);
    return arr;
  },
  onLoad: function () {
    console.log(1234);
  }
})
