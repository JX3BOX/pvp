<template>
    <div class="m-notice-top">
        <div class="m-notice-top__header">
            <h3 class="u-title"><i class="el-icon-news"></i>公告</h3>
        </div>
        <div class="m-notice-top__content">
            <div class="m-notice-top__item" v-for="item in data" :key="item.id">
                <div class="m-item_left">
                    <span class="u-title" v-html="item"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-vue3-ui/service/breadcrumb";
export default {
    data() {
        return {
            data: [],
        };
    },
    mounted() {
        this.getBreadcrumb();
    },
    methods: {
        getBreadcrumb() {
            try {
                const data = sessionStorage.getItem("pvp_ac");

                if (data) {
                    this.data = JSON.parse(data);
                } else {
                    getBreadcrumb("pvp_ac").then((res) => {
                        console.log(res);
                        const data = res.data?.data?.html || "";
                        this.data = data.split("\n");

                        sessionStorage.setItem("pvp_ac", JSON.stringify(this.data));
                    });
                }
            } catch (e) {
                this.data = [];
            }
        },
    },
};
</script>

<style lang="less">
.m-notice-top {
    background-color: @bg-light;
    border: 1px solid #eee;
    padding: 8px 10px;
    border-radius: 6px;
    margin-bottom: 10px;
}

.m-notice-top__header {
    .flex;
    justify-content: space-between;
    .mb(5px);
    .u-title {
        .fz(14px);
        .bold;
        margin: 0;
        i {
            .mr(3px);
        }
    }
    .u-more {
        .fz(12px);
        color: #999;
    }
}

.m-notice-top__item {
    padding: 4px 0;
    .fz(13px,1.6);
    .flex;
    align-items: center;
    justify-content: space-between;
    .pr;
    .u-type {
        padding: 2px 8px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        margin-right: 8px;
        background-color: @primary;
    }

    .m-item_left {
        .flex;
        align-items: center;
        flex: 1;
        .pr;
        .nobreak();
    }

    .u-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        // &:hover {
        //     color: @pink;
        // }

        &.is-bold {
            font-weight: bold;
        }
    }

    .u-time {
        font-size: 12px;
        color: #999;
        margin-left: 5px;
    }
}
</style>
