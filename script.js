function openModal() {
  document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

document.getElementById('recordBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const message = document.getElementById('message');
  const access = document.getElementById('access');

  status.textContent = "Requesting microphone access...";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    status.textContent = "Recording... say the verification phrase.";

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });

      status.textContent = "Verifying...";
      const isAdult = await simulateApiResponse(blob);

      result.classList.remove('hidden');
      message.textContent = isAdult
        ? "✅ Verification passed!"
        : "❌ Verification failed. Try again.";

      if (isAdult) {
        access.classList.remove('hidden');
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000);

  } catch (err) {
    status.textContent = "Microphone access denied or unavailable.";
  }
});

function simulateApiResponse(audioBlob) {
  return new Promise(resolve => {
    setTimeout(() => {
      const isAdult = Math.random() > 0.3;
      resolve(isAdult);
    }, 2000);
  });
}
