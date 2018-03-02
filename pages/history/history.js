Page({
  data:{
    test: ["87+54=141", "141+41=182"]
  },
  onLoad:function(){
    var arr = wx.getStorageSync('arr');
    this.setData({ "arr": arr });
   

  }

})