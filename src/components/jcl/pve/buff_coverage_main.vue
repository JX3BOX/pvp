<template>
    <div style="display: flex; margin-top: 20px">
        <team-buff-coverage></team-buff-coverage>
    </div>
    <div style="display: flex; margin-top: 20px">
        <individual-buff-coverage></individual-buff-coverage>
        <individual-buff-coverage-log style="margin-left: 20px"></individual-buff-coverage-log>
    </div>
</template>

<script setup>
import TeamBuffCoverage from "../pve/team_buff_coverage.vue";
import IndividualBuffCoverage from "../pve/individual_buff_coverage.vue";
import IndividualBuffCoverageLog from "../pve/individual_buff_coverage_log.vue";
</script>
