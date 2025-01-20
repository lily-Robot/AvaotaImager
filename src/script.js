const { ipcRenderer } = require('electron');

// 获取元素
const selectImage = document.getElementById('select-image');
const localImage = document.getElementById('local-image');
const downloadImage = document.getElementById('download-image');
const selectDevice = document.getElementById('select-device');
const deviceList = document.getElementById('device-list');
const burnButton = document.getElementById('burn-button');
const settingsBtn = document.getElementById('settings-btn');

let selectedImage = null;
let selectedDevice = null;

// 选择本地镜像
localImage.addEventListener('click', () => {
  selectedImage = 'local';
  updateBurnButtonState();
  ipcRenderer.send('select-local-image');
});

// 下载镜像
downloadImage.addEventListener('click', () => {
  selectedImage = 'download';
  updateBurnButtonState();
  ipcRenderer.send('download-image');
});

// 选择设备
selectDevice.addEventListener('click', () => {
  ipcRenderer.send('get-device-list');
});

// 监听设备列表
ipcRenderer.on('device-list', (event, devices) => {
  deviceList.innerHTML = ''; // 清空设备列表
  devices.forEach(device => {
    const deviceItem = document.createElement('div');
    deviceItem.className = 'split-button';
    deviceItem.textContent = device;
    deviceItem.addEventListener('click', () => {
      selectedDevice = device;
      updateBurnButtonState();
    });
    deviceList.appendChild(deviceItem);
  });
});

// 更新烧录按钮状态
function updateBurnButtonState() {
  if (selectedImage && selectedDevice) {
    burnButton.classList.remove('disabled');
  } else {
    burnButton.classList.add('disabled');
  }
}

// 烧录按钮点击事件
burnButton.addEventListener('click', () => {
  if (burnButton.classList.contains('disabled')) return;
  ipcRenderer.send('start-burn', { image: selectedImage, device: selectedDevice });
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

settingsBtn.addEventListener('click', () => {
  ipcRenderer.send('open-settings');
});
