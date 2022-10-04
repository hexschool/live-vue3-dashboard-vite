import { useToastMessageStore } from '../stores/toastMessage';

export default function (response, title = '更新') {
  const toastMessageStore = useToastMessageStore();
  if (response.data.success) {
    toastMessageStore.pushMessage({
      style: 'success',
      title: `${title}成功`,
    })
  } else {
    // 有些訊息是字串，有些則是陣列，在此統一格式
    const message =
      typeof response.data.message === 'string'
        ? [response.data.message]
        : response.data.message;
    toastMessageStore.pushMessage({
      style: 'danger',
      title: `${title}失敗`,
      content: message.join('、'),
    });
  }
}
