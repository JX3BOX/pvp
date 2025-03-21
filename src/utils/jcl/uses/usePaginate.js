import { ref, computed } from "vue";

export const usePaginate = (data, pageSize) => {
    if (!pageSize.value) pageSize = { value: pageSize };
    const currentPage = ref(1);
    const currentData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return data.value.slice(start, end);
    }, [data, currentPage]);
    const total = computed(() => data.value.length, [data]);

    return {
        currentPage,
        currentData,
        total,
    };
};
