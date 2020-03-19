<template>
  <div class="wrap clearfix">

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="openDialog">申请流量池</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>申请记录</h2>
    </el-divider>
    
    <publicTable :tableHeight="tableHeight" :tableList="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <template slot="tableContent">
        <el-table-column align="center" fixed="left" width="50" type="index"></el-table-column>
        <el-table-column align="center" fixed="left" width="150" label="流量池名称" prop="flowPoolName"></el-table-column>
        <el-table-column align="center" width="80" label="拥有者" prop="owner"></el-table-column>
        <el-table-column align="center" width="200" label="创建日期" prop="crtDate">
          <template slot-scope="scope">{{scope.row.crtDate | myTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="激活日期" prop="firstDate">
          <template slot-scope="scope">{{scope.row.firstDate | myTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="启用日期" prop="startDate">
          <template slot-scope="scope">{{scope.row.startDate | myTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="停用日期" prop="endDate">
          <template slot-scope="scope">{{scope.row.endDate | myTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="过期日期" prop="stopDate">
          <template slot-scope="scope">
            <span v-if="scope.row.stopDate==null"></span>
            <span v-else-if="scope.row.stopDate!=null">{{scope.row.stopDate | myTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="期限（月）" prop="limitDate"></el-table-column>

        <el-table-column align="center" width="200" label="流量池状态" prop="delFlag">
          <template slot-scope="scope">
            <el-tag effect="dark" v-if="scope.row.delFlag === 0">未启用</el-tag>
            <el-tag effect="dark" type="success" v-if="scope.row.delFlag === 1">启用</el-tag>
            <el-tag effect="dark" type="danger" v-else-if="scope.row.delFlag === 2">停用</el-tag>
            <el-tag effect="dark" type="info" v-else-if="scope.row.delFlag === 3">已过期</el-tag>
            <el-tag effect="dark" type="warning" v-else-if="scope.row.delFlag === 4">已迁移</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="当前网卡数" prop="cardCount"></el-table-column>
        <el-table-column align="center" width="200" label="最大网卡数" prop="maxCard"></el-table-column>
        <el-table-column align="center" width="200" label="流量总量" prop="flowTotalData"></el-table-column>
        <el-table-column align="center" width="200" label="已用流量" prop="flowUsedData"></el-table-column>
        <el-table-column align="center" width="200" label="剩余流量" prop="flowOverData"></el-table-column>
        <el-table-column align="center" width="200" label="流量最大值" prop="flowMaxData"></el-table-column>
        <el-table-column align="center" width="200" label="流量倍数" prop="flowRate"></el-table-column>
        <el-table-column align="center" width="200" label="最大网卡迁移数" prop="maxQty"></el-table-column>

        <el-table-column align="center" width="200" label="是否可迁移" prop="addFlag">
          <template slot-scope="scope">
            <el-tag effect="dark" type="success" v-if="scope.row.addFlag==true">是</el-tag>
            <el-tag effect="dark" type="danger" v-else-if="scope.row.addFlag==false">否</el-tag>
          </template>
        </el-table-column>

        <el-table-column min-width="200" align="right" fixed="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model.trim="keySearch" size="mini" placeholder="输入流量池名称进行搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleAgree(scope.row)">同意</el-button>
            <el-button size="mini" type="danger" @click="handleBack(scope.row)">驳回</el-button>
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

    <!-- 流量池弹窗 -->


    <publicForm class="publicForm" :fullscreen="fullscreen" :width="width" :formTitle="formTitle" :formRules="formRules" :form="form" :otherInfo="otherInfo" :url="url">

        <template slot="formContent">
          <el-row>
            <el-col :span="12">
              <el-form-item label="最大卡数量" prop="cardCount">
                  <el-input v-model="form.cardCount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endDate">
                <el-input v-model="form.endDate"></el-input>
            </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="流量池名称" prop="flowPoolName">
                <el-input v-model="form.flowPoolName"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="倍数" prop="flowRate">
                <el-input v-model="form.flowRate"></el-input>
            </el-form-item>
            </el-col>
          </el-row>



         <el-row>
            <el-col :span="12">
              <el-form-item label="流量池大小(M)" prop="flowTotalData">
                <el-input v-model="form.flowTotalData"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期限" prop="limitDate">
                <el-input v-model="form.limitDate"></el-input>
            </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所有者客户代码" prop="owner">
                <el-input v-model="form.owner"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用日期" prop="startDate">
                <el-input v-model="form.startDate"></el-input>
            </el-form-item>
            </el-col>
          </el-row>

    

            
        </template>

    </publicForm>

  </div>
</template>

<script>
import pagination from "../../components/flowpool/pagination.vue";
import publicTable from "../../components/flowpool/publicTable.vue";
import publicForm from "../../components/flowpool/publicForm.vue";
import { baseURL } from "../../common/js/ipConfig.js";
import { myTime, formatDateTime } from "../../common/js/formatDateTime";
export default {
  name: "flowPoolApply",
  data(){
    return {
        tableData:[],
        keySearch: "", //关键字搜索
        currentPage: 1, //当前选中页
        pageSize: 30, //默认每页显示条数
        pageSizes: [30, 50, 100], //更改每页显示数据条数
        windowHeight:"",//窗口高度
        otherInfo:"-1",//0:新增时候显示的内容,1:同意,2:驳回
        formTitle:"标题",
        fullscreen:false,
        width:"600px",
        formInline: {
          user: '',
          region: ''
        },
        ///表单
        form: {
            cardCount:0,
            endDate:"",
            flowPoolName:"",
            flowRate:0,
            flowTotalData:0,
            limitDate:"",
            owner:"",
            startDate:""

        },
        //验证表单
        formRules: {
            cardCount: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            endDate: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            flowPoolName: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            flowRate: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            flowTotalData: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            limitDate: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            owner: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            startDate: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
        },
        //修改 新增接口地址
        url:{
            "addUrl":`${baseURL.ip1}/flowpool/addFlowPool`,
            "updUrl":`${baseURL.ip1}/`,
        }

    }
  },
  components: { pagination,publicTable,publicForm },
  created() {},
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
          return this.windowHeight-300
      },
      //复制一份表格数据
      tableList() {
          return this.tableData.filter(item => {
              if (item.flowPoolName.includes(this.keySearch)) {
                  return item;
              }
              this.currentPage = 1;
          });
      }
  },
  watch:{
  },
  methods:{
        //
      openDialog(){
          this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true);
          this.formTitle='申请流量池';
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
      //获取表格列表
      async getTableListFn() {
          // try {
          //     const data = await this.$axios.get(
          //     `${baseURL.ip1}/baseinfo/simClassList`
          //     );
          //     if (data.success) {
          //         this.tableData=data.data
          //     }
          // } catch (err) {
          //     console.log(err);
          //     this.$message.error("服务器异常，请稍后再试！");
          // }
      },
      //同意
      handleAgree(data){
          this.otherInfo='1';
          this.$confirm('是否同意?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then(async() => {
              try {
                  const data = await this.$axios.post(`${baseURL.ip1}/`,
                  this._qs.stringify(this.form)
                  );
                  this.$message.success("操作成功");
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
      },
      //驳回
      handleBack(data){
          this.otherInfo='2';
          this.$confirm('是否驳回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then(async() => {
              try {
                  const data = await this.$axios.post(`${baseURL.ip1}/`,
                  this._qs.stringify(this.form)
                  );
                  this.$message.success("操作成功");
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
};
</script>

<style scoped>
  .publicForm .el-form-item{

  }
</style>
