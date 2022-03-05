<template>
  <el-container>
    <el-header>
      <div id="logo">
        <img src="../assets/logo.png" /> <span>膳食管家系统</span>
      </div>
      <el-dropdown @command="handleChange">
        <el-button type="warning">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <side-bar :menuList="menuList">

        </side-bar>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import SideBar from './book资料/SideBar/SideBar.vue';
export default {
  data(){
    return{
      menuList:[]
    }
  },
  components:{SideBar},
  methods: {
    handleChange(value){
      if(value==='a'){
        this.$router.push("/login")
        this.$message({
          message:'退出成功',
          type:'error'
        })
        sessionStorage.removeItem('token')
      }
    },
    queryMenu(){
      this.$http
        .post("/user/queryMenuByUserId", this.$qs.stringify({token:sessionStorage.getItem('token')}))
        .then((response) => {
          this.menuList =response.data.data
        });
    }
  },
  created(){
    this.queryMenu()
  }
};
</script>
<style lang="less" scoped>
.el-container {
  margin: 0;
  padding: 0;
  height: 1000px;
  .el-header {
    background-color: rgb(84, 92, 100);
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 200px;
    .el-dropdown {
      float: right;
    }
    #logo {
      float: left;
      height: 75px;
      width: 250px;
      display: flex;
      align-items: center;
      img {
        width: 30%;
        height: 100%;
      }
      span {
        width: 70%;
        height: 100%;
        color: #d3dce6;
        font-weight: 900;
      }
    }
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: 800px;
    background-color: rgb(84, 92, 100);
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
    height: 800px;
  }
}
</style>
