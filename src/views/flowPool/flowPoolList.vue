<template>
  <div class="wrap clearfix">
    <el-divider content-position="center">
      <h2>流量池列表{{windowHeight}} {{tableHeight}}</h2>
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
          <span v-else="scope.row.stopDate!=null">{{scope.row.stopDate | myTime | formatDateTime}}</span>
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

      <el-table-column min-width="300" align="right" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入流量池名称进行搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="start(scope.row.id)">启用</el-button>
          <el-button size="mini" type="danger" @click="stop(scope.row.id)">停用</el-button>
          <el-button size="mini" type="warning" @click="move(scope.row.id)">迁移</el-button>
          <el-button size="mini" type="success" @click="modify(scope.row)">修改</el-button>
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

    <!-- 申请流量池 -->

    <el-dialog title="申请流量池" :visible.sync="dialogVisible" width="450px">
      <el-form
        size="mini"
        ref="flowPoolForm"
        :rules="flowPoolFormRules"
        :model="flowPoolForm"
        label-width="120px"
      >
        <el-form-item label="选择客户" prop="flowPoolCustomerVal">
          <el-select
            class="w100"
            filterable
            v-model="flowPoolForm.flowPoolCustomerVal"
            placeholder="请选择"
          >
            <el-option
              v-for="item in flowPoolCustomer"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
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
import pagination from "../../components/flowpool/pagination.vue";
import { baseURL } from "../../common/js/ipConfig.js";
import { myTime, formatDateTime } from "../../common/js/formatDateTime";
export default {
  name: "flowPoolList",
  data() {
    return {
      tableData:[],
      keySearch: "", //关键字搜索
      currentPage: 1, //当前选中页
      pageSize: 5, //默认每页显示条数
      pageSizes: [5, 8, 10], //更改每页显示数据条数
      dialogVisible: false, //弹窗显示隐藏
      windowHeight:"",//窗口高度
      ///流量池修改
      flowPoolForm: {
        flowPoolName: "",
        cardApplyNumber: "",
        cardMigrationTimes: "",
        flowPoolCapacity: "",
        flowPoolTerm: "",
        flowPoolSuperposition: "1",
        flowPoolCustomerVal: ""
      },
      //验证表单
      flowPoolFormRules: {
        flowPoolName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        cardApplyNumber: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        cardMigrationTimes: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        flowPoolCapacity: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        flowPoolTerm: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        flowPoolCustomerVal: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      ///流量池客户选择
      flowPoolCustomer: [
        {
          value: "C0154",
          name: "东莞市晟翔电子科技有限公司"
        },
        {
          value: "C0214",
          name: "深圳广联赛讯有限公司"
        },
        {
          value: "C0112",
          name: "深圳互联波科技有限公司"
        },
        {
          value: "C0159",
          name: "深圳威仕特汽车电子有限公司"
        }
      ]
    };
  },
  components: { pagination },
  created() {},
  mounted() {
    this.flowPoolList();
    this.windowHeight=document.documentElement.clientHeight;
    window.onresize=()=>{
      this.windowHeight=document.documentElement.clientHeight;
    }
  },
  computed: {
    //表格高度
    tableHeight() {
      return this.windowHeight-250
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
  methods: {
    //表格数据请求
    async flowPoolList() {
      try {
        const data = await this.$axios.post(
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
    modify(row) {
      console.log(row);
    },
    //迁移
    move(row) {
      console.log(row);
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

</style>
