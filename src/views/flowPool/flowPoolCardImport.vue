<template>
  <div>
    <el-form size="small" :inline="true">

        <el-form-item label="选择流量池">
            <el-select v-model="flowPoolId" placeholder="请选择">
             <el-option v-for="item of flowPoolSelect" :key="item.id" :label="item.flowPoolName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-upload
            ref="upload"
            action="#"
            accept=".xls,.xlsx"
            :file-list="fileList"
            :show-file-list="false"
            :beforeUpload="beforeAvatarUpload"
            :http-request="httpRequest"
            >
                <el-button size="small" type="primary">Excel上传</el-button>
            </el-upload>
        </el-form-item>

    </el-form>

    <!-- <el-divider content-position="center">
      <h2>导入结果</h2>
    </el-divider>

    
    <el-table border :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column align="center" width="50" type="index"></el-table-column>
      <el-table-column align="center" width="200" label="文件名" prop="a"></el-table-column>
      <el-table-column align="center" width="200" label="导入流量池" prop="b"></el-table-column>
      <el-table-column align="center" width="200" label="导入日期" prop="c"></el-table-column>
      <el-table-column align="center" width="100" label="记录数" prop="d"></el-table-column>
      <el-table-column align="center" width="100" label="成功数量" prop="e"></el-table-column>
      <el-table-column align="center" width="100" label="错误数量" prop="f"></el-table-column>



      <el-table-column min-width="200" align="right" fixed="right">
        <template v-slot:header="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入文件名搜索" />
        </template>
        <template v-slot="scope">
          <el-button size="mini" type="primary" @click="start(scope.row)">下载</el-button>
        </template>
      </el-table-column>


    </el-table>

    <pagination :total="tableList.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"  @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange"/>
 -->


  </div>
</template>

<script>
import pagination from '../../components/flowpool/pagination.vue'
import { baseURL } from "../../common/js/ipConfig.js";
export default {
    name:"flowPoolCardImport",
    data() {
      return {
        flowPoolId:null,
        flowPoolSelect: [],
        fileList:[],
        tableData: [],
        keySearch: "", //关键字搜索
        currentPage: 1, //当前选中页
        pageSize:30, //默认每页显示条数
        pageSizes:[30, 50, 100], //更改每页显示数据条数
      }
    },
    components:{pagination},
    methods:{
        beforeAvatarUpload(file) {      
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
            const extension = testmsg === 'xls'
            const extension2 = testmsg === 'xlsx'
            //const isLt2M = file.size / 1024 / 1024 < 1000;
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            // if(!isLt2M) {
            //     this.$message({
            //         message: '上传文件大小不能超过 1000MB!',
            //         type: 'warning'
            //     });
            // }
            // if(extension || extension2 && isLt2M){
            //     this.fileName=file.name
            // }
            // return extension || extension2 && isLt2M
            return extension || extension2
        },
        httpRequest(param) {
          if(this.flowPoolId){
            let fileObj = param.file // 相当于input里取得的files
            let fd = new window.FormData()// FormData 对象
            fd.append('files', fileObj)// 文件对象
            fd.append('flowPoolId', this.flowPoolId)// 文件对象
            let url = `${baseURL.ip1}/flowpool/uploadFlowPoolCard`;
            var options = {
                url: url,
                data: fd,
                method: 'post',
                headers: { 
                  'Content-Type': 'multipart/form-data'
                }
            }
            this.$axios(options).then((res)=>{
              this.$message.success(res.message);
            }).catch((err)=>{
              this.$message.error('上传失败！');
            })
          }else{
            this.$message({
                message: '请选择流量池！',
                type: 'warning'
            });
          }
            
        },
        async getFlowPoolSelectFn(methods) {
          try {
            const data = await this.$axios[methods](
              `${baseURL.ip1}/flowpool/flowPoolList`
            );
            if (data.success) {
              this.flowPoolSelect=data.data;
            }
          } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
          }
        },
    },
    created(){},
    computed:{},
    mounted(){
      this.getFlowPoolSelectFn("post");
    },


  }
</script>

<style>

</style>