var key = 0;

export default {
    getNewKey: () => {
        key++;
        return key - 1;
    }
}
