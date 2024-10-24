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
            skyContainer = new THREE.Object3D();
            skyContainer.name = 'Sky';

            const sky = new Sky();
            sky.scale.setScalar( 450000 );
            skyContainer.add( sky );

            const sun = new THREE.Vector3();
            sun.x = 4000;
            sun.y = 800;
            sun.z = -500;
            sky.material.uniforms['sunPosition'].value.copy( sun );

            editor.execute( new AddObjectCommand( editor, skyContainer ) );

            const guiContainer = document.createElement('div');
            guiContainer.id = 'gui-container';
            document.body.appendChild(guiContainer);

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

            gui.add(skyParams, 'turbidity', 0, 20).onChange(() => {
                sky.material.uniforms['turbidity'].value = skyParams.turbidity;
                sky.material.needsUpdate = true;
                editor.signals.sceneGraphChanged.dispatch();
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
            if ( skyContainer ) {
                editor.execute( new RemoveObjectCommand( editor, skyContainer ) );
                skyContainer = null;
            }

            if ( gui ) {
                gui.destroy();
                gui = null;
            }
        }
    });

    // Добавляем пункт Shadows с чекбоксом
    const optionShadows = new UIRow();
    const checkboxShadows = new UICheckbox();
    optionShadows.setClass( 'option' );
    optionShadows.setTextContent( 'Shadows' );
    optionShadows.add( checkboxShadows );
    options.add( optionShadows );

    checkboxShadows.onChange(function () {
        if (this.getValue() === true) {
            // Включаем рендеринг теней
            editor.renderer.shadowMap.enabled = true;

            editor.scene.traverse(function (object) {
                if (object.isLight) {
                    object.castShadow = true;  // Свет может отбрасывать тени
                }
                if (object.isMesh) {
                    object.castShadow = true;  // Объект может отбрасывать тени
                    object.receiveShadow = true;  // Объект может получать тени
                }
            });
        } else {
            // Отключаем рендеринг теней
            editor.renderer.shadowMap.enabled = false;

            editor.scene.traverse(function (object) {
                if (object.isMesh) {
                    object.castShadow = false;
                    object.receiveShadow = false;
                }
            });
        }
    });

    return container;
}

export { MenubarShaders };
