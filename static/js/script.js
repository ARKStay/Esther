let videoStream; // Untuk menyimpan stream video

async function setupWebcam() {
    const videoElement = document.getElementById('videoElement');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            videoStream = stream; // Simpan stream video ke variabel
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        setupWebcam(); // Pastikan elemen video telah dimuat sebelum mengaksesnya
        // Menambahkan event listener dan kode lainnya di sini
    });

const startAbsensiButton = document.getElementById('startDetection');
startAbsensiButton.addEventListener('click', async function(){
    const videoElement = document.getElementById('videoElement');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Menampilkan gambar yang diambil pada bekas tampilan kamera
    videoElement.style.display = 'none'; // Sembunyikan video
    const imageElement = document.createElement('img');
    const imageDataURL = canvas.toDataURL('image/jpeg');
    imageElement.src = imageDataURL;
    imageElement.style.borderRadius = '5px';
    videoElement.parentNode.replaceChild(imageElement, videoElement);
    
    // Ambil data gambar sebagai blob
    canvas.toBlob(async function(blob) {
        // Buat objek FormData dan tambahkan blob gambar ke dalamnya
        const formData = new FormData();
        formData.append('image', blob);

        // Kirim permintaan POST dengan FormData yang berisi blob gambar
        const response = await fetch('/startDetection', { method: 'POST',body: formData });
        const data = await response.json();
        const gambar = data.image_url;
        // Ubah sumber gambar pada elemen <img> dengan hasil deteksi dari server Flask
        imageElement.src = gambar;
    }, 'image/jpeg');

    // Hapus file-file dalam folder "Testing"
    //await fetch('/deleteTestingFiles', { method: 'POST' });
});

document.getElementById("resetCamera").addEventListener("click", function() {
    location.reload();
});