var key = 0;

export default {
    getNewKey: function() {
        key++;
        return key - 1;
    }
}
