<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="dialogVisible=true;otherInfo='0';formTitle='新增接口用户';apiUserForm={};">添加</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>接口用户列表</h2>
    </el-divider>


    <el-table
          :height="tableHeight"
          border
          :data="tableList"
          :stripe="true"
          class="mt-15 w100"
        >
      <el-table-column align="center" fixed="left" width="50" type="index"></el-table-column>
      <el-table-column align="center" fixed="left" width="200" label="用户名称" prop="userName"></el-table-column>
      <el-table-column align="center" width="150" label="appId" prop="appId"></el-table-column>
      <el-table-column align="center" width="300" label="uuid" prop="uuid"></el-table-column>
      <el-table-column align="center" width="300" label="appSecret" prop="appSecret"></el-table-column>
      <el-table-column align="center" width="150" label="ip" prop="ip"></el-table-column>      
      <el-table-column align="center" width="150" label="customer" prop="customer"></el-table-column>      
      <el-table-column align="center" width="200" label="备注" prop="remark"></el-table-column>

      <el-table-column width="200" align="right" fixed="right">
        <template v-slot:header="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入用户名称进行搜索" />
        </template>

        <template v-slot="scope">
          <el-button size="mini" type="warning" @click="modify(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row,scope.$index)">删除</el-button>
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



    <!-- 接口用户表单 -->

    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="450px">
      <el-form
        size="mini"
        ref="apiUserForm"
        :rules="apiUserFormRules"
        :model="apiUserForm"
        label-width="120px"
      >
  

        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="apiUserForm.userName"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="customer">
          <el-input v-model="apiUserForm.customer"></el-input>
        </el-form-item>

        <el-form-item label="ip" prop="ip">
          <el-input v-model="apiUserForm.ip"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="apiUserForm.remark"></el-input>
        </el-form-item>


        <div v-if="otherInfo==1">
            <el-form-item label="appSecret" prop="appSecret">
            <el-input v-model="apiUserForm.appSecret"></el-input>
            </el-form-item>
            <el-form-item label="id" prop="id">
            <el-input v-model="apiUserForm.id"></el-input>
            </el-form-item>
        </div>

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
    name:"apiUserList",
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
            ///流量池修改
            apiUserForm: {
                userName: "",
                customer:"",
                ip:"",
                remark:""
            },
            //验证表单
            apiUserFormRules: {
                userName: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                customer: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                ip: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],  
                appSecret:[
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                id:[
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
            },
        }
    },
    components: { pagination },
    mounted() {
        this.apiUserList();
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
                if (item.userName.includes(this.keySearch)) {
                    return item;
                }
                this.currentPage = 1;
            });
        }
    },
    methods: {
        //表格数据请求
        async apiUserList() {
            try {
                const data = await this.$axios.get(
                `${baseURL.ip1}/baseinfo/apiUserList`
                );
                if (data.success) {
                    this.tableData=data.data
                }
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        },
        //新增 修改 删除
        async publicHandle(url){
            try {
                const data = await this.$axios.post(url,
                this._qs.stringify(this.apiUserForm)
                );
                this.$message.success(data.message);
                this.apiUserList();
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
            this.dialogVisible=false;
        },
        //表单提交
        formSubmit() {
            if(this.otherInfo=="1"){ //修改
                this.publicHandle(`${baseURL.ip1}/baseinfo/updApiUser`);

            }else if(this.otherInfo=="0"){ //新增
                this.publicHandle(`${baseURL.ip1}/baseinfo/addApiUser`);
            }
            
        },
        handleSizeChange(data) {
            this.pageSize = data;
            this.currentPage = 1;
        },
        handleCurrentChange(data) {
            this.currentPage = data;
        },
        ///表单确定
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
        //修改接口用户
        modify(data){
            this.dialogVisible=true;
            this.otherInfo='1';
            this.formTitle="修改接口用户"
            this.apiUserForm.userName=data.userName;
            this.apiUserForm.customer=data.customer;
            this.apiUserForm.ip=data.ip;
            this.apiUserForm.remark=data.remark;
            this.apiUserForm.appSecret=data.appSecret;
            this.apiUserForm.id=data.id;
        },
        //删除接口用户
        del(data,index){
            this.dialogVisible=false;
            this.otherInfo='-1';
            this.apiUserForm.userName=data.userName;
            this.apiUserForm.customer=data.customer;
            this.apiUserForm.ip=data.ip;
            this.apiUserForm.remark=data.remark;
            this.apiUserForm.appSecret=data.appSecret;
            this.apiUserForm.uuid=data.uuid;
            this.apiUserForm.id=data.id;

            this.$confirm('此操作将删除该接口用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(async() => {
              this.publicHandle(`${baseURL.ip1}/baseinfo/delApiUser`);
            })
      
        }
    }
}
</script>

<style>

</style>