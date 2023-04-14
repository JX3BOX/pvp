import { defineStore } from "pinia";

export const useStore = defineStore({
    id: "store",
    state: () => ({
        client: location.href.includes("origin") ? "origin" : "std",
        activeSkill: "",

        userId: 0,
    }),
    actions: {
        setActiveSkill(skill) {
            this.activeSkill = skill;
        },
    },
    readonly: false,
});
