import { UIHorizontalRule, UIPanel, UIRow } from './libs/ui.js';

function MenubarView(editor) {
    const signals = editor.signals;
    const strings = editor.strings;

    const container = new UIPanel();
    container.setClass('menu');

    const title = new UIPanel();
    title.setClass('title');
    title.setTextContent(strings.getKey('menubar/view'));
    container.add(title);

    const options = new UIPanel();
    options.setClass('options');
    container.add(options);

    // Helpers

    const states = {
        gridHelper: true,
        cameraHelpers: true,
        lightHelpers: true,
        skeletonHelpers: true
    };

    // Grid Helper
    let option = new UIRow().addClass('option').addClass('toggle').setTextContent(strings.getKey('menubar/view/gridHelper')).onClick(function () {
        states.gridHelper = !states.gridHelper;
        this.toggleClass('toggle-on', states.gridHelper);
        signals.showHelpersChanged.dispatch(states);
    }).toggleClass('toggle-on', states.gridHelper);
    options.add(option);

    // Camera Helpers
    option = new UIRow().addClass('option').addClass('toggle').setTextContent(strings.getKey('menubar/view/cameraHelpers')).onClick(function () {
        states.cameraHelpers = !states.cameraHelpers;
        this.toggleClass('toggle-on', states.cameraHelpers);
        signals.showHelpersChanged.dispatch(states);
    }).toggleClass('toggle-on', states.cameraHelpers);
    options.add(option);

    // Light Helpers
    option = new UIRow().addClass('option').addClass('toggle').setTextContent(strings.getKey('menubar/view/lightHelpers')).onClick(function () {
        states.lightHelpers = !states.lightHelpers;
        this.toggleClass('toggle-on', states.lightHelpers);
        signals.showHelpersChanged.dispatch(states);
    }).toggleClass('toggle-on', states.lightHelpers);
    options.add(option);

    // Skeleton Helpers
    option = new UIRow().addClass('option').addClass('toggle').setTextContent(strings.getKey('menubar/view/skeletonHelpers')).onClick(function () {
        states.skeletonHelpers = !states.skeletonHelpers;
        this.toggleClass('toggle-on', states.skeletonHelpers);
        signals.showHelpersChanged.dispatch(states);
    }).toggleClass('toggle-on', states.skeletonHelpers);
    options.add(option);

    options.add(new UIHorizontalRule());

    // Fullscreen
    option = new UIRow();
    option.setClass('option');
    option.setTextContent(strings.getKey('menubar/view/fullscreen'));
    option.onClick(function () {
        if (document.fullscreenElement === null) {
            document.documentElement.requestFullscreen().catch((err) => console.log(err));
        } else if (document.exitFullscreen) {
            document.exitFullscreen().catch((err) => console.log(err));
        }

        // Safari fallback
        if (document.webkitFullscreenElement === null) {
            document.documentElement.webkitRequestFullscreen().catch((err) => console.log(err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch((err) => console.log(err));
        }
    });
    options.add(option);

    // Sidebar visibility toggle
    const toggleSidebarOption = new UIRow();
    toggleSidebarOption.setClass('option');
    toggleSidebarOption.setTextContent('Toggle Sidebar');
    toggleSidebarOption.onClick(function () {
        const sidebar = document.getElementById('sidebar');
        const resizer = document.querySelector('.TabbedPanel');
        const viewport = document.getElementById('viewport'); // Если это влияет на фон

        if (sidebar && resizer && viewport) {
            if (sidebar.classList.contains('sidebar-hidden')) {
                sidebar.classList.remove('sidebar-hidden');
                resizer.classList.remove('resizer-hidden');
                viewport.classList.remove('viewport-adjust');
            } else {
                sidebar.classList.add('sidebar-hidden');
                resizer.classList.add('resizer-hidden');
                viewport.classList.add('viewport-adjust');
            }
        } else {
            console.error('Не найден sidebar или другие элементы');
        }
    });
    options.add(toggleSidebarOption);

    // Добавляем стили для скрытия sidebar и фона
    const style = document.createElement('style');
    style.innerHTML = `
        #sidebar, .TabbedPanel, #viewport {
            transition: transform 0.3s ease, width 0.3s ease;
        }

        #sidebar.sidebar-hidden {
            transform: translateX(100%); /* Скрываем sidebar */
        }

        .resizer-hidden {
            display: none; /* Скрываем фон */
        }

        #viewport.viewport-adjust {
            width: 100%; /* Увеличиваем viewport, если sidebar скрыт */
        }
    `;
    document.head.appendChild(style);

    return container;
}

export { MenubarView };
