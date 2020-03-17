<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="openDialog">添加</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>运营商列表</h2>
    </el-divider>

    <publicTable :tableHeight="tableHeight" :tableList="tableList">

        <template slot="tableContent">
            <el-table-column align="center" label="#" type="index"></el-table-column>
            <el-table-column align="center" label="运营商名称" prop="ispName"></el-table-column>
            <el-table-column align="center" label="运营商代码" prop="ispCode"></el-table-column>      
            <el-table-column align="right" fixed="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model.trim="keySearch" size="mini" placeholder="输入用户名称进行搜索" />
                </template>
                <template slot-scope="scope">
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

    <publicForm :formTitle="formTitle" :formRules="formRules" :form="form" :otherInfo="otherInfo">

        <template slot="formContent">
            <el-form-item label="运营商名称" prop="ispName">
                <el-input v-model="form.ispName"></el-input>
            </el-form-item>
            <el-form-item label="运营商代码" prop="ispCode">
                <el-input v-model="form.ispCode"></el-input>
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
    name:"simIspList",
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
                ispCode:"",
                ispName:""
            },
            //验证表单
            formRules: {
                ispCode: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                ispName: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
            },
        }
    },
    components: { pagination,publicTable,publicForm },
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
        //
        openDialog(){
            this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true);
            this.formTitle='新增运营商';
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

        //修改运营商
        modify(data){
            this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true)
            this.otherInfo='1';
            this.formTitle="修改运营商"
            this.form.ispName=data.ispName;
            this.form.ispCode=data.ispCode;
            this.form.id=data.id;
        },
        //删除运营商
        del(data){
            this.otherInfo='2';
            this.form.ispName=data.ispName;
            this.form.ispCode=data.ispCode;
            this.form.id=data.id;
            this.$confirm('此操作将删除该运营商, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(async() => {
                try {
                    const data = await this.$axios.post(`${baseURL.ip1}/baseinfo/delSimIsp`,
                    this._qs.stringify(this.form)
                    );
                    this.$message.success("success");
                    this.simIspListFn();
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