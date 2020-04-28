<template>
  <div class='wrap'>
    <!-- <header>
      <img src="../assets/images/back.png" alt="">
    </header> -->
    <div class="toast-wrap" v-show="wzc">
      登录失败，该手机号还未注册I you
    </div>
    <div class="toast-wrap" v-show="zqsjh">
      请输入正确的手机号码
    </div>
    <div class="toast-wrap" v-show="showSucc">
      充值成功
    </div>
    <div class="toast-wrap" v-show="showFail">
      充值失败
    </div>
    <p class="tit">充值帐户</p>
    <div class="login">
      <template v-if="!showInfo">
        <input type="number" placeholder="请输入手机号" v-model="mobileNo"
          oninput='if(value.length>11)value=value.slice(0,11)'>
        <span @click="login">登录账号</span>
      </template>
      <template v-else>
        <div class="info">
          <img :src="infoList.head" alt=""><span>{{infoList.nickName}}</span>
        </div>
        <span @click="ulogin">切换账号</span>
      </template>
    </div>
    <div class="money">
      <div v-for="(item, index) in list" :key="item.value" :class="val == index ? 'active' : 'item'"
        @click="choose(item, index)">
        <span>{{item.imoney}}<img src="../assets/images/diamond.png" /></span>
        <span>{{item.iexchangemoney}}元</span>
      </div>
    </div>

    <div class="pay-way" v-show="payList != '' && mobileNo != ''">
      <ul>
        <li v-for="(pay, index) in payList" :key="pay.cbankid" @click="choosePay(pay, index)">
          <div>
            <img :src="'http://file.vipiyou.com/'+pay.cimgurl" /><span>{{pay.iway}}</span>
          </div>
          <div :class="radio == index ? 'radio-wrap' : 'nradio-wrap'"></div>
        </li>
      </ul>
      <div class="btn-wrap" @click="rechargeBtn">确认支付</div>
    </div>
    <div class="weixin-tip" v-show="showTip">
      <img src="../assets/images/mork.png" alt="" srcset="">
    </div>
  </div>
</template>
<script type="text/javascript">
  $(window).on("load", function () {


  })

</script>
<script>
  import {
    checkMobile,
    czModeList,
    addMoney,
    exchangeList
  } from '@/request/api';
  import {
    Notify
  } from 'vant';
  export default {
    data() {
      return {
        wzc: false,
        zqsjh: false,
        showSucc: false,
        showFail: false,
        val: null,
        mobileNo: '',
        test: '',
        radio: '',
        showInfo: false,
        showTip: false,
        list: [],
        payList: [],
        infoList: [],
        rechargeForm: {
          money: '',
          exchangeId: '',
          mobileNo: '',
          payWayId: '',
          moneyRate: 0,
          osName: 'h5'
        },
        totalTime: 3
      };
    },
    methods: {
      countDown() {
        let clock = window.setInterval(() => {
          this.totalTime--
          if (this.totalTime < 0) {
            window.clearInterval(clock);
            this.totalTime = 3;
            this.wzc = false;
            this.zqsjh = false;
            this.showSucc = false;
            this.showFail = false;
          }
        }, 1000)
      },

      choose(item, index) {
        console.log(item, index)
        this.val = index;
        this.rechargeForm.money = item.iexchangemoney;
        this.rechargeForm.exchangeId = item.cexchangeid;
      },
      choosePay(pay, index) {
        this.radio = index;
        this.rechargeForm.payWayId = pay.iwayid;
      },
      login() {
        if ((/^1[3456789]\d{9}$/.test(this.mobileNo))) {
          checkMobile({
            mobileNo: this.mobileNo
          }).then(res => {
            if (res.data.code == 200) {
              this.infoList = res.data.data;
              this.showInfo = true
              czModeList({
                mobileNo: this.mobileNo,
                cfrom: 'h5'
              }).then(res => {
                this.payList = res.data.data;
                this.rechargeForm.payWayId = this.payList[0].iwayid;
              })
            } else {
              this.wzc = true;
              this.countDown();
            }
          })
        } else {
          this.countDown();
          this.zqsjh = true;
        }
      },
      ulogin() {
        this.showInfo = false;
        this.mobileNo = '';
        this.rechargeForm.mobileNo = '';
      },
      getExchangeList() {
        exchangeList().then(res => {
          this.list = res.data.data
        })
      },
      rechargeBtn() {
        this.rechargeForm.mobileNo = this.mobileNo;
        addMoney(this.rechargeForm).then(res => {
          if (res.data.code == 200) {
            this.countDown();
            this.showSucc = true;
          } else {
            this.countDown();
            this.showFail = true;
          }
        })
      }
    },
    created() {
      this.getExchangeList();

      function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      }
      var isWeixin = is_weixin();
      if (isWeixin) {
        this.showTip = true;
      }
    },
    watch: {
      test(newVal, oldVal) {
        console.log('new', newVal)
        console.log('old', oldVal)
      }
    }
  }

</script>

<style lang='scss' scoped>
  .wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    header {
      width: 100%;
      height: 64px;

      img {
        margin: 32px 0 0 30px;
      }
    }

    .toast-wrap {
      width: 690px;
      height: 96px;
      background: #EE5959;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 96px;
      text-align: center;
      position: absolute;
      top: 20px;
      left: 0;
      right: 0;
      margin: auto;
    }

    .tit {
      font-size: 34px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      padding: 48px 0 0 32px;
    }

    .login {
      width: 696px;
      height: 110px;
      border-bottom: 4px dashed #999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding-right: 66px;
      box-sizing: border-box;

      input {
        width: 210px;
        height: 36px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        line-height: 36px;
      }

      span {
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(239, 71, 105, 1);
      }

      .info {
        span {
          font-size: 28px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          padding-left: 20px;
        }

        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }

    .money {
      width: 696px;
      height: 324px;
      border-bottom: 1px solid #E5E5E5;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-top: 36px;
      box-sizing: border-box;

      .item {
        width: 210px;
        height: 110px;
        background: rgba(243, 241, 246, 1);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 16px 0;
        box-sizing: border-box;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);

        img {
          margin-left: 6px;
        }

        span:nth-of-type(2) {
          color: #999999;
        }
      }

      .active {
        width: 210px;
        height: 110px;
        background: linear-gradient(90deg, rgba(250, 148, 168, 1) 0%, rgba(255, 89, 105, 1) 100%);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 16px 0;
        box-sizing: border-box;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;

        img {
          margin-left: 6px;
        }
      }
    }

    .pay-way {
      width: 100%;

      ul {
        width: 100%;

        li {
          width: 100%;
          height: 100px;
          padding: 0 60px;
          box-sizing: border-box;
          margin: 18px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-right: 20px;
          }

          .nradio-wrap {
            width: 28px;
            height: 28px;
            background: url('../assets/images/ncheck.png') no-repeat;
            background-size: cover;
          }

          .radio-wrap {
            width: 28px;
            height: 28px;
            background: url('../assets/images/check.png') no-repeat;
            background-size: cover;
          }

        }
      }

      .btn-wrap {
        width: 550px;
        height: 90px;
        background: linear-gradient(90deg, rgba(250, 148, 168, 1) 0%, rgba(255, 89, 105, 1) 100%);
        border-radius: 6px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 90px;
        text-align: center;
        margin: 20px auto;
      }
    }

    .weixin-tip {
      /* display: none; */
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      height: 100%;
      width: 100%;
      z-index: 100;

      img {
        width: 100%;
        height: 300px;
      }
    }
  }

</style>
