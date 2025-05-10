const map = L.map('map').setView([31.2304, 121.4737], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
}).addTo(map);

let footprints = [];
let lastClickedLatLng = null;

const addBtn = document.getElementById('addBtn');
const popup = document.getElementById('popup');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const noteInput = document.getElementById('noteInput');
const imageInput = document.getElementById('imageInput');

// 点击地图获取坐标
map.on('click', (e) => {
    lastClickedLatLng = e.latlng;
    addBtn.click(); // 自动弹窗
});

// 显示弹窗
addBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
});

// 隐藏弹窗
cancelBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    noteInput.value = '';
    imageInput.value = '';
});

// 确认添加足迹
confirmBtn.addEventListener('click', () => {
    if (!lastClickedLatLng) return alert('请先在地图上点击一个位置~');

    const note = noteInput.value;
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const imageData = reader.result;
        const time = new Date().toLocaleString();

        const point = {
            latlng: lastClickedLatLng,
            note,
            time,
            image: imageData
        };

        footprints.push(point);

        const marker = L.marker(lastClickedLatLng).addTo(map);
        marker.bindPopup(`
      <b>🕒 ${time}</b><br>
      📝 ${note}<br>
      ${imageData ? `<img src="${imageData}" style="max-width: 150px; max-height: 100px;">` : ''}
    `);

        updateLine();
        popup.classList.add('hidden');
        noteInput.value = '';
        imageInput.value = '';
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload(); // 没图也添加
    }
});

// 连线所有足迹点
let polyline;
function updateLine() {
    const latlngs = footprints.map(f => f.latlng);
    if (polyline) map.removeLayer(polyline);
    polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
}
