<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData: {  
	  //以下三个变量为当用户身份从游客——>提问/解答时，各个页面是否要做更新
	  isfirstUpdated:false,
	  isSecondUpdated:false,
	  isTabBarUpdated:false,
	  isLogin:false,  //判断登录状态的全局变量，只有本地缓存wxUser存在的情况下，该变量为true
	  isUpdataHome : false, //  判断是否有数据修改变化（更改操作），使得切换Home页面的时候自动加载
	  isUpdataQuestion : false, //  判断是否有数据修改变化（更改操作），使得切换中间页面的时候自动加载
	  answerSubject:'', //认证界面里解答科目使用的临时全局变量
	  baseUrl: 'http://101.37.15.14/',  //服务器请求路径基址
	  //权限token，可能会换成uuid
	  Authorization:'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJkZXB0OmVkaXQsc3RvcmFnZTphZGQsZGVwdDphZGQsbWVudTpkZWwsZXZhbDpsaXN0LGpvYjplZGl0LGRlcGxveUhpc3Rvcnk6bGlzdCxkaWN0OmFkZCxkZXB0Omxpc3Qsam9iOmxpc3QsZGljdDpkZWwsZGljdDpsaXN0LHd4dXNlcjphZGQsZXZhbDplZGl0LGRhdGFiYXNlOmxpc3QsdGltaW5nOmxpc3QsZGVwbG95Omxpc3QsZXZhbDpkZWwsYXV0aGRhdGE6ZWRpdCxwaWN0dXJlczpsaXN0LG1lbnU6ZWRpdCxtZW51Omxpc3Qsc3RvcmFnZTpkZWwsZGljdDplZGl0LGRlcHQ6ZGVsLHVzZXI6bGlzdCxzdG9yYWdlOmVkaXQscm9sZXM6ZGVsLGFkbWluLGV2YWw6YWRkLHN0b3JhZ2U6bGlzdCx1c2VyOmRlbCxzZXJ2ZXI6bGlzdCxhdXRoZGF0YTpsaXN0LHRpbWluZzphZGQsYXBwOmxpc3Qsam9iOmFkZCxyb2xlczphZGQsYXV0aGRhdGE6ZGVsLHVzZXI6YWRkLHRpbWluZzplZGl0LHJvbGVzOmxpc3Qsd3h1c2VyOmVkaXQsbWVudTphZGQsam9iOmRlbCx3eHVzZXI6ZGVsLHVzZXI6ZWRpdCxyb2xlczplZGl0LHRpbWluZzpkZWwsYXV0aGRhdGE6YWRkLHNlcnZlckRlcGxveTpsaXN0IiwiZXhwIjoxNTgwODg4MjQ0fQ.ROfsysywLltbtFQxOr_9Pm6q2mSOfwNqt4nqPGKc1DGCM6C1ndIOQ53bthhTroRHi2eBzyfeB3l3YyKr5ZWeww'
  }
};
</script>

<style>
/* 全局样式：设置页面默认背景颜色 */
page {
  background-color: #f0f0f0;
}
</style>

<style>
/* Color-ui  */
@import url("./colorui/main.css");
@import url("./colorui/icon.css");

/* 我的信息（me）的公共样式 */
@import "./static/css/me.css";
</style>
