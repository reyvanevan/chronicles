const MAX_IMAGE_SIZE = 500 * 1024;

export async function compressImageToBase64(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let encoded = canvas.toDataURL('image/jpeg', quality);

                while (encoded.length > MAX_IMAGE_SIZE && quality > 0.3) {
                    quality -= 0.1;
                    encoded = canvas.toDataURL('image/jpeg', quality);
                }

                if (encoded.length > MAX_IMAGE_SIZE) {
                    const scale = Math.sqrt(MAX_IMAGE_SIZE / encoded.length);
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    encoded = canvas.toDataURL('image/jpeg', 0.6);
                }

                resolve(encoded);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
