export default {
    test(state) {
        state.testArr.push(state.testArr.length);
    },
    appendTBPO(state, payload) {
        console.log("in store, append tbpo");
        state.toBePoppedOut.push(payload);
    },
    updateNotificationSimplified(state, payload) {
        state.notificationTableDataSimplified = payload;
    },
    updateSysMsgSimplified(state, payload) {
        state.sysMsgData = payload;
    },
    pushFrontSysMsgItem(state, payload) {
        if (state.sysMsgData.sysMsgItems.length === 6) {
            state.sysMsgData.moreUnread = state.sysMsgData.moreUnread || state.sysMsgData.sysMsgItems[5].unread;
            state.sysMsgData.sysMsgItems.splice(5, 1); // 弹出尾部
        }
        state.sysMsgData.sysMsgItems.splice(0, 0, payload); // 插入头部
    },
    popFrontTBPO(state) {
        state.toBePoppedOut.splice(0, 1);
    },
    changeMonitorBrowsingStatus(state, payload) {
        state.monitorBrowsingStatus = payload;
        sessionStorage.setItem('monitorBrowsingStatus', payload);
    }
}