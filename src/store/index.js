import { defineStore } from "pinia";

export const useStore = defineStore({
    id: "store",
    state: () => ({
        client: location.href.includes("origin") ? "origin" : "std", //"std",
        activeSkill: "",

        userId: 0,
        postId: 0,

        qixueData: {},

        post: null,

        reviewVisible: false, // manager review drawer show
        map: null, // current mapId
        myPoints: [], // my points includes change
        originMyPoints: [], // my points from service
        editPoint: {}, // point which is editing
        delPointId: null, // pointId which is deleting
        myPointsStatus: "", // My points filter status
    }),
    actions: {
        setActiveSkill(skill) {
            this.activeSkill = skill;
        },
    },
    readonly: false,
});
