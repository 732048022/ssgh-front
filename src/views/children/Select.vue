<template>
  <div id="Mydiv">
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="warning" :style="{ float: left }" @click="addTable">
          添加桌子</el-button
        >
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
    <el-container>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="id" label="桌号" width=""> </el-table-column>
        <el-table-column prop="ordernum" label="订单号" width="">
        </el-table-column>
        <el-table-column prop="personcount" label="人数" width="">
        </el-table-column>
        <el-table-column prop="info" label="描述" width=""> </el-table-column>
        <el-table-column prop="status" label="状态" width="">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              on-color="#00A854"
              active-text="满座"
              inactive-text="空闲"
              on-text="启动"
              on-value="1"
              off-color="#F04134"
              off-text="禁止"
              off-value="0"
              @change="changeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="">
          <template slot-scope="scope">
            <el-button
              @click="modifyTable(scope.row)"
              type="success"
              size="small"
              >修改</el-button
            >
            <el-button @click="delTable(scope.row)" type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="change"
        :page-sizes="[3, 5, 10]"
        :pager-count="5"
        :page-count="pageCount"
        :page-size="pageSize"
        :current-page="pageNumber"
        layout="total , sizes , prev , pager, next"
        :total="total"
      >
      </el-pagination>
    </el-container>
    <el-dialog title="修改信息" :visible.sync="dialogTableVisible">
      <el-form
        label-position="left"
        label-width="80px"
        :model="formLabelAlign"
        ref="myForm"
        :rules="rule"
      >
        <div class="myDiv">
          <el-form-item label="简介" prop="info">
            <el-input v-model="formLabelAlign.info"></el-input>
          </el-form-item>
        </div>
        <div class="myDiv">
          <el-form-item label="人数" prop="personCount">
            <el-input v-model="formLabelAlign.personCount"></el-input>
          </el-form-item>
        </div>
        <div class="myDiv">
          <el-form-item>
            <el-button type="success" @click="onSubmit">确定</el-button>
            <el-button type="danger" @click="onReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="添加桌子信息" :visible.sync="dialogTableVisibleadd">
      <el-form
        label-position="left"
        label-width="80px"
        :model="formLabelAlignadd"
        ref="myForm"
        :rules="rule"
      >
        <div class="myDiv">
          <el-form-item label="简介" prop="info">
            <el-input v-model="formLabelAlignadd.info"></el-input>
          </el-form-item>
        </div>
        <div class="myDiv">
          <el-form-item label="人数" prop="personCount">
            <el-input v-model="formLabelAlignadd.personCount"></el-input>
          </el-form-item>
        </div>
        <div class="myDiv">
          <el-form-item>
            <el-button type="success" @click="onSubmitAdd">确定</el-button>
            <el-button type="danger" @click="onResetAdd">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入人数!"));
      } else if (!/^[0-9]*$/.test(value)) {
        //引入methods中封装的检查手机格式的方法
        callback(new Error("请输入有效格式人数!"));
      } else {
        callback();
      }
    };
    return {
      rule: {
        info: [
          {
            required: true,
            message: "必填项",
            trigger: "blur",
          },
        ],
        personCount: [
          {
            required: true,
            validator: checkPhone,
            trigger: "blur",
          },
        ],
      },
      formLabelAlignadd: {
        info: "",
        personCount: "",
      },
      tempId: "",
      dialogTableVisible: false,
      dialogTableVisibleadd: false,
      formLabelAlign: {
        info: "",
        personCount: "",
      },
      pageNumber: 1,
      pageSize: 3,
      pageCount: (this.total + (this.pageSize - 1)) / this.pageSize,
      total: "",
      tableData: [],
    };
  },
  methods: {
    addTable() {
      this.dialogTableVisibleadd = true;
    },
    onSubmitAdd() {
      this.$refs["myForm"].validate((valid) => {
         if (valid) {
        this.$http
          .post(
            "/table/addTable",
            this.$qs.stringify({
              info: this.formLabelAlignadd.info,
              personCount: this.formLabelAlignadd.personCount,
            })
          )
          .then((response) => {
            this.dialogTableVisibleadd = false;
            this.queryData();
            if (response.data.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.onReset();
            }
          });
         }
      });
    },
    //重置
    onResetAdd() {
      this.$refs["myForm"].resetFields();
      this.formLabelAlign.picid = "";
      this.$refs.myUpload.clearFiles();
    },
    onSubmit() {
      this.$http
        .post(
          "/table/setTable",
          this.$qs.stringify({
            info: this.formLabelAlign.info,
            personCount: this.formLabelAlign.personCount,
            id: this.tempId,
          })
        )
        .then((response) => {
          this.dialogTableVisible = false;
          this.queryData();
          if (response.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.onReset();
            this.tempId = "";
          }
        });
    },
    //重置
    onReset() {
      this.$refs["myForm"].resetFields();
      this.formLabelAlign.picid = "";
      this.$refs.myUpload.clearFiles();
    },
    modifyTable(value) {
      this.dialogTableVisible = true;
      this.$http
        .post(
          "/table/modifyTable",
          this.$qs.stringify({
            id: value.id,
          })
        )
        .then((response) => {
          if (response.data.code == 200) {
            this.tempId = response.data.data.id;
            this.formLabelAlign.info = response.data.data.info;
            this.formLabelAlign.personCount = response.data.data.personcount;
          }
        });
    },
    delTable(value) {
      this.$http
        .post(
          "/table/delTable",
          this.$qs.stringify({
            id: value.id,
          })
        )
        .then((response) => {
          if (response.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.queryData();
          }
        });
    },
    changeSwitch(value) {
      if (value.status) {
        //已经满座
        this.$http
          .post(
            "/table/setOrderNum",
            this.$qs.stringify({
              id: value.id,
              setOrderNum: 1,
            })
          )
          .then((response) => {
            if (response.data.code == 200) {
              this.queryData();
            }
          });
      } else {
        this.$http
          .post(
            "/table/setOrderNum",
            this.$qs.stringify({
              id: value.id,
              setOrderNum: 0,
            })
          )
          .then((response) => {
            if (response.data.code == 200) {
              this.queryData();
            }
          });
      }
    },
    //5 10 3
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData();
    },
    //换页
    change(val) {
      this.pageNumber = val;
      this.queryData();
    },
    //queryData
    queryData() {
      this.$http
        .post(
          "/table/querySome",
          this.$qs.stringify({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          })
        )
        .then((response) => {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
        });
    },
  },
  created() {
    this.queryData();
  },
};
</script>

<style lang="less" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
div#Mydiv {
  .el-container {
    display: block;
    .el-form {
      display: block;
      align-items: center;
      justify-content: center;
      .el-form-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>