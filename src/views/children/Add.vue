<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      :model="formLabelAlign"
      ref="myForm"
      :rules="rule"
    >
      <div class="myDiv">
        <el-form-item label="菜品名称" prop="name">
          <el-input
            v-model="formLabelAlign.name"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </div>
      <div class="myDiv">
        <el-form-item label="价格" prop="price">
          <el-input v-model="formLabelAlign.price"></el-input>
        </el-form-item>
      </div>
      <div class="myDiv">
        <el-form-item label="简介" prop="info">
          <el-input v-model="formLabelAlign.info"></el-input>
        </el-form-item>
      </div>
      <div class="myDiv">
        <el-form-item label="品类" prop="kindid">
          <el-select
            v-model="formLabelAlign.kindid"
            placeholder="请选择菜品种类"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div>
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/food/addPic"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="success"
          :limit="1"
          list-type="picture"
          ref="myUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
      <div class="myDiv">
        <el-form-item>
          <el-button type="success" @click="onSubmit">确定</el-button>
          <el-button type="danger" @click="onReset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let checkFoodname = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写菜品名称"));
      } 
      this.$http.post('/food/hasFood',this.$qs.stringify({
        name:value
      })).then(response=>{
        if(response.data.code ==200){
          return callback(new Error("已有有相同菜品"));
        }
        return callback()
      })
    };
       let checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入单价!"));
      } else if (!/^[0-9]*$/.test(value)) {
        //引入methods中封装的检查手机格式的方法
        callback(new Error("请输入有效格式单价!"));
      } else {
        callback();
      }
    }
    return {
      rule: {
        name: [
          {
            required: true,
            validator: checkFoodname,
            trigger: "blur",
          },
        ],
        price:[
          {
            required:true,
          validator: checkPhone,
            trigger:"blur",
          }
        ],
        info:[{
          required:true,
          message:'必填项',
          trigger:'blur'
        },
        ],
      },
      fileList: [],
      options: [],
      formLabelAlign: {
        name: "",
        price: "",
        publisherid: "",
        picid: "",
        info: "",
        kindid: "",
      },
      // total: "",
      // pageNumber: 1,
      // pageSize: 8,
    };
  },
  methods: {
  
    //上传
    onSubmit() {
        if (!this.formLabelAlign.kindid) {
        this.$message({
          message: "请选择品类",
          type: "error",
        });
        return;
      }  
      if (!this.formLabelAlign.picid) {
        this.$message({
          message: "请上传图片",
          type: "error",
        });
        return;
      }  
      this.$refs['myForm'].validate((valid) => {
       if (valid) {
      this.$http
        .post("/food/addFood", this.$qs.stringify(this.formLabelAlign))
        .then((response) => {
          if (response.data.code ==200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            // this.queryDatas();
            this.$router.push("/index/show");
          }
        });
       }
      })
     },
//  queryDatas() {
//       this.$http
//         .post(
//           "/food/querySome",
//           this.$qs.stringify({
//             pageNumber: this.pageNumber,
//             pageSize: this.pageSize,
//           })
//         )
//         .then((response) => {
//           this.datas = response.data.data.rows;
//           this.total = response.data.data.total;
//         });
//     },

    //重置
    onReset() {
      this.$refs["myForm"].resetFields();
      this.tempBirth = "";
      this.formLabelAlign.picId = "";
      this.picId = "";
      this.$refs.myUpload.clearFiles();
    },
    //删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //计数器
    handleChange(value) {
      this.formLabelAlign.stock = value;
    },
    //预览
    handlePreview(file) {
      console.log(file);
    },
    //上传成功
    success(response) {
      //console.log(response.data8/\)
      console.log(response.data);
      this.formLabelAlign.picid = response.data;
    },
    queryAllSchs() {
      this.$http.post("/kind/queryAllKinds", "").then((response) => {
        console.log(response.data);
        this.options = response.data.data;
      });
    },
  },
  created() {
    this.queryAllSchs();
  },
};
</script>

<style lang="less" scoped>
.myDiv {
  display: flex;
  justify-content: center;
}
</style>