<template>
  <div class="wrap clearfix">

    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button size="mini" class="fr" type="primary" @click="openDialog">申请流量池</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>流量池列表</h2>
    </el-divider>
    <el-table
      :height="tableHeight"
      border
      :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :stripe="true"
      style="width: 100%;"
    >
      <el-table-column align="center" fixed="left" width="50" type="index"></el-table-column>
      <el-table-column align="center" fixed="left" width="150" label="流量池名称" prop="flowPoolName"></el-table-column>
      <el-table-column align="center" width="80" label="拥有者" prop="owner"></el-table-column>
      <el-table-column align="center" width="200" label="创建日期" prop="crtDate">
        <template v-slot="scope">{{scope.row.crtDate | myTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column align="center" width="200" label="激活日期" prop="firstDate">
        <template v-slot="scope">{{scope.row.firstDate | myTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column align="center" width="200" label="启用日期" prop="startDate">
        <template v-slot="scope">{{scope.row.startDate | myTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column align="center" width="200" label="停用日期" prop="endDate">
        <template v-slot="scope">{{scope.row.endDate | myTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column align="center" width="200" label="过期日期" prop="stopDate">
        <template v-slot="scope">
          <span v-if="scope.row.stopDate==null"></span>
          <span v-else-if="scope.row.stopDate!=null">{{scope.row.stopDate | myTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="期限（月）" prop="limitDate"></el-table-column>

      <el-table-column align="center" width="200" label="流量池状态" prop="delFlag">
        <template v-slot="scope">
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

      <el-table-column align="center" width="200" label="剩余流量">
        <template v-slot="scope">
            {{(scope.row.flowTotalData-scope.row.flowUsedData) |toFixed}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="200" label="流量最大值" prop="flowMaxData"></el-table-column>
      <el-table-column align="center" width="200" label="流量倍数" prop="flowRate"></el-table-column>
      <el-table-column align="center" width="200" label="最大网卡迁移数" prop="maxQty"></el-table-column>

      <el-table-column align="center" width="200" label="是否可迁移" prop="addFlag">
        <template v-slot="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.addFlag==true">是</el-tag>
          <el-tag effect="dark" type="danger" v-else-if="scope.row.addFlag==false">否</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="200" align="right" fixed="right">
        <template v-slot:header="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入流量池名称进行搜索" />
        </template>
        <template v-slot="scope">
          <!-- <el-button size="mini" @click="start(scope.row)">启用</el-button>
          <el-button size="mini" type="danger" @click="stop(scope.row)">停用</el-button> -->
          <el-button size="mini" type="success" @click="modify(scope.row,scope.$index)">修改</el-button>
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

    <!-- 流量池弹窗 -->
    <publicForm :closeOnClickModal="closeOnClickModal" @resultDataEmitFn="resultDataFn" @resetFormEmit="resetForm" class="publicForm" :fullscreen="fullscreen" :width="width" :formTitle="formTitle" :formRules="formRules" :form="form" :otherInfo="otherInfo" :url="url">

        <template slot="formContent">
          <el-row>

            <el-col :span="8">
              <el-form-item label="流量池名称" prop="flowPoolName">
                  <el-input v-model="form.flowPoolName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="所有者客户代码" prop="owner">
                <el-input v-model="form.owner" :disabled="ownerDisabled"></el-input>
            </el-form-item>
            </el-col>


            <el-col :span="8">
              <el-form-item label="最大卡数量" prop="cardCount">
                  <el-input v-model.number="form.cardCount"></el-input>
              </el-form-item>
            </el-col>



            

          </el-row>

          <el-row>

            <el-col :span="8">
              <el-form-item label="流量池大小(M)" prop="flowTotalData">
                <el-input v-model.number="form.flowTotalData"></el-input>
            </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="倍数" prop="flowRate">
                <el-input v-model.number="form.flowRate"></el-input>
            </el-form-item>
            </el-col>

            
            <el-col :span="8">
              <el-form-item label="有效期限" prop="limitDate">
                <el-input v-model="form.limitDate"></el-input>
            </el-form-item>
            </el-col>
          </el-row>



          <el-row>
            <el-col :span="8">
              <el-form-item label="流量池状态" prop="delFlag">
                <el-select v-model="form.delFlag" placeholder="请选择">
                  <el-option v-for="item in delFlagSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启用日期" prop="startDate">
                <el-date-picker value-format="yyyy-MM-dd" v-model="form.startDate" type="date" placeholder="启用日期"></el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker value-format="yyyy-MM-dd" v-model="form.endDate" type="date" placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>





          </el-row>
            
        </template>

    </publicForm>




  </div>
</template>

<script>
import pagination from "../../components/flowpool/pagination.vue";
import publicForm from "../../components/flowpool/publicForm.vue";
import { baseURL } from "../../common/js/ipConfig.js";
import { myTime, formatDateTime } from "../../common/js/formatDateTime";
export default {
  name: "flowPoolList",
  data() {
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
      width:"900px",
      closeOnClickModal:false,
      tableIndex:0,//获取该数据在表格的第几个位置（新增unshift、修改splice）
      ///表单
      form: {
          cardCount:null,
          endDate:"",
          flowPoolName:"",
          flowRate:null,
          flowTotalData:null,
          limitDate:"",
          owner:"",
          startDate:"",
          delFlag:null
      },
      ownerDisabled:false,//拥有者禁止修改
      delFlagSelect:[
        {label:"未启用",value:0},
        {label:"启用",value:1},
        {label:"停用",value:2},
        {label:"已过期",value:3},
        {label:"已迁移",value:4},
      ],
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
          delFlag: [
              { required: true, message: "不能为空", trigger: "blur" }
          ],
      },
      //修改 新增接口地址
      url:{
          "addUrl":`${baseURL.ip1}/flowpool/addFlowPool`,
          "updUrl":`${baseURL.ip1}/flowpool/updFlowPool`,
      }

    };
  },
  components: { pagination,publicForm },
  created() {},
  filters:{
    toFixed(data){
      return data.toFixed(2)
    }
  },
  mounted() {
    this.getTableListFn("post");
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
        if (item.flowPoolName.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    }
  },
  methods: {
    //获取返回的某条数据（新增、修改）
    resultDataFn(res){
      switch(this.otherInfo){
        case "0":
          this.tableData.splice(this.tableIndex,0,res)
          break;
        case "1":
          this.tableData.splice(this.tableIndex,1,res)
          break;
      }
      
    },
    //重置表单
    resetForm(data){
      this.form=data;
    },
    openDialog(){
          this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true);
          this.formTitle='申请流量池';
          this.otherInfo='0';
          this.ownerDisabled=false;
          this.form={
            cardCount:null,
            endDate:"",
            flowPoolName:"",
            flowRate:null,
            flowTotalData:null,
            limitDate:"",
            owner:"",
            startDate:"",
            delFlag:null
          };


      },
    //表格数据请求
    async getTableListFn(methods) {
      try {
        const data = await this.$axios[methods](
          `${baseURL.ip1}/flowpool/flowPoolList`
        );
        if (data.success) {
          this.tableData=data.data
        }
      } catch (err) {
        console.log(err);
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //启用
    start(row) {
      console.log(row);
    },
    //停用
    stop(row) {
      console.log(row);
    },
    //修改
    modify(data,index) {
      this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',true)
      this.formTitle='修改流量池';
      this.otherInfo='1';
      this.ownerDisabled=true;
      this.tableIndex=index;
      this.form={
        cardCount:data.cardCount,
        endDate:data.endDate,
        flowPoolName:data.flowPoolName,
        flowRate:data.flowRate,
        flowTotalData:data.flowTotalData,
        limitDate:data.limitDate,
        owner:data.owner,
        startDate:data.startDate,
        id:data.id,
        delFlag:data.delFlag
      };


    },

    handleSizeChange(data) {
      this.pageSize = data;
      this.currentPage = 1;
    },
    handleCurrentChange(data) {
      this.currentPage = data;
    }
  }
};
</script>

<style scoped>
  .publicForm .el-date-editor.el-input{width:100%;}
</style>
