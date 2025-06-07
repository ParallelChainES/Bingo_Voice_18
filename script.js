document.addEventListener('DOMContentLoaded', () => {
  const recordBtn = document.getElementById('recordBtn');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const message = document.getElementById('message');
  const access = document.getElementById('access');

  if (!recordBtn) return; // prevención por si algo falla

  recordBtn.addEventListener('click', async () => {
    status.textContent = "Requesting microphone access...";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      status.textContent = "Recording... please say the phrase.";

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
          : "❌ Verification failed. Please try again.";

        if (isAdult) {
          access.classList.remove('hidden');
        }
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 3000);

    } catch (err) {
      status.textContent = "Microphone access denied.";
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
});
