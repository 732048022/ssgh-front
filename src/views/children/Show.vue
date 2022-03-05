<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="warning" :style="{ float: 'left' }" @click="addFood">
          添加菜谱</el-button
        >
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6" v-for="(data, index) in datas" :key="index">
        <el-card>
          <el-carousel height="200px">
            <el-carousel-item v-for="pic in data.foodpics" :key="pic">
              <el-image
                style="height: 200px"
                :src="'http://127.0.0.1:8080/book' + pic.savepath"
                fit="contain"
                :preview-src-list="[
                  'http://127.0.0.1:8080/book' + pic.savepath,
                ]"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
          <div style="padding: 14px">
            <span>菜名:{{ data.name }}</span
            ><br />
            <div class="bottom clearfix" :style="{ margin: '10px' }">
              <el-button type="success" class="button" @click="modifyFood(data)"
                >修改</el-button
              >
            </div>
            <div class="bottom clearfix">
              <el-button type="danger" class="button" @click="delFood(data.id)"
                >删除</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="change"
          :page-sizes="[4, 8]"
          :pager-count="3"
          :page-count="pageCount"
          :page-size="pageSize"
          :current-page="pageNumber"
          layout="total , sizes , prev , pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="修改信息" :visible.sync="dialogTableVisible">
      <el-form
        label-position="left"
        label-width="80px"
        ref="myForm"
        :model="formLabelAlign"
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
          <el-form-item label="品类">
            <el-select v-model="formLabelAlign.kindid" :placeholder="message">
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
        <div class="demo-image__preview">
          <h4>菜品封面:</h4>
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
        <div>
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/book/food/addPic"
            :on-preview="handlePreview"
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
            <el-button type="success" @click="onSubmitModify">确定</el-button>
            <el-button type="danger" @click="onResetModify('myForm')"
              >重置</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkFoodname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写菜品名称"));
      }
      this.$http
        .post(
          "/food/hasFood",
          this.$qs.stringify({
            name: value,
          })
        )
        .then((response) => {
          if (response.data.code == 200 && response.data.data != this.tempId) {
            return callback(new Error("已有相同菜品"));
          }
          return callback();
        });
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
    };
    return {
      url: "",
      tempKindId: "",
      tempId: "",
      rule: {
        name: [
          {
            required: true,
            validator: checkFoodname,
            trigger: "blur",
          },
        ],
        price: [
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
      },
      options: [],
      formLabelAlign: {
        id: "", //提交赋值
        name: "", //打开赋值
        price: "", //打开赋值
        publisherid: "",
        picid: "", //上传结束后赋值
        info: "", //打开模态框赋值
        kindid: "", //打开模态框赋值,不填的话直接发这个
      },
      message: "",
      dialogTableVisible: false,
      datas: [], //包括pics
      // pageCount: (this.total + (this.pageSize - 1)) / this.pageSize,
      total: "",
      pageNumber: 1,
      pageSize: 8,
      srcList: [],
    };
  },
  methods: {
    onSubmitModify() {
      if (!this.formLabelAlign.kindid) {
        //啥也没选 就以前的了
        this.formLabelAlign.kindid = this.tempKindId;
      }
      this.$refs["myForm"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/food/setFood", this.$qs.stringify(this.formLabelAlign))
            .then((response) => {
              if (response.data.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.onResetModify("myForm");
                this.dialogTableVisible = false;
                this.queryDatas();
              }
            });
        }
      });
    },
    //重置
    onResetModify(formName) {
      this.$nextTick(() => {
        this.formLabelAlign = formName;
      });
      this.url = "";
      this.$refs[formName].resetFields();
      this.formLabelAlign.picid = "";
      this.$refs.myUpload.clearFiles();
    },
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
    queryPicUrlByFoodId() {
      this.$http
        .post(
          "/food/queryPicUrlByFoodId",
          this.$qs.stringify({
            foodId: this.formLabelAlign.id,
          })
        )
        .then((response) => {
          if (response.data.code == 200) {
            //console.log(response.data.data)
            this.url = "http://127.0.0.1:8080/book" + response.data.data;
          }
        });
    },
    modifyFood(value) {
      this.$nextTick(() => {
        this.formLabelAlign = value;
      });
      this.dialogTableVisible = true;
      this.queryAllSchs();
      this.formLabelAlign.id = value.id;
      this.queryPicUrlByFoodId();
      this.formLabelAlign.name = value.name;
      this.formLabelAlign.info = value.info;
      this.formLabelAlign.price = value.price;

      this.tempKindId = value.kind.id; //暂时先付给一个临时变量 以防止它不填 提交见
      this.formLabelAlign.picid = value.picid; //先这么着
      this.message = value.kind.name; //显示的信息
    },
    delFood(value) {
      this.$confirm("此操作将永久删除菜品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post(
              "food/del",
              this.$qs.stringify({
                id: value,
              })
            )
            .then((response) => {
              if (response.data.code == 200) {
                this.pageNumber = 1;
                this.queryDatas();
              }
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addFood() {
      this.$router.push("/index/add");
    },
    goBack() {
      this.$router.push("/index");
    },
    queryDatas() {
      this.$http
        .post(
          "/food/querySome",
          this.$qs.stringify({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          })
        )
        .then((response) => {
          this.datas = response.data.data.rows;
          this.total = response.data.data.total;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryDatas();
    },
    change(val) {
      this.pageNumber = val;
      this.queryDatas();
    },
  },
  created() {
    this.queryDatas();
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 8px;
  margin-bottom: 10px;
}
.bg-purple-dark {
  background: #cad1da;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
* {
  line-height: 25px;
}

span {
  padding: 0;
  margin: 0;
  font-size: 16px;
}
</style>