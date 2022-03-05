<template>
  <div>
    <el-form
      ref="etoak"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-box"
    >
      <h3 class="login-title">膳食管家系统注册</h3>
      <el-form-item label="注冊账号" prop="username">
        <el-input
          type="text"
          placeholder="请输入需要注冊的账号"
          v-model="form.username"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          placeholder="请输入需要注冊的密码"
          v-model="form.password"
        />
       
      </el-form-item>
      <el-form-item label="验证码" prop="checkCode">
        <el-input
          type="text"
          placeholder="请输入验证码"
          v-model="form.checkCode"
        />
        <div @click="nextCode" :style="{ width: '120px', height: '30px' }">
          <el-image
            style="width: 120px; height: 30px"
            :src="CheckCodeUrl"
            :fit="contain"
          ></el-image>
        </div>
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="regist('etoak')">注册</el-button>
        <el-button type="primary" @click="resetForm('etoak')">重置</el-button>
        <el-button type="primary" v-on:click="returnLogin('etoak')"
          >已有账号，登录</el-button>
       
       
      </el-form-item>
    </el-form>

    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('etoak')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Regist",
  data() {
    //     let checkUsername = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error("请填写用户账号"));
    //   } else if (!/^[\x7f-\xffA-Za-z0-9_]+$/.test(value)) {
    //     //引入methods中封装的检查手机格式的方法
    //     callback(new Error("请输入有效格式的账号!"));
    //   } else {
    //     callback();
    //   }
    // }
    return {
      CheckCodeUrl: "",
      form: {
        username: "",
        password: "",
        sessionid: "",
        checkCode: "",
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          {
            pattern: /^[\x7f-\xffA-Za-z0-9_]+$/,
            message: "不允许中文",
            trigger: "blur",
          },
          { required: true, message: "请填写用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },

      // 对话框显示和隐藏
      dialogVisible: false,
    };
  },
   methods: {
    resetForm(value) {
      this.$refs[value].resetFields();
      this.Code();
    
    },

    returnLogin() {
     this.$router.push("/login");
    },

    nextCode() {
      this.Code();
    },
    Code() {
      this.$http
        .get("/user/checkCode", { responseType: "blob" })
        .then((response) => {
          this.CheckCodeUrl = window.URL.createObjectURL(response.data);
          this.form.sessionid = response.headers.sessionid;
        });
    },
    regist(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("/user/regist", this.$qs.stringify(this.form))
            .then((response) => {
              if (response.data.code == 200) {
                console.log(response.data.data)
                this.$message({
                  message: `${response.data.data}注册成功！`,
                  type: "success",
                });
                
                //sessionStorage.setItem("token", response.data.data.token);
                this.$router.push("/login");
              } else if (response.data.code == 447) {
                this.$message({
                  message: "验证码错误",
                  type: "error",
                });
              } else if (response.data.code == 449) {
                this.$message({
                  message: "该用户已存在，请重新输入",
                  type: "error",
                });
              }else{
                 this.$message({
                  message: `未知异常，errorCode:${response.data.code}`,
                  type: "error",
                });
              }
            });
        } else {
          this.dialogVisible = true;
          return false;
        }
      });
    },
  },
  created() {
    this.Code();
  },
};
</script>

<style lang="less" scoped>
.login-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>