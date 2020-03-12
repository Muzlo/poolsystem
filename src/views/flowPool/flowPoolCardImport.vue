<template>
  <div>
    <el-form size="small" :inline="true" :model="formInline" class="demo-form-inline">

        <el-form-item label="选择流量池">
            <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
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
                <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
        </el-form-item>

    </el-form>

    <el-divider content-position="center">
      <h2>导入结果</h2>
    </el-divider>

    
    <el-table :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :stripe="true" style="width: 100%">
      <el-table-column width="50" type="index"></el-table-column>
      <el-table-column width="200" label="文件名" prop="a"></el-table-column>
      <el-table-column width="200" label="导入流量池" prop="b"></el-table-column>
      <el-table-column width="120" label="导入日期" prop="c"></el-table-column>
      <el-table-column width="120" label="记录数" prop="d"></el-table-column>
      <el-table-column width="80" label="成功数量" prop="e"></el-table-column>
      <el-table-column width="80" label="错误数量" prop="f"></el-table-column>

      <el-table-column width="200" align="right" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model.trim="keySearch" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="start(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="tableList.length" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"  @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange"/>



  </div>
</template>

<script>
import pagination from '../../components/flowpool/pagination.vue'
export default {
    name:"flowPoolCardImport",
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        fileList:[],
        tableData: [],
        keySearch: "", //关键字搜索
        currentPage: 1, //当前选中页
        pageSize:5, //默认每页显示条数
        pageSizes:[5, 8, 10], //更改每页显示数据条数
      }
    },
    components:{pagination},
    methods:{
        beforeAvatarUpload(file) {      
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                
            const extension = testmsg === 'xls'
            const extension2 = testmsg === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
            }

            if(extension || extension2 && isLt2M){
                this.fileName=file.name
            }

            return extension || extension2 && isLt2M
        },
        httpRequest(param) {
            let fileObj = param.file // 相当于input里取得的files
            let fd = new window.FormData()// FormData 对象
            fd.append('file', fileObj)// 文件对象
            // let url = url;
            // let config = {
            //     headers: {
            //     'Content-Type': 'multipart/form-data'
            //     }
            // }
            // axios.post(url, fd, config).then(res=>{
            //     if(res.code===0){
            //         this.submitForm();//提交表单
            //     }
            // })
        }
    },
    created(){
        this.tableData=[
            {
                a:"2018.1.5-2.xlsx",
                b:"1801-100G",
                c:"2018-01-05 16:14:05.0",
                d:"500",
                e:"500",
                f:"0"
            }
        ]
    },
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


  }
</script>

<style>

</style>