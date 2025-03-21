<template>
    <span class="w-check-button" @click="click" :class="buttonClass">
        <slot></slot>
    </span>
</template>

<script>
export default {
    name: "CheckButton",
    props: {
        modelValue: {
            type: [Number, String, Boolean, Array],
            default: undefined,
        },
        type: {
            type: String,
            default: "switch",
            validator(value) {
                return ["switch", "radio", "check"].includes(value);
            },
        },
        value: {
            type: [Number, String, Boolean],
            default: undefined,
        },
        canCancel: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {};
    },
    methods: {
        click() {
            if (this.type === "check") {
                if (this.modelValue.includes(this.value)) {
                    this.$emit(
                        "update:modelValue",
                        this.modelValue.filter((v) => v !== this.value)
                    );
                } else {
                    this.$emit("update:modelValue", [...this.modelValue, this.value]);
                }
            } else if (this.type === "radio") {
                if (this.modelValue == this.value && this.canCancel) {
                    this.$emit("update:modelValue", undefined);
                }
                if (this.modelValue != this.value) {
                    this.$emit("update:modelValue", this.value);
                }
            } else {
                this.$emit("update:modelValue", !this.modelValue);
            }
        },
    },
    computed: {
        buttonClass() {
            const result = [];
            if (
                (this.type === "check" && this.modelValue.includes(this.value)) ||
                (this.type === "radio" && this.modelValue === this.value) ||
                (this.type === "switch" && this.modelValue)
            ) {
                result.push("is-active");
            }
            result.push(`w-check-button__${this.type}`);
            return result;
        },
    },
};
</script>

<style lang="less" scoped>
.w-check-button {
    .pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    .fz(14px, 18px);
    .bold;
    width: fit-content;
    border-radius: 20px;

    transition: all 0.1s ease-in-out;
    background-color: #000000;
    color: #b3b3b3;
    &.is-active {
        background-color: #0f5773;
        color: #ffffff;
    }
}
</style>
