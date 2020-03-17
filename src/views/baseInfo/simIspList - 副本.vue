<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="dialogVisible=true;otherInfo='0';formTitle='新增运营商';apiUserForm={};">添加</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>运营商列表</h2>
    </el-divider>



    <el-table
          :height="tableHeight"
          border
          :data="tableList"
          :stripe="true"
          class="mt-15 w100"
        >
      <el-table-column align="center" width="50" type="index"></el-table-column>
      <el-table-column align="center" label="运营商名称" prop="ispName"></el-table-column>
      <el-table-column align="center" label="运营商代码" prop="ispCode"></el-table-column>      
      <el-table-column width="200" align="right" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入用户名称进行搜索" />
        </template>

        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="modify(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>

      </el-table-column>

    </el-table>


    <pagination
      :total="tableList.length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />


    <!-- 弹窗表单 -->

    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="450px">
      <el-form
        size="mini"
        ref="apiUserForm"
        :rules="apiUserFormRules"
        :model="apiUserForm"
        label-width="120px"
      >
  
        <el-form-item label="运营商名称" prop="ispName">
          <el-input v-model="apiUserForm.ispName"></el-input>
        </el-form-item>
        <el-form-item label="运营商代码" prop="ispCode">
          <el-input v-model="apiUserForm.ispCode"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="apiUserEdit('apiUserForm')">确 定</el-button>
      </span>
    </el-dialog>




  </div>
</template>

<script>
import pagination from "../../components/flowpool/pagination.vue";
import { baseURL } from "../../common/js/ipConfig.js";
export default {
    name:"simIspList",
    data(){
        return {
            tableData:[],
            keySearch: "", //关键字搜索
            currentPage: 1, //当前选中页
            pageSize: 30, //默认每页显示条数
            pageSizes: [30, 50, 100], //更改每页显示数据条数
            dialogVisible: false, //弹窗显示隐藏
            windowHeight:"",//窗口高度
            otherInfo:"-1",//0:新增时候显示的内容,1:修改时候显示的内容,2:删除时候显示的内容
            formTitle:"",
            ///表单
            apiUserForm: {
                ispCode:"",
                ispName:""
            },
            //验证表单
            apiUserFormRules: {
                ispCode: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                ispName: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
            },
        }
    },
    components: { pagination },
    mounted(){
        this.simIspListFn();
        this.windowHeight=document.documentElement.clientHeight;
        window.onresize=()=>{
            this.windowHeight=document.documentElement.clientHeight;
        }
    },
    computed: {
        //表格高度
        tableHeight() {
            return this.windowHeight-280
        },
        //复制一份表格数据
        tableList() {
            return this.tableData.filter(item => {
                if (item.ispCode.includes(this.keySearch)) {
                    return item;
                }
                this.currentPage = 1;
            });
        }
    },
    methods:{
        //分页函数
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        //分页函数
        handleCurrentChange(data) {
            this.currentPage = data;
        },
        //获取simIspList列表
        async simIspListFn() {
            try {
                const data = await this.$axios.get(
                `${baseURL.ip1}/baseinfo/simIspList`
                );
                if (data.success) {
                    this.tableData=data.data
                }
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
        //新增 更新 删除 公共函数
        async publicHandle(url){
            try {
                const data = await this.$axios.post(url,
                this._qs.stringify(this.apiUserForm)
                );
                //this.$message.success(data.message);
                this.simIspListFn();
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
            this.dialogVisible=false;
        },
        //表单提交
        formSubmit() {
            if(this.otherInfo=="1"){ //修改
                this.publicHandle(`${baseURL.ip1}/baseinfo/updSimIsp`);
            }else if(this.otherInfo=="0"){ //新增
                this.publicHandle(`${baseURL.ip1}/baseinfo/addSimIsp`);
            }
        },
        //表单确定
        apiUserEdit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formSubmit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //修改运营商
        modify(data){
            this.dialogVisible=true;
            this.otherInfo='1';
            this.formTitle="修改运营商"
            this.apiUserForm.ispName=data.ispName;
            this.apiUserForm.ispCode=data.ispCode;
            this.apiUserForm.id=data.id;
        },
        //删除运营商
        del(data){
            this.dialogVisible=false;
            this.otherInfo='2';
            this.apiUserForm.ispName=data.ispName;
            this.apiUserForm.ispCode=data.ispCode;
            this.apiUserForm.id=data.id;
            this.$confirm('此操作将删除该运营商, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(async() => {
              this.publicHandle(`${baseURL.ip1}/baseinfo/delSimIsp`);
            })
        }


    }
}
</script>

<style>

</style>