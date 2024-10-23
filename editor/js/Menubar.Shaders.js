import { UIPanel, UIRow, UICheckbox } from './libs/ui.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import * as THREE from 'three';
import { AddObjectCommand } from './commands/AddObjectCommand.js';  // Импортируем команду для добавления объектов
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';  // Импортируем команду для удаления объектов
import * as dat from '../../node_modules/dat.gui/build/dat.gui.module.js';  // Подключаем dat.GUI

function MenubarShaders( editor ) {
    const container = new UIPanel();
    container.setClass( 'menu' );

    const title = new UIPanel();
    title.setTextContent( 'Shaders' );
    title.setClass( 'title' );
    container.add( title );

    const options = new UIPanel();
    options.setClass( 'options' );
    container.add( options );

    // Добавляем пункт Sky с чекбоксом
    const optionSky = new UIRow();
    const checkboxSky = new UICheckbox();
    optionSky.setClass( 'option' );
    optionSky.setTextContent( 'Sky' );
    optionSky.add( checkboxSky );
    options.add( optionSky );

    let skyContainer;
    let gui;  // GUI для настроек неба

    // Обрабатываем включение/выключение чекбокса для Sky
    checkboxSky.onChange(function () {
        if ( this.getValue() === true ) {
            // Создаём контейнер для неба (делаем его полноценным объектом для иерархии)
            skyContainer = new THREE.Object3D();
            skyContainer.name = 'Sky';

            // Создаём небо
            const sky = new Sky();
            sky.scale.setScalar( 450000 );
            skyContainer.add( sky );  // Добавляем небо в контейнер

            // Настраиваем позицию солнца
            const sun = new THREE.Vector3();
            sun.x = 4000;
            sun.y = 800;
            sun.z = -500;
            sky.material.uniforms['sunPosition'].value.copy( sun );

            // Добавляем контейнер с небом в сцену и иерархию
            editor.execute( new AddObjectCommand( editor, skyContainer ) );

            // Создаём контейнер для GUI
            const guiContainer = document.createElement('div');
            guiContainer.id = 'gui-container';
            document.body.appendChild(guiContainer);

            // Создаём GUI внутри этого контейнера
            gui = new dat.GUI({ autoPlace: false });
            guiContainer.appendChild(gui.domElement);

            const skyParams = {
                turbidity: 10,
                rayleigh: 2,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.8,
                elevation: 2,  // Высота солнца
                azimuth: 180,  // Азимут (угол солнца)
                exposure: 0.5
            };

            // Добавляем настройки в GUI с обновлением сцены
            gui.add(skyParams, 'turbidity', 0, 20).onChange(() => {
                sky.material.uniforms['turbidity'].value = skyParams.turbidity;
                sky.material.needsUpdate = true;  // Обновляем шейдер
                editor.signals.sceneGraphChanged.dispatch();  // Сообщаем редактору об изменении
            });

            gui.add(skyParams, 'rayleigh', 0, 4).onChange(() => {
                sky.material.uniforms['rayleigh'].value = skyParams.rayleigh;
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
            });

            gui.add(skyParams, 'mieCoefficient', 0, 0.1).onChange(() => {
                sky.material.uniforms['mieCoefficient'].value = skyParams.mieCoefficient;
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
            });

            gui.add(skyParams, 'mieDirectionalG', 0, 1).onChange(() => {
                sky.material.uniforms['mieDirectionalG'].value = skyParams.mieDirectionalG;
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
            });

            gui.add(skyParams, 'elevation', 0, 90).onChange(() => {
                const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
                const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
                sun.setFromSphericalCoords(1, phi, theta);
                sky.material.uniforms['sunPosition'].value.copy(sun);
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
            });

            gui.add(skyParams, 'azimuth', -180, 180).onChange(() => {
                const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation);
                const theta = THREE.MathUtils.degToRad(skyParams.azimuth);
                sun.setFromSphericalCoords(1, phi, theta);
                sky.material.uniforms['sunPosition'].value.copy(sun);
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
            });

            gui.add(skyParams, 'exposure', 0, 1).onChange(() => {
                editor.renderer.toneMappingExposure = skyParams.exposure;
                editor.signals.sceneGraphChanged.dispatch();
            });

        } else {
            // Убираем небо при выключении чекбокса
            if ( skyContainer ) {
                editor.execute( new RemoveObjectCommand( editor, skyContainer ) );  // Удаляем контейнер
                skyContainer = null;
            }

            // Убираем GUI, если чекбокс снят
            if ( gui ) {
                gui.destroy();  // Удаляем GUI
                gui = null;
            }
        }
    });

    return container;
}

export { MenubarShaders };
