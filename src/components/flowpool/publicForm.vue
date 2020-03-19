<template>


    <el-dialog @close="closeFn" :fullscreen="fullscreen" :title="formTitle" :visible.sync="dialogVisibleFn" :width="width">
      <el-form
        size="mini"
        ref="apiUserForm"
        :rules="formRules"
        :model="form"
        label-width="120px"
      >
        <slot name="formContent"></slot>
{{form}}
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleHidden">取 消</el-button>
        <el-button type="primary" @click="formSubmitFn('apiUserForm');">确 定</el-button>
      </span>
    </el-dialog>


</template>

<script>
import { baseURL } from "../../common/js/ipConfig.js";
export default {
  name:"publicForm",
  props:{
    formTitle:{},
    formRules:{},
    form:{},
    otherInfo:{},
    url:{},
    fullscreen:{},
    width:{}
  },
  data(){
    return {

    }
  },
  computed: {

    dialogVisibleFn: {
      get: function() {
        return this.$store.state.dialogVisibleBaseInfo.dialogVisible
      },
      set: function() {
        this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',false)
      }
    }


  },
  methods:{
      closeFn(){
        this.$emit("resetFormEmit",{})
      },
      dialogVisibleHidden(){
        this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',false)
      },
      //表单确定
      formSubmitFn(formName){
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.formSubmit();
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      //表单提交
      formSubmit() {
          if(this.otherInfo=="1"){ //修改
              this.publicHandle(this.url.updUrl);
          }else if(this.otherInfo=="0"){ //新增
              this.publicHandle(this.url.addUrl);
          }
          // setTimeout(()=>{
          //   this.$parent.getTableListFn();
          // },500)
      },
      //新增 更新 删除 公共函数
      async publicHandle(url){
          try {
              const data = await this.$axios.post(url,
              this._qs.stringify(this.form)
              );
              console.log(data)
              this.$message.success(data.message);
          } catch (err) {
              this.$message.error("服务器异常，请稍后再试！");
          }
          this.$store.commit('dialogVisibleBaseInfo/dialogVisibleMutations',false)
      },
      
  }
}
</script>

<style>

</style>