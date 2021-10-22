import { store } from './store/index';

var ws = {
  webSocket: null,
  url: 'wss:' + process.env.API_ROOT + '/webSocket/',
  token: '',
  setWebSocket: function (token) {
    this.token = token;
    try {
      this.webSocket = new WebSocket(this.url + this.token);
    } catch (e) {
      console.log(e);
      console.log('socket未连接，系统消息不能及时刷新');
      return;
    }
    this.webSocket.onmessage = function (evt) {
      let receivedData = JSON.parse(evt.data);
      switch (receivedData.module) {
        case 'openConnection':
          updateSysMesPrimary(receivedData.json);
          break;

        case 'SysMessage':
          updateSysMes(receivedData.json);
          break;

        case 'Notification':

          break;
      }
    };
    this.webSocket.onclose = function () {
    };
  },
};

function updateSysMes(payload) {
  let sysMsgDataItem;
  let json = JSON.parse(payload);
  sysMsgDataItem = {
    unread: json.status === '未读',
    sysMsgTitle: json.title,
    sysMsgID: json.id,
    type: json.type
  };
  const tmp = store.state.toBePoppedOut.length;
  store.commit('appendTBPO', sysMsgDataItem);
  store.commit('pushFrontSysMsgItem', sysMsgDataItem);

}

function updateSysMesPrimary(payload) {
  let sysMsgData = { moreUnread: 0, sysMsgItems: [] };
  let json = JSON.parse(payload);
  sysMsgData.moreUnread = json.moreUnread;
  for (let i of json.topSixMessage) {
    sysMsgData.sysMsgItems.push({
      unread: i.status === '未读',
      sysMsgTitle: i.title,
      sysMsgID: i.id
    })
  }
  store.commit('updateSysMsgSimplified', sysMsgData);
}

function updateNotification(payload) {
  let ntfData = [];
  let json = JSON.parse(payload);
  store.commit('updateNotificationSimplified', ntfData);
}

export {
  ws
};
