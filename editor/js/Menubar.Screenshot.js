import { UIPanel, UIRow } from './libs/ui.js';

function MenubarScreenshot( editor ) {

    const container = new UIPanel();
    container.setClass( 'menu' );

    const title = new UIPanel();
    title.setClass( 'title' );
    title.setTextContent( 'Screenshot' );
    container.add( title );

    const options = new UIPanel();
    options.setClass( 'options' );
    container.add( options );

    // Создаем или получаем рендерер
    let renderer = editor.renderer;

    if (!renderer) {
        // Создаем новый рендерер, если его нет
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        editor.renderer = renderer; // Сохраняем его в editor
    }

    const camera = editor.camera;  // Убедитесь, что у вас есть камера
    const scene = editor.scene;    // Убедитесь, что у вас есть сцена

    // Screenshot Button
    const screenshotOption = new UIRow();
    screenshotOption.setClass( 'option' );
    screenshotOption.setTextContent( 'Take Screenshot' );
    screenshotOption.onClick( function () {
        // Рендер сцены перед созданием скриншота
        renderer.render(scene, camera);

        const canvas = renderer.domElement;
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'screenshot.png';
            link.click();
        });
    });
    options.add( screenshotOption );

    // Screenshot Fullscreen Button
    const fullscreenOption = new UIRow();
    fullscreenOption.setClass( 'option' );
    fullscreenOption.setTextContent( 'Screenshot in Fullscreen' );
    fullscreenOption.onClick( function () {
        if (document.fullscreenElement === null) {
            document.documentElement.requestFullscreen().then(() => {
                takeFullscreenScreenshot(renderer, scene, camera);
            });
        } else {
            takeFullscreenScreenshot(renderer, scene, camera);
        }
    });
    options.add( fullscreenOption );

    // Добавляем новую кнопку для отправки скриншота в Telegram
    const telegramOption = new UIRow();
    telegramOption.setClass( 'option' );
    telegramOption.setTextContent( 'Send Screenshot to Telegram' );
    telegramOption.onClick( function () {
        sendScreenshotToTelegram(renderer, scene, camera);
    });
    options.add( telegramOption );

    // Функция для создания скриншота в полноэкранном режиме
    function takeFullscreenScreenshot(renderer, scene, camera) {
        renderer.render(scene, camera);  // Рендер сцены перед скриншотом
        const canvas = renderer.domElement;
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'fullscreen-screenshot.png';
            link.click();
        });
    }

    // Функция для отправки скриншота в Telegram
    function sendScreenshotToTelegram(renderer, scene, camera) {
        renderer.render(scene, camera);  // Рендер сцены перед скриншотом
        const canvas = renderer.domElement;
        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('chat_id', '-1002463785174'); // ID вашего канала
            formData.append('photo', blob, 'screenshot.png');

            fetch(`https://api.telegram.org/bot7289005505:AAGQGTDe8SUPmUv_IZ1cE6iYsx2eiXQAcNU/sendPhoto`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Screenshot sent successfully to Telegram!');
                } else {
                    console.error('Error sending screenshot to Telegram:', data);
                }
            })
            .catch(error => {
                console.error('Failed to send screenshot to Telegram:', error);
            });
        });
    }

    return container;

}

export { MenubarScreenshot };
