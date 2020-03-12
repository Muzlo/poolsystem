<template>
  <div>{{str | myTime | formatDateTime }}123456</div>
</template> 

<script>
import {myTime,formatDateTime} from '../../common/js/formatDateTime';
export default {
  name: "flowCard",
  data() {
    return {
      str: "2019-04-07T19:00:00.000+0000"
    };
  },
  methods: {},

};
</script>

<style>
</style>
