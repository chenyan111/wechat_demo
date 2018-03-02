var rpn=require("../../utils/rpn.js");
Page({
  data:{
    message:'0',
    arr:[]

  },
  clicknum:function(e){
    if (this.data.message==0){
      this.setData({
        message: e.currentTarget.dataset.num
      })
    }else{
      var str = this.data.message + e.currentTarget.dataset.num
      this.setData({
        message: str
      })
    }    
  },
  numeql:function(){

      if (this.data.message) {
        var origin = this.data.message;
        this.data.result = rpn.calCommonExp(this.data.message);
        this.setData({
          message: this.data.result.toString()
        });
      
        var str = origin + "=" + this.data.result;
      
        var arr = wx.getStorageSync('arr');
        if (!arr){
          arr=[];
        }
        var arr_length=arr.length;
        // arr[arr_length] = str;
        arr[arr_length] = { time: new Date().toLocaleDateString(), str: str}
       
      
        console.log(arr);
        
        wx.setStorageSync('arr', arr);

      }






    





   
  },
  remove:function(){
    this.setData({
      message: 0
    })
  },
  delnum:function(){
  
    if (this.data.message != this.data.result && this.data.message !=0){
      
      var length = this.data.message.length;
      var newmsg = this.data.message.substring(0, length - 1);
      if (newmsg == "") {
        newmsg = 0;
      }
      this.setData({
        message: newmsg
      })

    }else{
    
      this.setData({
        message: 0
      })




    }
    
  
  }

})