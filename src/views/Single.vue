<template>
    <SingleLayout>
        <div class="p-pvp-single"></div>
    </SingleLayout>
</template>

<script>
import { useStore } from "@/store";
import SingleLayout from "@/layouts/SingleLayout.vue";
import { getPost } from "@/service/post";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat";
import SETTING from "@/../setting.json";
const appKey = SETTING.appKey;
export default {
    name: "PvpSingle",
    components: {
        SingleLayout,
    },
    data() {
        return {
            post: {},
            stat: {},
            loading: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            if (!this.id) {
                return;
            }
            this.loading = true;
            getPost(this.id)
                .then((res) => {
                    this.post = res.data.data;
                    useStore().userId = this.post?.post_author;

                    document.title = this.post?.post_title;
                })
                .finally(() => {
                    this.loading = false;
                });

            getStat(appKey, this.id).then((res) => {
                this.stat = res.data;
            });
            postStat(appKey, this.id);
        },
    },
};
</script>
