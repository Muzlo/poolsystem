<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="openDialog">添加</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>SIM列表</h2>
    </el-divider>

    <publicTable :tableHeight="tableHeight" :tableList="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)">

        <template slot="tableContent">
            <el-table-column align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" label="卡类型代码" prop="classCode"></el-table-column>
            <el-table-column align="center" label="卡类型名称" prop="className"></el-table-column>  
            <el-table-column align="center" label="API代码" prop="apiCode"></el-table-column>
            <el-table-column align="center" label="备注" prop="classNote"></el-table-column>      
            <el-table-column align="right" fixed="right">
                <template v-slot:header="scope">
                    <el-input v-model.trim="keySearch" size="mini" placeholder="输入卡类型代码进行搜索" />
                </template>
                <template v-slot="scope">
                    <el-button size="mini" type="warning" @click="modify(scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </template>

    </publicTable>




    <pagination
      :total="tableList.length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />


    <!-- 弹窗表单 -->

    <publicForm :formTitle="formTitle" :formRules="formRules" :form="form" :otherInfo="otherInfo" :url="url">

        <template slot="formContent">
            <el-form-item label="API代码" prop="apiCode">
                <el-input v-model="form.apiCode"></el-input>
            </el-form-item>
            <el-form-item label="卡类型代码" prop="classCode">
                <el-input v-model="form.classCode"></el-input>
            </el-form-item>
            <el-form-item label="卡类型名称" prop="className">
                <el-input v-model="form.className"></el-input>
            </el-form-item>
            <el-form-item label="卡类型备注" prop="classNote">
                <el-input v-model="form.classNote"></el-input>
            </el-form-item>
        </template>

    </publicForm>


  </div>
</template>

<script>
import pagination from "../../components/flowpool/pagination.vue";
import publicTable from "../../components/baseInfo/publicTable.vue";
import publicForm from "../../components/baseInfo/publicForm.vue";
import { baseURL } from "../../common/js/ipConfig.js";
export default {
    name:"simClassList",
    data(){
        return {
            tableData:[],
            keySearch: "", //关键字搜索
            currentPage: 1, //当前选中页
            pageSize: 30, //默认每页显示条数
            pageSizes: [30, 50, 100], //更改每页显示数据条数
            windowHeight:"",//窗口高度
            otherInfo:"-1",//0:新增时候显示的内容,1:修改时候显示的内容,2:删除时候显示的内容
            formTitle:"标题",
            ///表单
            form: {
                apiCode:"",
                classCode:"",
                className:"",
                classNote:""
            },
            //验证表单
            formRules: {
                apiCode: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                classCode: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                className: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
            },
            //修改 新增接口地址
            url:{
                "updUrl":`${baseURL.ip1}/baseinfo/updSimClass`,
                "addUrl":`${baseURL.ip1}/baseinfo/addSimClass`,
            }

        }
    },
    components: { pagination,publicTable,publicForm },
    mounted(){
        this.getTableListFn();
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
                if (item.classCode.includes(this.keySearch)) {
                    return item;
                }
                this.currentPage = 1;
            });
        }
    },
    methods:{
        //
        openDialog(){
            this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true);
            this.formTitle='新增卡类型';
            this.otherInfo='0';
            this.form={};
        },
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
        async getTableListFn() {
            try {
                const data = await this.$axios.get(
                `${baseURL.ip1}/baseinfo/simClassList`
                );
                if (data.success) {
                    this.tableData=data.data
                }
            } catch (err) {
                console.log(err);
                this.$message.error("服务器异常，请稍后再试！");
            }
        },

        //修改运营商
        modify(data){
            this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true)
            this.otherInfo='1';
            this.formTitle="修改卡类型"
            this.form.apiCode=data.apiCode;
            this.form.classCode=data.classCode;
            this.form.className=data.className;
            this.form.classNote=data.classNote;
            this.form.id=data.id;
        },
        //删除运营商
        del(data){
            this.otherInfo='2';
            this.form.apiCode=data.apiCode;
            this.form.classCode=data.classCode;
            this.form.className=data.className;
            this.form.classNote=data.classNote;
            this.form.id=data.id;
            this.$confirm('此操作将删除该卡类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(async() => {
                try {
                    const data = await this.$axios.post(`${baseURL.ip1}/baseinfo/delSimClass`,
                    this._qs.stringify(this.form)
                    );
                    this.$message.success("success");
                    this.getTableListFn();
                } catch (err) {
                    console.log(err);
                    this.$message.error("服务器异常，请稍后再试！");
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
      

    }
}
</script>

<style>

</style>