<template>
    <div class="m-skill-audio" @click="play">
        <audio ref="audio" :src="src" hidden @durationchange="init" @ended="ended"></audio>
        <img v-if="playing" src="@/assets/img/audio.gif" />
        <img v-else src="@/assets/img/audio_static.gif" />
        {{ remark }}
        <div class="u-audio-progress__wrapper">
            <div class="u-audio-progress__bar" :style="barStyle"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SkillAudio",
    props: {
        src: {
            type: String,
            default: "",
        },
        remark: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        playing: false,
        currentTime: 0,
        duration: 1,
    }),
    methods: {
        init() {
            this.duration = this.$refs.audio.duration;
            this.currentTime = 0;
        },
        update() {
            this.currentTime = this.$refs.audio.currentTime;
        },
        play() {
            if (this.playing) {
                this.$refs.audio.pause();
                this.playing = false;
                return;
            }
            this.$refs.audio.play();
            this.playing = true;
            let interval = setInterval(() => {
                if (this.playing) {
                    this.update();
                } else {
                    clearInterval(interval);
                }
            }, 10);
        },
        ended() {
            this.currentTime = 0;
            this.playing = false;
        },
    },
    computed: {
        barStyle() {
            return {
                width: `${(this.currentTime / this.duration) * 100}%`,
            };
        },
    },
    mounted() {
        this.init();
    },
    beforeUnmount() {
        this.ended();
    },
};
</script>

<style lang="less" scoped>
.m-skill-audio {
    .pr;
    height: 26px;
    display: flex;
    align-items: center;
    gap: 10px;

    .u-audio-progress__wrapper {
        .pa;
        .size(100%);
        .z(-1);
    }

    .u-audio-progress__bar {
        height: 100%;
        background-color: #0004;
        line-height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
