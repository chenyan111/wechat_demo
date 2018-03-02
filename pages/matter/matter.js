// pages/matter/matter.js

Page({
  data: {
    currentyear: new Date().getFullYear(),
    currentmonth: new Date().getMonth()+1,
    currentday: new Date().getDate(),
    firstflag:true,
    secondflag:false,
    thirdflag:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.gettime();  
     this.get_eventlist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  clickbtn:function(e){
    var year = e.currentTarget.dataset.year;
    var month = e.currentTarget.dataset.month;
    var info = new Date(year, parseInt(month) - 1, 1);
    this.gettime(info);
  },
  clickdata:function(e){
    var index = e.currentTarget.dataset.index;
    var obj=this.data.msg[index];
    
    var selected=[];
    selected['year']=obj.year;
    selected['month'] = obj.month;
    selected['day'] = obj.info;
    var select_text = selected['year'] + '年' + selected['month']+'月' + selected['day']+'日';
    this.setData({
      selected: selected,
      select_text: select_text
    });
    
    this.gettime(new Date(selected['year'], parseInt(selected['month']) - 1, selected['day']));
    // console.log(this.data);     
    this.get_eventlist();
  },
  click_animate:function(){
    var animation=wx.createAnimation({
      duration:300         //动画持续时间
    });
    animation.translateY('-100%').step();
    this.setData({
      animation: animation.export()
    })

  },
  click_cancel:function(){
    var animation = wx.createAnimation({
      duration: 300         //动画持续时间
    });
    animation.translateY('100%').step();
    this.setData({
      animation: animation.export()
    })

  },
  click_circle:function(e){
   var a = e.currentTarget.dataset.level
   this.setData({
     [a]: true
   });
   if (a =='firstflag'){
     this.setData({
       secondflag:false,
       thirdflag: false
     });
   } else if (a == 'secondflag'){
     this.setData({
       firstflag: false,
       thirdflag: false
     });
   }else{
     this.setData({
       firstflag: false,
       secondflag: false
     });
   }

  },
  input_title:function(e){
   
    var value=e.detail.value;
    this.setData({ title_value: value});

  },
  input_content:function(e){
    
    var value = e.detail.value;
    this.setData({ content_value: value });
  },
  click_keep:function(){
  
    if (this.data.title_value && this.data.content_value){
      var record = {};
      record.id = this.data.select_text;
      record.title_value = this.data.title_value;
      record.content_value = this.data.content_value;
      record.flag = this.data.firstflag ? 'firstflag' : '' || this.data.secondflag ? 'secondflag' : '' || this.data.thirdflag ? 'thirdflag' : '';
      var arr = wx.getStorageSync('arr')||[];
      record.key = arr.length;
      arr.push(record);
      wx.setStorageSync('arr', arr);
      
      this.setData({
        title_value:"",
        content_value: "",
        firstflag: true,
        secondflag: false,
        thirdflag: false
      });
      console.log(this.data);
      this.get_eventlist();
      this.click_cancel();
    }else{
      wx.showToast({
        title: '请将内容及标题填写完整',
        icon:'none',
        duration:2000,
      })




    }
  },
  click_remove:function(e){
    var key=e.currentTarget.dataset.key;
    var arr = wx.getStorageSync('arr');
    var that=this;
    wx.showActionSheet({
      itemList: ['详情', '删除'],
      success: function (res) {
        // console.log(res.tapIndex);
        if (res.tapIndex){        //删除
            for(var n=0;n<arr.length;n++){
              if(key==arr[n].key){
                 arr.splice(n,1);
              }
            }
            wx.setStorageSync('arr', arr);
            that.get_eventlist();
           

        }else{                    //详情
           wx.navigateTo({
             url: '../detail/detail?key='+key,
           })
       


        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  get_eventlist:function(){
    var text = this.data.select_text;
    var record = wx.getStorageSync('arr');
    var data_event = [];

    for (var i = 0; i < record.length; i++) {
      if (text === record[i]['id']) {
        data_event.push(record[i]);

      }
    }
    this.setData({
      data_event: data_event
    });
    // console.log(this.data.data_event);
  },
  gettime:function(e){
    var time = e||new Date();
    var year = time.getFullYear();   //年
    var month = time.getMonth() + 1  //月
    var day = time.getDate()         //日
    var week_day = time.getDay();    //当前星期几
    var month_days = new Date(year, month, 0).getDate(); //当月天数
    time.setDate(1);
    var first_week_day = time.getDay(); //当前显示月份第一天是星期几，周日是数字0
    time.setDate(month_days);
    var last_week_day = time.getDay(); //当前显示月份最后一天是星期几，周日是数字0

    var before_count = '';       //上月当前显示天数
    var next_count = '';       //下月当前显示天数
    var before_month = '';      //上个月
    var before_year = '';       //上一月
    var next_month = '';        //下个月
    var next_year = '';         //下一年

    //上一个月月份
    before_month = month === 1 ? 12 : month - 1;
    //上一个月年份
    before_year = month === 1 ? year - 1 : year;
    //下个月月份
    next_month = month === 12 ? 1 : month + 1;
    //下个月年份
    next_year = month === 12 ? year + 1 : year;

    if (first_week_day != 0) {
      before_count = first_week_day;
    } else {
      before_count = 0;
    }

    if (last_week_day != 6) {
      next_count = 6 - last_week_day;
    } else {
      next_count = 0;
    }

    var sum = month_days + before_count + next_count;
    if (sum <= 35) {
      next_count = next_count + (42 - sum);
    }
    var id = 0;
    var msg = [];
    var selected = this.data.selected || {year:year,month:month,day:day};
    var select_text = selected['year'] + '年' + selected['month'] + '月' + selected['day'] + '日';
  
    
   

    // 上月当前显示日期
    if (before_count > 0) {
      var before_month_days = new Date(before_year, before_month, 0).getDate();    //上个月的天数
      for (var i = 0; i < before_count; i++) {
        msg.unshift({
          id: id,
          year: before_year,
          month: before_month,
          info: before_month_days - i,
          active: (selected['year'] == before_year && selected['month'] == before_month && selected['day'] == before_month_days - i)
        });
        id++;
      }
    
    }

    //本月显示
    for (var i = 0; i < month_days; i++) {
      msg.push({
        id: id,
        year: year,
        month: month,
        info: i + 1,
        active: (selected['year'] == year && selected['month'] == month && selected['day'] == i + 1)
      });
      id++;
    }



    // 下月当前显示日期
    if (next_count > 0) {
      var next_month_days = new Date(next_year, next_month, 0).getDate();    //下个月的天数
      for (var i = 0; i < next_count; i++) {
        msg.push({
          id: id,
          year: next_year,
          month: next_month,
          info: i + 1,
          active: (selected['year'] == next_year && selected['month'] == next_month && selected['day'] == i + 1)
        });
        id++;
      }
    
    }




    this.setData({
      year: year,
      month: month,
      before_year: before_year,
      before_month: before_month,
      next_year: next_year,
      next_month: next_month,
      select_text: select_text,
      msg: msg
    });


  }



})


