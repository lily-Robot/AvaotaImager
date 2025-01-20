const { ipcRenderer } = require('electron');

// 获取元素
const languageForm = document.getElementById('language-form');

// 点击语言选项，切换语言
languageForm.addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  console.log('Selected Language:', selectedLanguage);

  // 发送语言选择事件到主进程
  ipcRenderer.send('set-language', selectedLanguage);
});

// 窗口控制逻辑
document.querySelector('.minimize').addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});

document.querySelector('.maximize').addEventListener('click', () => {
  ipcRenderer.send('window-maximize');
});

document.querySelector('.close').addEventListener('click', () => {
  ipcRenderer.send('window-close');
});