const startBtn = document.getElementById('startBtn');
const verification = document.getElementById('verification');
const recordBtn = document.getElementById('recordBtn');
const status = document.getElementById('status');
const result = document.getElementById('result');
const message = document.getElementById('message');
const explanation = document.getElementById('explanation');
const noMicLink = document.getElementById('noMicLink');
const qrContainer = document.getElementById('qrContainer');

startBtn.addEventListener('click', () => {
  verification.classList.remove('hidden');
});

recordBtn.addEventListener('click', async () => {
  status.textContent = "Solicitando acceso al micrófono...";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    status.textContent = "Grabando... por favor, di la frase.";

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });

      status.textContent = "Analizando...";
      const isAdult = await simulateApiResponse(blob);

      result.classList.remove('hidden');
      message.textContent = isAdult
        ? "✅ Gracias. Puedes acceder."
        : "❌ Parece que no has pasado la prueba. Si eres mayor de 18 años, vuelve a intentarlo.";

      if (isAdult) {
        explanation.classList.remove('hidden');
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000);

  } catch (err) {
    status.textContent = "Error: No se pudo acceder al micrófono.";
  }
});

noMicLink.addEventListener('click', () => {
  qrContainer.classList.remove('hidden');
  generateQR("https://parallelchain.org/bingo-voice/mobile");
});

function simulateApiResponse(audioBlob) {
  return new Promise(resolve => {
    setTimeout(() => {
      const isAdult = Math.random() > 0.3;
      resolve(isAdult);
    }, 2000);
  });
}

function generateQR(text) {
  const canvas = document.getElementById('qrcode');
  import('https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js').then(QRCode => {
    QRCode.default.toCanvas(canvas, text, error => {
      if (error) console.error(error);
    });
  });
}
