<template>
    <div class="m-sandbox-search">
        <span class="u-camp" v-for="(item, key) in camps" :key="key" @click="changeCamp(key)">
            <b :class="key == camp ? 'active' : ''"></b>
            <span>{{ item }}</span>
        </span>
        <el-switch class="u-route" v-model="route" inactive-text="进攻路线"> </el-switch>
        <el-select class="u-server" v-model="server">
            <el-option v-for="item in servers" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name: "SandboxSearch",
    props: ["servers"],
    data: function () {
        return {
            server: this.servers[0] || "",
            camp: "haoqi",
            camps: { haoqi: "浩气盟", eren: "恶人谷" },
            route: true,
        };
    },
    computed: {
        serverData: function () {
            return {
                server: this.server,
                route: this.route,
                camp: this.camp,
            };
        },
    },
    watch: {
        serverData: {
            handler() {
                this.toEmit();
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        changeCamp(key) {
            this.camp = key;
        },
        toEmit: function () {
            this.$emit("sandboxChange", this.serverData);
        },
    },
};
</script>

<style lang="less">
//沙盘搜索
.m-sandbox-search {
    overflow: hidden;
    .flex;
    .size(620px, 45px);
    .r(10px);
    .fz(18px);
    .pl(20px);
    .auto(x);
    justify-content: center;
    align-items: center;

    background-color: #f5f7fa;
    border: 1px solid #a7abaf;
    letter-spacing: 1px;
    text-shadow: 0 0 1px @fontColor;

    .u-camp {
        .pointer;
        .mr(25px);
        display: flex;
        align-items: center;

        b {
            .pr;
            .size(12px);
            .mr(5px);
            .r(50%);
            border: 1px solid @fontColor;

            &.active:after {
                content: "";
                .pa;
                .size(6px);
                .r(50%);
                .lt(50%, 50%);
                margin: -3px 0 0 -3px;
                background: @blue;
                opacity: 0.8;
            }
        }

        span {
            .fz(16px);
            .nobreak;
            text-shadow: 0 0 1px @fontColor;
        }
    }

    .u-route {
        .mr(20px);
    }

    .el-select {
        flex: 1;
    }

    .el-select,
    .el-input,
    .select-trigger,
    .el-input__inner {
        height: 100%;
        .fz(15px);
        .r(0);
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .el-input__inner {
        border: 0;
    }

    .el-input__wrapper {
        box-shadow: none;

        &:hover {
            box-shadow: none !important;
            border: none !important;
        }
    }

    .el-input {
        border-right: 1px solid #d4d4d2;
        border-left: 1px solid #d4d4d2;
    }

    .el-select .el-input.is-focus .el-input__inner,
    .el-select .el-input__inner:focus {
        border-color: transparent;
    }

    .el-switch__label * {
        .fz(12px);
        color: @color-link;
    }

    .el-switch__label.is-active {
        color: @color;
    }
}
</style>
