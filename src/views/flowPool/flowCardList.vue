<template>
  <div class="wrap clearfix">
    
    <el-form size="small" :inline="true" :model="flowPoolForm">

        <el-form-item label="网卡类型">
            <el-select v-model="flowPoolForm.cardClass" placeholder="请选择">
              <el-option :label="item.className" :value="item.classCode" v-for=" item in cardTypeList" :key=item.id></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="选择用户">
            <el-select v-model="flowPoolForm.cardCustomer" placeholder="请选择">
              <el-option :label="item.userName" :value="item.customer" v-for=" item in cardCustomerList" :key=item.id></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="网卡状态">
            <el-select v-model="flowPoolForm.cardStatus" placeholder="请选择">
              <el-option label="正常" value="0"></el-option>
              <el-option label="停机" value="1"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="号码类型">
            <el-select v-model="numberType" placeholder="请选择">
              <el-option label="IMSI号" value="cardImsi"></el-option>
              <el-option label="串号(ICCID)" value="cardNo"></el-option>
              <el-option label="卡号" value="cardNumber"></el-option>
              <el-option label="虚拟卡号" value="vrCardNumber"></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="cardNumber" :placeholder="placeholder"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchFlowCardListFn">查询</el-button>
        </el-form-item>

    </el-form>

    <el-divider content-position="center">
      <h2>流量池网卡列表</h2>
    </el-divider>

    <el-table
          :height="tableHeight"
          border
          :data="tableList"
          :stripe="true"
          class="mt-15 w100"
        >
      <el-table-column align="center" fixed="left" width="50" type="index"></el-table-column>
      <el-table-column align="center" fixed="left" width="150" label="卡号" prop="cardNumber"></el-table-column>
      <el-table-column align="center" width="150" label="虚拟卡号" prop="vrCardNumber"></el-table-column>
      <el-table-column align="center" width="200" label="串号(ICCID)" prop="cardNo"></el-table-column>
      <el-table-column align="center" width="150" label="IMSI号" prop="cardImsi"></el-table-column>
      <el-table-column align="center" width="150" label="网卡类型" prop="cardClassName"></el-table-column>
      <el-table-column align="center" width="150" label="ISP" prop="cardIspName"></el-table-column>
      <el-table-column align="center" width="150" label="已用流量" prop="cardUsedData"></el-table-column>
      <el-table-column align="center" width="150" label="阈值" prop="cardOffnetValue"></el-table-column>
      <el-table-column align="center" width="150" label="限速" prop="cardLimitSpeed"></el-table-column>
      <el-table-column align="center" width="150" label="状态" prop="cardStatus">
        <template v-slot="scope">
          <el-tag effect="dark" type="danger" v-if="scope.row.cardStatus==1">停机</el-tag>
          <el-tag effect="dark" type="success" v-if="scope.row.cardStatus==0">正常</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300" label="创建日期" prop="addDate">
        <template v-slot="scope">{{scope.row.addDate | myTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column align="center" width="300" label="更新日期" prop="updDate">
        <template v-slot="scope">{{scope.row.updDate | myTime | formatDateTime}}</template>
      </el-table-column>

      <el-table-column align="center" width="300" label="激活日期" prop="actDate">
        <template v-slot="scope">{{scope.row.actDate | myTime | formatDateTime}}</template>
      </el-table-column>

      

      <el-table-column width="200" align="right" fixed="right">
        <template v-slot:header="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入卡号进行搜索" />
        </template>
 
      </el-table-column>
    </el-table>

    <pagination
      :total="totalElements"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />


  </div>
</template>

<script>
import pagination from "../../components/flowpool/pagination.vue";
import { baseURL } from "../../common/js/ipConfig.js";
import { myTime, formatDateTime } from "../../common/js/formatDateTime";
export default {
  name: "flowCardList",
  data() {
    return {
      tableData:[],
      keySearch: "", //关键字搜索
      currentPage: 1, //当前选中页
      pageSize: 30, //默认每页显示条数
      pageSizes: [30, 50, 100], //更改每页显示数据条数
      windowHeight:"",//窗口高度
      placeholder:"",
      numberType:"",//号码类型
      cardNumber:"",//网卡号
      ///搜索
      flowPoolForm: {
        cardClass:"",
        cardStatus:"",
        cardCustomer:"",
      },
      //网卡类型列表
      cardTypeList:[],
      //网卡客户列表
      cardCustomerList:[],
      //总条数
      totalElements:null,
    };
  },
  components: { pagination },
  created() {},
  mounted() {
    this.cardTypeFn();
    this.cardCustomerListFn();
    this.windowHeight=document.documentElement.clientHeight;
    window.onresize=()=>{
      this.windowHeight=document.documentElement.clientHeight;
    }
  },
  computed: {
    //表格高度
    tableHeight() {
      return this.windowHeight-350
    },
    //复制一份表格数据
    tableList() {
      return this.tableData.filter(item => {
        if (item.cardNumber.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    }
  },
  watch:{
    numberType(newVal){
      switch (newVal){
        case "cardImsi":
          this.placeholder="请输入IMSI号";
          break;
        case "cardNo":
          this.placeholder="请输入串号(ICCID)";
          break;
        case "cardNumber":
          this.placeholder="请输入卡号";
          break;
        case "vrCardNumber":
          this.placeholder="请输入虚拟卡号";
          break;
      }
    }
  },
  methods: {
    //客户列表
    async cardCustomerListFn(){
      try{
        const data=await this.$axios.get(`${baseURL.ip1}/baseinfo/apiUserList`);
        if (data.success) {
          this.cardCustomerList=data.data;
        }
      }catch(err){
        console.log(err);
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
    //搜索
    async searchFlowCardListFn(){
      var obj={};
      var currentPage={page:this.currentPage};
      var pageSize={size:this.pageSize};
      var splitJson={};
      splitJson[this.numberType]=this.cardNumber;
      var cardCustomer={cardCustomer:"C4169"}
      obj={...this.flowPoolForm,...currentPage,...pageSize,...splitJson,...cardCustomer};

      try {
        const data = await this.$axios.post(
          `${baseURL.ip1}/flowpool/flowPoolCardList`,
          this._qs.stringify(obj)
        );
        if (data.success) {
          this.tableData=data.data.content;
          this.totalElements=data.data.totalElements;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("服务器异常，请稍后再试！");
      }
    },
  

    //网卡类型
    async cardTypeFn() {
      try {
        const data = await this.$axios.get(
          `${baseURL.ip1}/baseinfo/simClassList`
        );
        if (data.success) {
          this.cardTypeList=data.data
        }
      } catch (err) {
        console.log(err);
        this.$message.error("服务器异常，请稍后再试！");
      }
    },


    handleSizeChange(data) {
      this.pageSize = data;
      this.currentPage = 1;
      this.searchFlowCardListFn();
    },
    handleCurrentChange(data) {
       console.log(data)
       this.currentPage = data;
       this.searchFlowCardListFn();
    }
  }
};
</script>

<style scoped>

</style>
