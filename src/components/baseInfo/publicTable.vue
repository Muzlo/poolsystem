<template>
  <div>
      
    <el-table
          :height="tableHeight"
          border
          :data="tableList"
          :stripe="true"
          class="mt-15 w100"
        >
        
      <slot name="tableContent"></slot>

    </el-table>




  </div>
</template>

<script>
export default {
  name:"publicTable",
  props:{
    tableHeight:{

    },
    tableList:{

    }
  }
}
</script>

<style>

</style>