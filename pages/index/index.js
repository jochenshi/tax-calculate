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
    selectedType: '0',
    selectedNumber: '',
    finalData: [],
    totalTax: '',
    totalPureSalry: ''
  },
  //事件处理函数
  bindTypeChange: function(e){
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
    if (insurance && !reg.test(insurance)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的五险一金',
      })
      return;
    }
    if (deduct && !reg.test(deduct)) {
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
      'finalData': result.salaryArr,
      'totalPureSalary': result.totalPureSalary,
      'totalTax': result.totalTax
    });
  },
  calculateSalary: function(salary, insurance, deduct) {
    let totalSalary = 0;
    let nowTax;
    const arr = [];
    const taxArr = [];
    const pureSalary = salary - insurance - deduct;
    let totalTax = 0;
    let totalPureSalary = 0;
    if(pureSalary <= 5000) {
      for(let i = 0; i < 12; i++) {
        arr.push({
          'originSalary': salary,
          'insurance': insurance,
          'deduct': deduct,
          'tax': 0,
          'handSalary': salary - insurance
        });
        totalPureSalary += (salary - insurance);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const needTaxSalary = pureSalary - 5000;
        totalSalary += needTaxSalary;
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
          nowTax = tax.toFixed(2);
        } else {
          nowTax = taxArr.reduce((previous, current) => {
            return previous - current;
          }, tax).toFixed(2);
        }
        taxArr.push(nowTax);
        totalTax += Number(nowTax);
        totalPureSalary += (salary - insurance - taxArr[i]);
        arr.push({
          'originSalary': salary,
          'insurance': insurance,
          'deduct': deduct,
          'tax': taxArr[i],
          'handSalary': salary - insurance - taxArr[i]
        });
      }
    }
    console.log(arr);
    return {
      'salaryArr': arr,
      'totalTax': totalTax.toFixed(2),
      'totalPureSalary': totalPureSalary.toFixed(2)
    };
  },
  onLoad: function () {
    console.log(1234);
  },
  onShareAppMessage: function() {
    title: '分享'
  }
})
