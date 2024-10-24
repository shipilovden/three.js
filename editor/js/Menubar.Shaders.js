import { UIPanel, UIRow, UICheckbox } from './libs/ui.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'; // Импорт EXRLoader
import * as THREE from 'three';
import { AddObjectCommand } from './commands/AddObjectCommand.js';  // Импортируем команду для добавления объектов
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';  // Импортируем команду для удаления объектов
import * as dat from '../../node_modules/dat.gui/build/dat.gui.module.js';  // Подключаем dat.GUI

function MenubarShaders(editor) {
    const container = new UIPanel();
    container.setClass('menu');

    const title = new UIPanel();
    title.setTextContent('Shaders');
    title.setClass('title');
    container.add(title);

    const options = new UIPanel();
    options.setClass('options');
    container.add(options);

    // Добавляем пункт Clouds с чекбоксом
    const optionClouds = new UIRow();
    const checkboxClouds = new UICheckbox();
    optionClouds.setClass('option');
    optionClouds.setTextContent('Clouds');
    optionClouds.add(checkboxClouds);
    options.add(optionClouds);

    let clouds = [];
    const cloudTextureFile = 'assets/sky/1.png';  // Используем 1.png вместо EXR
    const loader = new THREE.TextureLoader();
    const cloudTexture = loader.load(cloudTextureFile);

    const cloudParams = {
        speed: 0.02, // скорость движения облаков
        size: 5, // размер облаков
        number: 10, // количество облаков
        positionX: 0, // положение по оси X
        positionY: 10, // положение по оси Y (высота)
        positionZ: 0, // положение по оси Z
        rotationX: 0, // вращение по оси X
        rotationY: 0, // вращение по оси Y
        rotationZ: 0, // вращение по оси Z
        scale: 1, // масштаб облаков
        resetClouds: () => resetCloudPositions() // функция сброса позиций
    };

    let guiClouds;
    checkboxClouds.onChange(function () {
        if (this.getValue() === true) {
            console.log("Clouds enabled");
            createClouds();
            guiClouds = new dat.GUI();
            
            guiClouds.add(cloudParams, 'speed', 0.01, 0.1).name('Cloud Speed').onChange((value) => {
                console.log(`Cloud Speed: ${value}`);
            });
            
            guiClouds.add(cloudParams, 'size', 1, 10).name('Cloud Size').onChange((value) => {
                console.log(`Cloud Size: ${value}`);
                createClouds(); // пересоздаём облака
            });
            
            guiClouds.add(cloudParams, 'number', 1, 50).name('Cloud Number').onChange((value) => {
                console.log(`Cloud Number: ${value}`);
                createClouds(); // пересоздаём облака
            });

            // Настройки позиции с логированием
            guiClouds.add(cloudParams, 'positionX', -100, 100).name('Position X').onChange((value) => {
                console.log(`Cloud Position X: ${value}`);
                updateCloudPosition();
            });

            guiClouds.add(cloudParams, 'positionY', 0, 100).name('Position Y').onChange((value) => {
                console.log(`Cloud Position Y: ${value}`);
                updateCloudPosition();
            });

            guiClouds.add(cloudParams, 'positionZ', -100, 100).name('Position Z').onChange((value) => {
                console.log(`Cloud Position Z: ${value}`);
                updateCloudPosition();
            });

            // Настройки вращения с логированием
            guiClouds.add(cloudParams, 'rotationX', 0, Math.PI * 2).name('Rotation X').onChange((value) => {
                console.log(`Cloud Rotation X: ${value}`);
                updateCloudRotation();
            });

            guiClouds.add(cloudParams, 'rotationY', 0, Math.PI * 2).name('Rotation Y').onChange((value) => {
                console.log(`Cloud Rotation Y: ${value}`);
                updateCloudRotation();
            });

            guiClouds.add(cloudParams, 'rotationZ', 0, Math.PI * 2).name('Rotation Z').onChange((value) => {
                console.log(`Cloud Rotation Z: ${value}`);
                updateCloudRotation();
            });

            // Настройки масштаба с логированием
            guiClouds.add(cloudParams, 'scale', 0.1, 10).name('Scale').onChange((value) => {
                console.log(`Cloud Scale: ${value}`);
                updateCloudScale();
            });

            guiClouds.add(cloudParams, 'resetClouds').name('Reset Clouds').onChange(() => {
                console.log("Cloud positions reset");
            });

        } else {
            console.log("Clouds disabled");
            if (clouds.length) {
                clouds.forEach(cloud => editor.scene.remove(cloud));
                clouds = [];
            }
            if (guiClouds) {
                guiClouds.destroy();
                guiClouds = null;
            }
        }
    });

    function createClouds() {
        clouds.forEach(cloud => editor.scene.remove(cloud)); // Удаляем старые облака
        clouds = [];
    
        for (let i = 0; i < cloudParams.number; i++) {
            const material = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                transparent: true,
                side: THREE.DoubleSide // Делаем материал двусторонним
            });
            
            const cloudGeometry = new THREE.PlaneGeometry(cloudParams.size, cloudParams.size);
    
            const cloud = new THREE.Mesh(cloudGeometry, material);
    
            // Установка случайных позиций для облаков
            const randomHeight = 10 + (Math.random() * 10 - 5); // Случайная высота от 5 до 15
    
            cloud.position.set(
                Math.random() * 100 - 50, // X
                randomHeight, // Случайная высота облаков
                Math.random() * 100 - 50  // Z
            );
    
            // Поворачиваем плоскость на 90 градусов, чтобы она была горизонтально и "рисунком вниз"
            cloud.rotation.x = THREE.MathUtils.degToRad(90); // Поворот на 90 градусов по оси X
    
            editor.scene.add(cloud);
            clouds.push(cloud);
        }
    }
    
    
    

    // Обновление позиции облаков
    function updateCloudPosition() {
        console.log(`Updating Cloud Position: X: ${cloudParams.positionX}, Y: ${cloudParams.positionY}, Z: ${cloudParams.positionZ}`);
        clouds.forEach(cloud => {
            cloud.position.set(cloudParams.positionX, cloudParams.positionY, cloudParams.positionZ);
        });
    }

    // Обновление вращения облаков
    function updateCloudRotation() {
        console.log(`Updating Cloud Rotation: X: ${cloudParams.rotationX}, Y: ${cloudParams.rotationY}, Z: ${cloudParams.rotationZ}`);
        clouds.forEach(cloud => {
            cloud.rotation.set(cloudParams.rotationX, cloudParams.rotationY, cloudParams.rotationZ);
        });
    }

    // Обновление масштаба облаков
    function updateCloudScale() {
        console.log(`Updating Cloud Scale: ${cloudParams.scale}`);
        clouds.forEach(cloud => {
            cloud.scale.setScalar(cloudParams.scale);
        });
    }

    // Функция сброса позиций облаков
    function resetCloudPositions() {
        console.log("Resetting Cloud Positions");
        clouds.forEach(cloud => {
            cloud.position.set(
                Math.random() * 100 - 50, // X
                cloudParams.positionY, // Y
                Math.random() * 100 - 50 // Z
            );
        });
    }

    function animateClouds() {
        requestAnimationFrame(animateClouds);
    
        clouds.forEach(cloud => {
            cloud.position.x += cloudParams.speed;  // Скорость движения облаков
    
            // Возвращаем облако на начало, когда оно уходит за пределы
            if (cloud.position.x > 100) {
                cloud.position.x = -100;
            }
        });
    
        editor.renderer.render(editor.scene, editor.camera);
    }
    
    animateClouds();

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
