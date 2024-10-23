import { UIPanel, UIRow, UICheckbox } from './libs/ui.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import * as THREE from 'three';
import { AddObjectCommand } from './commands/AddObjectCommand.js';  // Импортируем команду для добавления объектов
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';  // Импортируем команду для удаления объектов

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

    // Обрабатываем включение/выключение чекбокса
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
            sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

            // Добавляем контейнер с небом в сцену и иерархию
            editor.execute( new AddObjectCommand( editor, skyContainer ) );

        } else {
            // Убираем небо при выключении чекбокса
            if ( skyContainer ) {
                editor.execute( new RemoveObjectCommand( editor, skyContainer ) );  // Удаляем контейнер
                skyContainer = null;
            }
        }
    });

    return container;
}

export { MenubarShaders };
