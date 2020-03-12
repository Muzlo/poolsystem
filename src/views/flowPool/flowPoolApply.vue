<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4" :offset="20">
        <el-button class="fr" type="primary" @click="dialogVisible=true">申请流量池</el-button>
      </el-col>
    </el-row>

    <el-divider content-position="center">
      <h2>申请记录</h2>
    </el-divider>

    <el-table :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column fixed="left" width="50" type="index"></el-table-column>
      <el-table-column fixed="left" width="200" label="流量池名称" prop="a"></el-table-column>
      <el-table-column width="200" label="申请者" prop="b"></el-table-column>
      <el-table-column width="120" label="申请日期" prop="c"></el-table-column>
      <el-table-column width="120" label="审批日期" prop="d"></el-table-column>
      <el-table-column width="80" label="期限（月）" prop="e"></el-table-column>
      <el-table-column width="80" label="最大网卡数" prop="f"></el-table-column>
      <el-table-column width="80" label="最大网卡迁移数" prop="g"></el-table-column>
      <el-table-column width="80" label="容量（M）" prop="h"></el-table-column>
      <el-table-column width="80" label="可迁移" prop="i"></el-table-column>

      <el-table-column width="80" label="当前状态" prop="j">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.j === '已同意'">{{scope.row.j }}
          </el-tag>
          <el-tag v-else-if="scope.row.j === '未同意'" :type="'danger'">{{scope.row.j }}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column min-width="200" align="right" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAgree(scope.$index, scope.row)">同意</el-button>
          <el-button size="mini" type="danger" @click="handleBack(scope.$index, scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="tableList.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"  @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange"/>



<!-- 申请流量池 -->

<el-dialog
  title="申请流量池"
  :visible.sync="dialogVisible"
  width="450px">

  <el-form size="mini" ref="flowPoolForm" :rules="flowPoolFormRules" :model="flowPoolForm" label-width="120px">

    <el-form-item label="选择客户" prop="flowPoolCustomerVal">
      <el-select class="w100" filterable v-model="flowPoolForm.flowPoolCustomerVal" placeholder="请选择">
        <el-option
          v-for="item in flowPoolCustomer"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="流量池名称" prop="flowPoolName">
      <el-input v-model="flowPoolForm.flowPoolName"></el-input>
    </el-form-item>

    <el-form-item label="卡申请数量" prop="cardApplyNumber">
      <el-input v-model="flowPoolForm.cardApplyNumber"></el-input>
    </el-form-item>

    <el-form-item label="卡迁移次数" prop="cardMigrationTimes">
      <el-input v-model="flowPoolForm.cardMigrationTimes"></el-input>
    </el-form-item>

    <el-form-item label="流量池容量(M)" prop="flowPoolCapacity">
      <el-input v-model="flowPoolForm.flowPoolCapacity"></el-input>
    </el-form-item>

    <el-form-item label="流量池期限(月)" prop="flowPoolTerm">
      <el-input v-model="flowPoolForm.flowPoolTerm"></el-input>
    </el-form-item>

    <el-form-item label="流量池叠加">
      <el-radio v-model="flowPoolForm.flowPoolSuperposition" label="1">是</el-radio>
      <el-radio v-model="flowPoolForm.flowPoolSuperposition" label="0">否</el-radio>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="flowpoolEdit('flowPoolForm')">确 定</el-button>
  </span>
</el-dialog>




  </div>
</template>

<script>
import pagination from '../../components/flowpool/pagination.vue'

export default {
  name: "flowPoolApply",
  data() {
    return {
      tableData: [],
      keySearch: "", //关键字搜索
      currentPage: 1, //当前选中页
      pageSize:5, //默认每页显示条数
      pageSizes:[5, 8, 10], //更改每页显示数据条数
      dialogVisible: false,//弹窗显示隐藏
      ///流量池申请表单
      flowPoolForm: {
        flowPoolName:'',
        cardApplyNumber:"",
        cardMigrationTimes:"",
        flowPoolCapacity:"",
        flowPoolTerm:"",
        flowPoolSuperposition:"1",
        flowPoolCustomerVal:""
      },
      //验证表单
      flowPoolFormRules: {
        flowPoolName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cardApplyNumber: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cardMigrationTimes: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        flowPoolCapacity: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        flowPoolTerm: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        flowPoolCustomerVal:[
           { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      ///流量池客户选择
      flowPoolCustomer:[
        {
          value:"C0154",
          name:"东莞市晟翔电子科技有限公司",
        },
        {
          value:"C0214",
          name:"深圳广联赛讯有限公司",
        },
        {
          value:"C0112",
          name:"深圳互联波科技有限公司",
        },
        {
          value:"C0159",
          name:"深圳威仕特汽车电子有限公司",
        }
      ],
      
    };
  },
  components:{pagination},
  created(){
      this.tableData=[
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"已同意"
        },
        {
          a: "电信流量池(深圳闪光点)a	",
          b: "深圳市闪光点通信技术有限公司	",
          c: "2020-03-05 10:49:33.0	",
          d: "2020-03-15 10:49:33.0	",
          e:"1",
          f:"1",
          g:"0",
          h:"10240.0",
          i:"	否",
          j:"未同意"
        },
        
      ]
  },
  mounted(){},
  filters:{},
  computed:{
      //复制一份表格数据
      tableList(){
        return this.tableData.filter(item=>{
            if(item.a.includes(this.keySearch)){
                return item
            }
            this.currentPage=1;
        })
      },

  },
  methods: {

    //申请流量池
    flowpoolEdit(formName){
     /// this.dialogVisible=false;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
      });

    },

    //同意
    handleAgree(index, row) {
      console.log(index, row);
    },
    //驳回
    handleBack(index, row) {
      console.log(index, row);
    },
    handleSizeChange(data){
        this.pageSize=data;
        this.currentPage=1;
    },
    handleCurrentChange(data){
        this.currentPage=data;
    }
  }
};
</script>

<style scoped>
</style>
